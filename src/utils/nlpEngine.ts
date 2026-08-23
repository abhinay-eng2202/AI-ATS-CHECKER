import { SKILLS_TAXONOMY, STOP_WORDS } from '../data/skillsDatabase';
import { KeywordItem, SkillItem, ComponentScores, Recommendation, AnalysisResult } from '../types';
import { evaluateStructure, extractCandidateName } from './textParser';

/**
 * Tokenizes text into cleaned lower-case words
 */
export function tokenize(text: string): string[] {
  if (!text) return [];
  // Normalize and replace punctuation
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\-_/\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.split(' ').filter(word => {
    // Keep words with length >= 2, or recognized single letters if relevant
    return word.length >= 2 && !STOP_WORDS.has(word);
  });
}

/**
 * Generates n-grams from token array (unigram, bigram, trigram)
 */
export function generateNgrams(tokens: string[], n: number): string[] {
  const ngrams: string[] = [];
  for (let i = 0; i <= tokens.length - n; i++) {
    const gram = tokens.slice(i, i + n).join(' ');
    // Filter out ngrams made purely of stopwords if any leaked
    ngrams.push(gram);
  }
  return ngrams;
}

/**
 * Extracts top TF-IDF keywords and n-grams from Job Description and compares against Resume
 */
export function extractAndMatchKeywords(
  resumeText: string,
  jobText: string,
  topK: number = 30
): {
  matchedKeywords: KeywordItem[];
  missingKeywords: KeywordItem[];
  allJobKeywords: KeywordItem[];
  matchRate: number;
  keywordScore: number;
} {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobText);

  const resumeLower = resumeText.toLowerCase();

  // Create token frequency map for Job
  const unigrams = jobTokens;
  const bigrams = generateNgrams(jobTokens, 2);
  const trigrams = generateNgrams(jobTokens, 3);

  const termFreqMap = new Map<string, { count: number; type: 'unigram' | 'bigram' | 'trigram' }>();

  // Count unigrams
  for (const u of unigrams) {
    if (!STOP_WORDS.has(u) && u.length >= 3) {
      const existing = termFreqMap.get(u) || { count: 0, type: 'unigram' };
      existing.count += 1;
      termFreqMap.set(u, existing);
    }
  }

  // Count bigrams (boost weight for multi-word phrases)
  for (const b of bigrams) {
    const parts = b.split(' ');
    if (!STOP_WORDS.has(parts[0]) && !STOP_WORDS.has(parts[1])) {
      const existing = termFreqMap.get(b) || { count: 0, type: 'bigram' };
      existing.count += 1.5;
      termFreqMap.set(b, existing);
    }
  }

  // Count trigrams
  for (const t of trigrams) {
    const parts = t.split(' ');
    if (!STOP_WORDS.has(parts[0]) && !STOP_WORDS.has(parts[2])) {
      const existing = termFreqMap.get(t) || { count: 0, type: 'trigram' };
      existing.count += 2;
      termFreqMap.set(t, existing);
    }
  }

  // Calculate TF-IDF approximations
  const totalTerms = jobTokens.length || 1;
  const scoredTerms: KeywordItem[] = [];

  termFreqMap.forEach((meta, term) => {
    const tf = meta.count / totalTerms;
    // Boost longer relevant terms
    const idfWeight = meta.type === 'trigram' ? 3.0 : meta.type === 'bigram' ? 2.2 : 1.2;
    const score = Math.round(tf * idfWeight * 1000) / 10;

    // Check count in resume
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedTerm}\\b`, 'gi');
    const matches = resumeLower.match(regex);
    const resumeCount = matches ? matches.length : 0;
    const isMatched = resumeCount > 0;

    scoredTerms.push({
      term,
      tfidfScore: score,
      countInJob: Math.round(meta.count),
      countInResume: resumeCount,
      matched: isMatched,
      type: meta.type
    });
  });

  // Sort by score descending and take topK unique
  scoredTerms.sort((a, b) => b.tfidfScore - a.tfidfScore);
  const selectedKeywords = scoredTerms.slice(0, topK);

  const matchedKeywords = selectedKeywords.filter(k => k.matched);
  const missingKeywords = selectedKeywords.filter(k => !k.matched);

  const matchRate = selectedKeywords.length > 0
    ? Math.round((matchedKeywords.length / selectedKeywords.length) * 100)
    : 0;

  // Keyword Score incorporates weighted score
  const totalPossibleWeight = selectedKeywords.reduce((acc, k) => acc + k.tfidfScore, 0);
  const matchedWeight = matchedKeywords.reduce((acc, k) => acc + k.tfidfScore, 0);
  const weightedScore = totalPossibleWeight > 0
    ? Math.round((matchedWeight / totalPossibleWeight) * 100)
    : matchRate;

  return {
    matchedKeywords,
    missingKeywords,
    allJobKeywords: selectedKeywords,
    matchRate,
    keywordScore: weightedScore
  };
}

/**
 * Extracts technical skills from both documents and compares against the taxonomy
 */
export function extractAndCompareSkills(
  resumeText: string,
  jobText: string
): {
  matched: SkillItem[];
  missing: SkillItem[];
  additional: SkillItem[];
  allDetectedInJob: SkillItem[];
  matchRate: number;
  skillScore: number;
} {
  const resumeLower = ` ${resumeText.toLowerCase()} `;
  const jobLower = ` ${jobText.toLowerCase()} `;

  const jobSkills: SkillItem[] = [];
  const resumeSkillsMap = new Map<string, SkillItem>();

  for (const def of SKILLS_TAXONOMY) {
    // Check all aliases
    const searchTerms = [def.name, ...def.aliases];

    let countInJob = 0;
    let countInResume = 0;

    for (const term of searchTerms) {
      const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Look for boundary-safe match
      const regex = new RegExp(`(?:^|[^a-zA-Z0-9_+#-])${escaped}(?:$|[^a-zA-Z0-9_+#-])`, 'gi');

      const jobMatches = jobLower.match(regex);
      if (jobMatches) countInJob += jobMatches.length;

      const resumeMatches = resumeLower.match(regex);
      if (resumeMatches) countInResume += resumeMatches.length;
    }

    const inJob = countInJob > 0;
    const inResume = countInResume > 0;

    // Determine importance in job
    let importance: 'critical' | 'preferred' | 'optional' = 'preferred';
    if (countInJob >= 3) importance = 'critical';
    else if (countInJob === 1) importance = 'optional';

    const skillItem: SkillItem = {
      name: def.name,
      category: def.category,
      matched: inJob && inResume,
      frequencyInJob: countInJob,
      frequencyInResume: countInResume,
      importance
    };

    if (inJob) {
      jobSkills.push(skillItem);
    }

    if (inResume) {
      resumeSkillsMap.set(def.name, skillItem);
    }
  }

  const matched = jobSkills.filter(s => s.matched);
  const missing = jobSkills.filter(s => !s.matched);

  // Additional skills found in resume not requested in JD
  const additional: SkillItem[] = [];
  resumeSkillsMap.forEach((skill, name) => {
    if (!jobSkills.some(js => js.name === name)) {
      additional.push(skill);
    }
  });

  const totalJobSkills = jobSkills.length;
  const matchRate = totalJobSkills > 0
    ? Math.round((matched.length / totalJobSkills) * 100)
    : 100;

  // Weighted skill score: Critical skills count 1.5x, preferred 1.0x, optional 0.7x
  let weightedMax = 0;
  let weightedMatched = 0;

  for (const s of jobSkills) {
    const weight = s.importance === 'critical' ? 1.5 : s.importance === 'preferred' ? 1.0 : 0.7;
    weightedMax += weight;
    if (s.matched) {
      weightedMatched += weight;
    }
  }

  const skillScore = weightedMax > 0
    ? Math.round((weightedMatched / weightedMax) * 100)
    : matchRate;

  return {
    matched,
    missing,
    additional,
    allDetectedInJob: jobSkills,
    matchRate,
    skillScore
  };
}

/**
 * Computes Cosine Vector Similarity between Resume and Job Description
 */
export function calculateCosineSemanticSimilarity(resumeText: string, jobText: string): number {
  const resumeTokens = tokenize(resumeText);
  const jobTokens = tokenize(jobText);

  if (resumeTokens.length === 0 || jobTokens.length === 0) return 0;

  // Build combined vocabulary
  const vocab = new Set([...resumeTokens, ...jobTokens]);
  const vocabList = Array.from(vocab);

  const freq1 = new Map<string, number>();
  const freq2 = new Map<string, number>();

  for (const t of resumeTokens) freq1.set(t, (freq1.get(t) || 0) + 1);
  for (const t of jobTokens) freq2.set(t, (freq2.get(t) || 0) + 1);

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const word of vocabList) {
    const valA = freq1.get(word) || 0;
    const valB = freq2.get(word) || 0;

    dotProduct += valA * valB;
    normA += valA * valA;
    normB += valB * valB;
  }

  if (normA === 0 || normB === 0) return 0;
  const cosine = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));

  // Scale cosine (typically 0.2 - 0.8 for real texts) to a 0-100 realistic score
  const scaledScore = Math.min(100, Math.max(10, Math.round(cosine * 125)));
  return scaledScore;
}

/**
 * Calculate overall ATS Score using the report's formula:
 * ATS Score = 0.30 × Keyword + 0.30 × Skill + 0.25 × Semantic + 0.15 × Structure
 */
export function calculateAtsScores(
  keywordScore: number,
  skillScore: number,
  semanticScore: number,
  structureScore: number
): ComponentScores {
  const overall = (0.30 * keywordScore) + (0.30 * skillScore) + (0.25 * semanticScore) + (0.15 * structureScore);
  const overallScore = Math.round(overall * 10) / 10;

  let rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor' = 'Needs Improvement';
  if (overallScore >= 85) rating = 'Excellent';
  else if (overallScore >= 70) rating = 'Good';
  else if (overallScore >= 55) rating = 'Needs Improvement';
  else rating = 'Poor';

  return {
    keywordScore,
    skillScore,
    semanticScore,
    structureScore,
    overallScore,
    rating
  };
}

/**
 * Generates tailored, actionable improvement recommendations
 */
export function generateRecommendations(
  scores: ComponentScores,
  missingSkills: SkillItem[],
  missingKeywords: KeywordItem[],
  structureIssues: string[],
  quantifiedCount: number,
  targetRole: string
): Recommendation[] {
  const recs: Recommendation[] = [];

  // Skill Recommendations
  if (missingSkills.length > 0) {
    const criticalMissing = missingSkills.filter(s => s.importance === 'critical');
    const displaySkills = (criticalMissing.length > 0 ? criticalMissing : missingSkills)
      .slice(0, 4)
      .map(s => s.name)
      .join(', ');

    recs.push({
      id: 'rec-skills-missing',
      type: criticalMissing.length > 0 ? 'critical' : 'improvement',
      category: 'Skills',
      title: `Incorporate Target Skills: ${displaySkills}`,
      description: `The job posting heavily emphasizes skills such as ${displaySkills}. Adding relevant experience or coursework for these skills will directly lift your skill match score.`,
      actionableStep: `List ${displaySkills} in your Technical Skills section and mention them in specific project or work bullet points.`
    });
  }

  // Keyword Recommendations
  if (missingKeywords.length > 0) {
    const topKeywords = missingKeywords.slice(0, 5).map(k => `"${k.term}"`).join(', ');
    recs.push({
      id: 'rec-keywords-tfidf',
      type: 'improvement',
      category: 'Keywords',
      title: 'Optimize TF-IDF High-Relevance Keywords',
      description: `Your resume currently lacks several high-frequency phrases required by the ATS screener: ${topKeywords}.`,
      actionableStep: `Naturally integrate these keywords into your summary, project descriptions, and responsibilities.`
    });
  }

  // Quantifiable Impact Recommendation
  if (quantifiedCount < 4) {
    recs.push({
      id: 'rec-metrics-impact',
      type: 'improvement',
      category: 'Content',
      title: 'Quantify Achievements with Metrics & KPIs',
      description: `Only ${quantifiedCount} bullet points contain quantified metrics (e.g. percentages, latency reductions, user counts, dollar figures). ATS algorithms and recruiters favor the STAR format with tangible results.`,
      actionableStep: `Rewrite bullets using the formula: "Accomplished [X] as measured by [Y] by doing [Z]" (e.g., "Reduced latency by 35% across 50K+ daily records").`
    });
  }

  // Structure Issues
  for (let i = 0; i < Math.min(structureIssues.length, 3); i++) {
    const issue = structureIssues[i];
    recs.push({
      id: `rec-struct-${i}`,
      type: issue.includes('Missing direct email') || issue.includes('Missing phone') ? 'critical' : 'improvement',
      category: 'Structure',
      title: `Resume Structure: ${issue.replace(/\.$/, '')}`,
      description: `Applicant Tracking Systems require clearly labeled headers and standard formatting to parse candidate information reliably.`,
      actionableStep: `Follow standard ATS formatting guidelines without tables, multi-column blocks, or unstandardized header titles.`
    });
  }

  // Positive reinforcement if scores are strong
  if (scores.overallScore >= 75) {
    recs.push({
      id: 'rec-positive-match',
      type: 'positive',
      category: 'Semantic',
      title: `Strong Core Alignment for ${targetRole || 'Target Role'}`,
      description: `Your profile demonstrates strong conceptual alignment with the required responsibilities and foundational tech stack.`,
      actionableStep: `Maintain this clear formatting and consider tailoring specific bullet points for maximum impact.`
    });
  }

  return recs;
}

/**
 * Runs full local analysis pipeline
 */
export function runLocalAtsAnalysis(
  resumeText: string,
  jobDescriptionText: string,
  targetJobTitle: string = 'Software Engineer',
  fileName: string = 'Resume.pdf'
): AnalysisResult {
  const candidateName = extractCandidateName(resumeText);
  const structure = evaluateStructure(resumeText);
  const keywordAnalysis = extractAndMatchKeywords(resumeText, jobDescriptionText);
  const skillAnalysis = extractAndCompareSkills(resumeText, jobDescriptionText);
  const semanticSimilarity = calculateCosineSemanticSimilarity(resumeText, jobDescriptionText);

  const scores = calculateAtsScores(
    keywordAnalysis.keywordScore,
    skillAnalysis.skillScore,
    semanticSimilarity,
    structure.structureScore
  );

  const recommendations = generateRecommendations(
    scores,
    skillAnalysis.missing,
    keywordAnalysis.missingKeywords,
    structure.formattingIssues,
    structure.quantifiedBulletsCount,
    targetJobTitle
  );

  return {
    id: 'ats_' + Date.now(),
    timestamp: Date.now(),
    candidateName,
    targetJobTitle,
    resumeFileName: fileName,
    resumeText,
    jobDescriptionText,
    scores,
    skills: {
      matched: skillAnalysis.matched,
      missing: skillAnalysis.missing,
      additional: skillAnalysis.additional,
      allDetectedInJob: skillAnalysis.allDetectedInJob,
      matchRate: skillAnalysis.matchRate
    },
    keywords: {
      matchedKeywords: keywordAnalysis.matchedKeywords,
      missingKeywords: keywordAnalysis.missingKeywords,
      allJobKeywords: keywordAnalysis.allJobKeywords,
      matchRate: keywordAnalysis.matchRate
    },
    structure,
    recommendations,
    semanticAnalysis: {
      similarityScore: semanticSimilarity,
      conceptualStrengths: skillAnalysis.matched.slice(0, 5).map(s => s.name),
      conceptualGaps: skillAnalysis.missing.slice(0, 5).map(s => s.name),
      summary: `The resume exhibits a ${scores.rating.toLowerCase()} match (${scores.overallScore}%) against the ${targetJobTitle} position.`
    }
  };
}

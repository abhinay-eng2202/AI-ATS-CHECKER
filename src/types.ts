export interface SkillItem {
  name: string;
  category: 'Programming Languages' | 'AI / Machine Learning' | 'Web & Backend' | 'Cloud & DevOps' | 'Databases' | 'Tools & Methodologies';
  matched: boolean;
  frequencyInJob: number;
  frequencyInResume: number;
  importance: 'critical' | 'preferred' | 'optional';
}

export interface KeywordItem {
  term: string;
  tfidfScore: number;
  countInJob: number;
  countInResume: number;
  matched: boolean;
  type: 'unigram' | 'bigram' | 'trigram';
}

export interface SectionAnalysis {
  name: string;
  found: boolean;
  score: number;
  feedback: string;
  detectedHeader?: string;
}

export interface ContactDetails {
  email: string | null;
  phone: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  location: string | null;
}

export interface StructureMetric {
  hasContactInfo: boolean;
  contactDetails: ContactDetails;
  sections: SectionAnalysis[];
  bulletPointCount: number;
  quantifiedBulletsCount: number;
  actionVerbCount: number;
  wordCount: number;
  pageEstimate: number;
  formattingIssues: string[];
  structureScore: number; // 0-100
}

export interface ComponentScores {
  keywordScore: number;     // 30% weight
  skillScore: number;       // 30% weight
  semanticScore: number;    // 25% weight
  structureScore: number;   // 15% weight
  overallScore: number;     // 0-100
  rating: 'Excellent' | 'Good' | 'Needs Improvement' | 'Poor';
}

export interface Recommendation {
  id: string;
  type: 'critical' | 'improvement' | 'positive';
  category: 'Skills' | 'Keywords' | 'Structure' | 'Content' | 'Semantic';
  title: string;
  description: string;
  actionableStep: string;
}

export interface BulletRewrite {
  original: string;
  improved: string;
  reason: string;
  targetKeywordsIncluded: string[];
}

export interface ScoreHistoryPoint {
  revision: number;
  label: string;
  overallScore: number;
  keywordScore: number;
  skillScore: number;
  semanticScore: number;
  structureScore: number;
  timestamp: number;
  changeDescription?: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  candidateName: string;
  targetJobTitle: string;
  resumeFileName?: string;
  resumeText: string;
  jobDescriptionText: string;
  scores: ComponentScores;
  skills: {
    matched: SkillItem[];
    missing: SkillItem[];
    additional: SkillItem[];
    allDetectedInJob: SkillItem[];
    matchRate: number; // percentage
  };
  keywords: {
    matchedKeywords: KeywordItem[];
    missingKeywords: KeywordItem[];
    allJobKeywords: KeywordItem[];
    matchRate: number; // percentage
  };
  structure: StructureMetric;
  recommendations: Recommendation[];
  bulletRewrites?: BulletRewrite[];
  semanticAnalysis: {
    similarityScore: number; // 0-100
    conceptualStrengths: string[];
    conceptualGaps: string[];
    summary: string;
  };
}

export interface SampleProfile {
  id: string;
  title: string;
  category: string;
  candidateName: string;
  resumeText: string;
  targetJobTitle: string;
  jobDescriptionText: string;
}

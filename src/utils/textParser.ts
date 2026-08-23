import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth';
import { ContactDetails, SectionAnalysis, StructureMetric } from '../types';
import { ACTION_VERBS } from '../data/skillsDatabase';

// Set up pdf.js worker using local bundled asset via Vite
if (typeof window !== 'undefined' && (pdfjsLib as any).GlobalWorkerOptions) {
  (pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;
}

/**
 * Extracts plain text from a File (PDF, DOCX, or plain text)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return extractTextFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    return extractTextFromDOCX(file);
  } else if (fileName.endsWith('.txt') || fileName.endsWith('.rtf') || fileName.endsWith('.md')) {
    return file.text();
  } else {
    // Attempt standard text read
    return file.text();
  }
}

/**
 * Extracts text from PDF using pdfjs-dist
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDoc = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      fullText += pageText + '\n\n';
    }

    return cleanExtractedText(fullText);
  } catch (error) {
    console.warn('PDF parsing error via pdfjs, fallback to text decoding:', error);
    // Fallback: decode as text
    const raw = await file.text();
    // Strip non-printable chars
    return cleanExtractedText(raw.replace(/[^\x20-\x7E\n\r\t]/g, ' '));
  }
}

/**
 * Extracts text from DOCX using mammoth
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return cleanExtractedText(result.value);
  } catch (error) {
    console.warn('DOCX parsing error via mammoth:', error);
    return file.text();
  }
}

/**
 * Normalizes and cleans raw extracted text
 */
export function cleanExtractedText(text: string): string {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
}

/**
 * Parses contact information using robust regexes
 */
export function extractContactDetails(text: string): ContactDetails {
  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : null;

  // Phone regex (international + local formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{1,4}[-.\s]?\d{10}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : null;

  // LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i) || text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/[a-zA-Z0-9_-]+/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : null;

  // GitHub
  const githubMatch = text.match(/github\.com\/[a-zA-Z0-9_-]+/i) || text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const github = githubMatch ? githubMatch[0] : null;

  // Portfolio / Website
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:[a-zA-Z0-9-]+\.)?(?:github\.io|dev|app|me|io|tech|net|org|com)\/[a-zA-Z0-9_\-/]+/i);
  const portfolio = portfolioMatch && !portfolioMatch[0].includes('linkedin') && !portfolioMatch[0].includes('github.com')
    ? portfolioMatch[0]
    : null;

  // Location detection
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2,}(?:\s*\d{5})?|[A-Z][a-zA-Z\s]+,\s*(?:India|USA|United States|UK|United Kingdom|Canada|Germany|Singapore|Australia))/);
  const location = locationMatch ? locationMatch[0].trim() : null;

  return {
    email,
    phone,
    linkedin,
    github,
    portfolio,
    location
  };
}

/**
 * Detects Candidate Name from top lines of resume
 */
export function extractCandidateName(text: string): string {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i];
    // Avoid headers or emails or urls
    if (line.includes('@') || line.includes('http') || line.includes('.com') || line.includes('+')) continue;
    if (/^(RESUME|CURRICULUM|CV|PROFILE|SUMMARY)/i.test(line)) continue;
    if (line.length >= 3 && line.length <= 40 && /^[A-Za-z\s.'-]+$/.test(line)) {
      return line;
    }
  }
  return 'Candidate';
}

/**
 * Checks standard resume sections
 */
export function analyzeResumeSections(text: string): SectionAnalysis[] {
  const lower = text.toLowerCase();

  const standardSections = [
    {
      name: 'Contact Information',
      patterns: [/email|phone|linkedin|github|contact|phone/i],
      check: (t: string) => extractContactDetails(t).email !== null || extractContactDetails(t).phone !== null
    },
    {
      name: 'Professional Summary / Objective',
      patterns: [/(professional\s+summary|summary|objective|career\s+objective|about\s+me|profile)/i],
      check: (t: string) => /(professional\s+summary|summary|objective|career\s+objective|about\s+me|profile)/i.test(t)
    },
    {
      name: 'Work Experience',
      patterns: [/(work\s+experience|experience|employment\s+history|professional\s+experience|work\s+history|internship)/i],
      check: (t: string) => /(work\s+experience|experience|employment|professional\s+experience|work\s+history|internship)/i.test(t)
    },
    {
      name: 'Technical Skills',
      patterns: [/(technical\s+skills|skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+abilities)/i],
      check: (t: string) => /(technical\s+skills|skills|core\s+competencies|technologies|tools|programming\s+languages)/i.test(t)
    },
    {
      name: 'Education',
      patterns: [/(education|academic\s+background|qualifications|academic\s+history|degrees)/i],
      check: (t: string) => /(education|academic|bachelor|master|b\.tech|b\.e|b\.s|degree|university|college)/i.test(t)
    },
    {
      name: 'Projects',
      patterns: [/(projects|key\s+projects|academic\s+projects|personal\s+projects|portfolio\s+projects)/i],
      check: (t: string) => /(projects|key\s+projects|academic\s+projects|personal\s+projects)/i.test(t)
    },
    {
      name: 'Certifications & Achievements',
      patterns: [/(certifications|certificates|licenses|achievements|awards|honors|publications)/i],
      check: (t: string) => /(certifications|certificates|licenses|achievements|awards|honors|publications)/i.test(t)
    }
  ];

  return standardSections.map(sec => {
    const isFound = sec.check(text);
    let score = isFound ? 100 : 0;
    let feedback = '';

    if (isFound) {
      feedback = `Section clearly identified in resume.`;
    } else {
      if (sec.name === 'Contact Information' || sec.name === 'Technical Skills' || sec.name === 'Work Experience' || sec.name === 'Education') {
        feedback = `Critical section missing or not clearly marked with standard ATS header.`;
      } else {
        feedback = `Optional but recommended section to boost ATS score.`;
      }
    }

    return {
      name: sec.name,
      found: isFound,
      score,
      feedback
    };
  });
}

/**
 * Evaluates entire resume structure & formatting metrics
 */
export function evaluateStructure(text: string): StructureMetric {
  const contactDetails = extractContactDetails(text);
  const sections = analyzeResumeSections(text);

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Estimated page count (standard single spaced resume is ~400-500 words per page)
  const pageEstimate = Math.max(1, Math.round((wordCount / 450) * 10) / 10);

  // Bullet points
  const bulletLines = lines.filter(l => /^[•\-\*▪▫⁃›»]\s+/.test(l) || /^\d+\.\s+/.test(l));
  const bulletPointCount = Math.max(bulletLines.length, Math.round(lines.filter(l => l.length > 30 && l.length < 250).length * 0.6));

  // Quantified bullet points (contain numbers, %, $, ms, x, metrics)
  const quantifiedCount = lines.filter(l => {
    return /\b\d+(?:\.\d+)?%|\$\d+|\b\d+\+?|\b\d+x\b|\b\d+ms\b|\b\d+k\b/i.test(l);
  }).length;

  // Action verbs check
  const lowerText = text.toLowerCase();
  let actionVerbCount = 0;
  for (const verb of ACTION_VERBS) {
    const reg = new RegExp(`\\b${verb}\\b`, 'g');
    const matches = lowerText.match(reg);
    if (matches) {
      actionVerbCount += matches.length;
    }
  }

  const formattingIssues: string[] = [];

  if (!contactDetails.email) formattingIssues.push('Missing direct email address for recruiter contact.');
  if (!contactDetails.phone) formattingIssues.push('Missing phone number for outreach.');
  if (!contactDetails.linkedin && !contactDetails.github) formattingIssues.push('No LinkedIn or GitHub profile link detected.');
  if (wordCount < 180) formattingIssues.push('Resume word count is low (< 180 words), risking ATS rejection due to thin content.');
  if (wordCount > 1200) formattingIssues.push('Resume exceeds 1,200 words (~3+ pages); consider condensing to 1-2 pages.');
  if (quantifiedCount < 3) formattingIssues.push('Few quantifiable metrics found. Add numbers, percentages, and tangible outcomes to bullet points.');
  if (actionVerbCount < 5) formattingIssues.push('Low usage of strong action verbs (e.g. "Architected", "Engineered", "Reduced").');

  // Compute Structure Score (0 - 100)
  let baseScore = 0;

  // 1. Contact Info (25 pts)
  let contactScore = 0;
  if (contactDetails.email) contactScore += 10;
  if (contactDetails.phone) contactScore += 8;
  if (contactDetails.linkedin || contactDetails.github) contactScore += 7;
  baseScore += Math.min(25, contactScore);

  // 2. Sections Coverage (40 pts)
  const foundSections = sections.filter(s => s.found).length;
  const sectionScore = Math.min(40, (foundSections / sections.length) * 40);
  baseScore += sectionScore;

  // 3. Action Verbs & Metrics (20 pts)
  let contentQualityScore = 0;
  if (actionVerbCount >= 8) contentQualityScore += 10;
  else if (actionVerbCount >= 4) contentQualityScore += 6;
  else contentQualityScore += 2;

  if (quantifiedCount >= 5) contentQualityScore += 10;
  else if (quantifiedCount >= 2) contentQualityScore += 6;
  else contentQualityScore += 2;
  baseScore += contentQualityScore;

  // 4. Word count & length balance (15 pts)
  let lengthScore = 0;
  if (wordCount >= 250 && wordCount <= 900) lengthScore = 15;
  else if (wordCount >= 180 && wordCount <= 1200) lengthScore = 10;
  else lengthScore = 5;
  baseScore += lengthScore;

  const structureScore = Math.min(100, Math.max(10, Math.round(baseScore)));

  return {
    hasContactInfo: contactDetails.email !== null || contactDetails.phone !== null,
    contactDetails,
    sections,
    bulletPointCount,
    quantifiedBulletsCount: quantifiedCount,
    actionVerbCount,
    wordCount,
    pageEstimate,
    formattingIssues,
    structureScore
  };
}

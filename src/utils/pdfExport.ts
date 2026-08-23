import jsPDF from 'jspdf';
import { AnalysisResult } from '../types';

export function exportAtsReportToPdf(result: AnalysisResult) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [30, 41, 59]; // Slate 800
  const accentColor = [37, 99, 235]; // Blue 600
  const lightBg = [248, 250, 252]; // Slate 50
  const successColor = [16, 185, 129];
  const warningColor = [245, 158, 11];

  // Header Banner
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('AI RESUME ATS COMPATIBILITY REPORT', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Candidate: ${result.candidateName}  |  Target Role: ${result.targetJobTitle}`, 14, 26);
  doc.text(`Generated on: ${new Date(result.timestamp).toLocaleDateString()}  |  ATS Engine: v2.4 (TF-IDF + Embeddings)`, 14, 32);

  // Overall Score Card
  let y = 46;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, y, 182, 36, 3, 3, 'F');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('OVERALL ATS COMPATIBILITY SCORE', 22, y + 10);

  // Big Score
  const score = result.scores.overallScore;
  doc.setFontSize(26);
  if (score >= 85) doc.setTextColor(16, 185, 129);
  else if (score >= 70) doc.setTextColor(37, 99, 235);
  else if (score >= 55) doc.setTextColor(217, 119, 6);
  else doc.setTextColor(225, 29, 72);

  doc.text(`${score} / 100`, 22, y + 26);

  // Rating Badge
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rating: ${result.scores.rating}`, 95, y + 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Formula: 0.30×Keywords + 0.30×Skills + 0.25×Semantic + 0.15×Structure', 95, y + 26);

  // 4 Component Scores Grid
  y += 44;
  const colWidth = 43;
  const components = [
    { label: 'Keywords (30%)', val: `${result.scores.keywordScore}%` },
    { label: 'Tech Skills (30%)', val: `${result.scores.skillScore}%` },
    { label: 'Semantic (25%)', val: `${result.scores.semanticScore}%` },
    { label: 'Structure (15%)', val: `${result.scores.structureScore}%` },
  ];

  components.forEach((comp, idx) => {
    const x = 14 + idx * (colWidth + 3.3);
    doc.setFillColor(248, 250, 252);
    doc.rect(x, y, colWidth, 20, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(x, y, colWidth, 20, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(comp.label, x + 4, y + 7);

    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59);
    doc.text(comp.val, x + 4, y + 15);
  });

  // Section: Technical Skill Analysis
  y += 28;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('1. Technical Skills Gap Analysis', 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(`Matched Skills (${result.skills.matched.length}):`, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const matchedText = result.skills.matched.map(s => s.name).join(', ') || 'None detected';
  const splitMatched = doc.splitTextToSize(matchedText, 182);
  doc.text(splitMatched, 14, y + 5);

  y += 6 + splitMatched.length * 4;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(225, 29, 72);
  doc.text(`Missing Skills Requested in Job (${result.skills.missing.length}):`, 14, y);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  const missingText = result.skills.missing.map(s => s.name).join(', ') || 'All required skills matched!';
  const splitMissing = doc.splitTextToSize(missingText, 182);
  doc.text(splitMissing, 14, y + 5);

  // Section: High Relevance Keywords
  y += 8 + splitMissing.length * 4;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('2. High-Relevance TF-IDF Keywords & Phrases', 14, y);

  y += 6;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  const topFound = result.keywords.matchedKeywords.slice(0, 8).map(k => `✓ ${k.term}`).join('   ');
  const topMissing = result.keywords.missingKeywords.slice(0, 8).map(k => `✗ ${k.term}`).join('   ');

  doc.text('Top Matched in Resume:', 14, y);
  doc.setTextColor(16, 185, 129);
  doc.text(doc.splitTextToSize(topFound || 'None', 182), 14, y + 5);

  y += 12;
  doc.setTextColor(71, 85, 105);
  doc.text('Top Missing Keywords (Add to Resume):', 14, y);
  doc.setTextColor(217, 119, 6);
  doc.text(doc.splitTextToSize(topMissing || 'None', 182), 14, y + 5);

  // Section: Top Recommendations
  y += 16;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 41, 59);
  doc.text('3. Actionable ATS Improvement Recommendations', 14, y);

  y += 6;
  result.recommendations.slice(0, 4).forEach((rec, idx) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(rec.type === 'critical' ? 225 : 37, rec.type === 'critical' ? 29 : 99, rec.type === 'critical' ? 72 : 235);
    doc.text(`${idx + 1}. [${rec.category}] ${rec.title}`, 14, y);

    y += 4.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitDesc = doc.splitTextToSize(`Action: ${rec.actionableStep}`, 180);
    doc.text(splitDesc, 18, y);
    y += splitDesc.length * 4.2 + 3;
  });

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by AI-Powered Resume ATS Score Checker — B.Tech AI & Data Science Project', 14, 290);

  // Save the PDF
  const safeName = (result.candidateName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${safeName}_ATS_Report.pdf`);
}

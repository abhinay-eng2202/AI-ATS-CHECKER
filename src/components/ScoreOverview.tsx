import React, { useEffect } from 'react';
import { 
  Download, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Info, 
  RefreshCw, 
  Share2, 
  Layers, 
  Cpu, 
  Award,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Target,
  Zap,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisResult, ScoreHistoryPoint } from '../types';
import { exportAtsReportToPdf } from '../utils/pdfExport';
import { ScoreTrendChart } from './ScoreTrendChart';

interface ScoreOverviewProps {
  result: AnalysisResult;
  onAiEnhance: () => void;
  isAiEnhancing: boolean;
  isAiEnhanced: boolean;
  scoreHistory?: ScoreHistoryPoint[];
  onAddSkillToResume?: (skillName: string) => void;
  onUpdateResumeText?: (newText: string, label?: string) => void;
  onResetScoreHistory?: () => void;
}

export const ScoreOverview: React.FC<ScoreOverviewProps> = ({
  result,
  onAiEnhance,
  isAiEnhancing,
  isAiEnhanced,
  scoreHistory = [],
  onAddSkillToResume,
  onUpdateResumeText,
  onResetScoreHistory
}) => {
  const { scores } = result;

  // Trigger celebration confetti for strong scores
  useEffect(() => {
    if (scores.overallScore >= 75) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // silent fallback
      }
    }
  }, [scores.overallScore]);

  // Recruiter screening tier assessment
  const getRecruiterTier = (score: number) => {
    if (score >= 85) {
      return {
        badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
        textColor: 'text-emerald-400',
        strokeColor: '#10b981',
        barColor: 'bg-emerald-500',
        tier: 'Tier 1 — Top 5% Screener Pass',
        probability: '94% Recruiter Callback Chance',
        summary: 'Resume exceeds automated ATS filter thresholds and will be forwarded directly to hiring managers.'
      };
    } else if (score >= 70) {
      return {
        badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
        textColor: 'text-blue-400',
        strokeColor: '#3b82f6',
        barColor: 'bg-blue-500',
        tier: 'Tier 2 — High Shortlist Probability',
        probability: '78% Recruiter Callback Chance',
        summary: 'Strong technical baseline with minor keyword tuning opportunities to reach Tier 1 status.'
      };
    } else if (score >= 55) {
      return {
        badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
        textColor: 'text-amber-400',
        strokeColor: '#f59e0b',
        barColor: 'bg-amber-500',
        tier: 'Tier 3 — Borderline Screener Risk',
        probability: '45% Recruiter Callback Chance',
        summary: 'Missing several primary keywords and skills required by the job posting. At risk of auto-rejection.'
      };
    } else {
      return {
        badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
        textColor: 'text-rose-400',
        strokeColor: '#f43f5e',
        barColor: 'bg-rose-500',
        tier: 'Tier 4 — ATS Filter Rejection Risk',
        probability: '18% Recruiter Callback Chance',
        summary: 'Low overlap with target job description. Critical keywords and required tools are not detected.'
      };
    }
  };

  const currentTier = getRecruiterTier(scores.overallScore);

  // SVG Radial Meter calculation
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.overallScore / 100) * circumference;

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Top Banner with Candidate Info & Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Candidate Audit:</span>
            <span className="text-sm font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded-lg border border-slate-700">
              {result.candidateName}
            </span>
          </div>
          <h2 className="text-xl sm:text-3xl font-heading font-black text-white mt-1.5 flex items-center gap-2">
            <span>{result.targetJobTitle}</span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          
          {/* AI Enhance with Gemini Button */}
          <button
            id="ai-enhance-analysis-btn"
            onClick={onAiEnhance}
            disabled={isAiEnhancing}
            className={`flex items-center space-x-2 text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
              isAiEnhanced
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                : 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 hover:from-purple-800 hover:to-indigo-800 text-purple-200 border-purple-600/50 hover:border-purple-400 shadow-lg shadow-purple-950/40 hover:scale-102'
            }`}
          >
            {isAiEnhancing ? (
              <RefreshCw className="w-4 h-4 animate-spin text-purple-300" />
            ) : (
              <Sparkles className="w-4 h-4 text-purple-300" />
            )}
            <span>{isAiEnhanced ? '✓ AI Recommendations Active' : '✨ Enhance with Gemini AI'}</span>
          </button>

          {/* Download PDF Button */}
          <button
            id="download-pdf-report-btn"
            onClick={() => exportAtsReportToPdf(result)}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm px-4 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-950/50 hover:scale-102 transition-all cursor-pointer border border-white/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Recruiter PDF</span>
          </button>

        </div>
      </div>

      {/* Main Score Centerpiece */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-8">
        
        {/* Radial Meter */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800 stroke-current"
                strokeWidth="13"
                fill="transparent"
              />
              {/* Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={currentTier.strokeColor}
                strokeWidth="13"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-heading text-5xl sm:text-6xl font-black text-white tracking-tight leading-none">
                {scores.overallScore}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1 font-mono">
                ATS Index / 100
              </span>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black border ${currentTier.badgeBg}`}>
              {currentTier.tier}
            </span>
            <p className="text-xs font-semibold text-slate-300 mt-1.5">
              {currentTier.probability}
            </p>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] leading-relaxed">
              {currentTier.summary}
            </p>
          </div>
        </div>

        {/* 4 Pillars Breakdown Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-400" />
              <span>Explainable 4-Pillar Score Formula</span>
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Total Weight = 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* 1. Keyword Match (30%) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-blue-500/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400" />
                  <span className="text-xs font-bold text-slate-200">TF-IDF Keyword Overlap</span>
                </div>
                <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/40">
                  30% Weight
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="font-heading text-2xl font-black text-white">{scores.keywordScore}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  {result.keywords.matchedKeywords.length}/{result.keywords.allJobKeywords.length} terms
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scores.keywordScore}%` }}
                />
              </div>
            </div>

            {/* 2. Technical Skills (30%) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-emerald-500/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400" />
                  <span className="text-xs font-bold text-slate-200">Technical Skills Matrix</span>
                </div>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  30% Weight
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="font-heading text-2xl font-black text-white">{scores.skillScore}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  {result.skills.matched.length}/{result.skills.allDetectedInJob.length} skills
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scores.skillScore}%` }}
                />
              </div>
            </div>

            {/* 3. Semantic Similarity (25%) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-purple-500/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-400 shadow-sm shadow-purple-400" />
                  <span className="text-xs font-bold text-slate-200">Semantic Embeddings</span>
                </div>
                <span className="text-[11px] font-bold text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-800/40">
                  25% Weight
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="font-heading text-2xl font-black text-white">{scores.semanticScore}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  Cosine Match
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scores.semanticScore}%` }}
                />
              </div>
            </div>

            {/* 4. Resume Structure (15%) */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-all hover:border-amber-500/50">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400" />
                  <span className="text-xs font-bold text-slate-200">Structure & ATS Sections</span>
                </div>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/40">
                  15% Weight
                </span>
              </div>
              <div className="flex items-baseline justify-between mt-2.5">
                <span className="font-heading text-2xl font-black text-white">{scores.structureScore}%</span>
                <span className="text-xs text-slate-400 font-mono">
                  {result.structure.sections.filter(s => s.found).length}/{result.structure.sections.length} headers ok
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-600 to-amber-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${scores.structureScore}%` }}
                />
              </div>
            </div>

          </div>

          {/* Mathematical Formula Callout */}
          <div className="bg-slate-950 text-slate-300 text-xs font-mono p-3.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Final ATS = (0.30×Keywords) + (0.30×Skills) + (0.25×Semantic) + (0.15×Structure)</span>
            </div>
            <span className="text-blue-400 font-extrabold text-sm sm:text-right">
              = {scores.overallScore} / 100
            </span>
          </div>

        </div>

      </div>

      {/* Real-Time ATS Score Trend Line with Recharts */}
      <div className="mt-4 pt-6 border-t border-slate-800">
        <ScoreTrendChart
          scoreHistory={scoreHistory}
          currentScore={scores.overallScore}
          missingSkills={result.skills.missing}
          missingKeywords={result.keywords.missingKeywords}
          resumeText={result.resumeText}
          onAddSkill={onAddSkillToResume}
          onUpdateResumeText={onUpdateResumeText}
          onResetHistory={onResetScoreHistory}
        />
      </div>

    </div>
  );
};


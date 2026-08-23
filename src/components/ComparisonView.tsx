import React, { useState } from 'react';
import { Columns, Eye, Search, Check, X, FileText, Briefcase } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ComparisonViewProps {
  result: AnalysisResult;
}

export const ComparisonView: React.FC<ComparisonViewProps> = ({ result }) => {
  const [highlightMode, setHighlightMode] = useState<'all' | 'skills' | 'keywords'>('all');
  const [searchWord, setSearchWord] = useState('');

  const matchedSkillNames = result.skills.matched.map(s => s.name.toLowerCase());
  const missingSkillNames = result.skills.missing.map(s => s.name.toLowerCase());
  const matchedKeywords = result.keywords.matchedKeywords.map(k => k.term.toLowerCase());

  // Function to highlight terms in raw text
  const renderHighlightedText = (text: string, isJobDoc: boolean) => {
    if (!text) return null;

    // Split text into tokens and preserve spacing/newlines
    const paragraphs = text.split('\n');

    return (
      <div className="space-y-2 text-xs font-mono leading-relaxed text-slate-300">
        {paragraphs.map((p, pIdx) => {
          if (!p.trim()) return <div key={pIdx} className="h-2" />;

          // Highlight words in paragraph
          const words = p.split(/(\s+|[.,;!?():/•\-])/);

          return (
            <p key={pIdx}>
              {words.map((chunk, cIdx) => {
                const lower = chunk.toLowerCase().trim();
                if (!lower) return <span key={cIdx}>{chunk}</span>;

                const isMatchedSkill = (highlightMode === 'all' || highlightMode === 'skills') && matchedSkillNames.includes(lower);
                const isMissingSkill = isJobDoc && (highlightMode === 'all' || highlightMode === 'skills') && missingSkillNames.includes(lower);
                const isMatchedKw = (highlightMode === 'all' || highlightMode === 'keywords') && matchedKeywords.includes(lower);
                const isSearched = searchWord.trim() && lower.includes(searchWord.toLowerCase());

                if (isSearched) {
                  return (
                    <mark key={cIdx} className="bg-yellow-400 text-slate-950 font-bold px-0.5 rounded">
                      {chunk}
                    </mark>
                  );
                }

                if (isMatchedSkill) {
                  return (
                    <span key={cIdx} className="bg-emerald-950 text-emerald-300 font-bold px-1 py-0.2 rounded border border-emerald-700/80" title="Matched Technical Skill">
                      {chunk}
                    </span>
                  );
                }

                if (isMissingSkill) {
                  return (
                    <span key={cIdx} className="bg-rose-950 text-rose-300 font-bold px-1 py-0.2 rounded border border-rose-700/80" title="Missing Target Skill">
                      {chunk}
                    </span>
                  );
                }

                if (isMatchedKw) {
                  return (
                    <span key={cIdx} className="bg-blue-950 text-blue-300 font-medium px-1 py-0.2 rounded border border-blue-800/80" title="Matched TF-IDF Keyword">
                      {chunk}
                    </span>
                  );
                }

                return <span key={cIdx}>{chunk}</span>;
              })}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Side-by-Side Text Inspector</h3>
            <span className="text-xs text-slate-400 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full font-mono">
              Interactive Highlights
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Visual inspection showing where matched skills (emerald), missing gaps (rose), and keywords appear in raw text.
          </p>
        </div>

        {/* Highlight Filter Controls */}
        <div className="flex items-center space-x-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setHighlightMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                highlightMode === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Highlights
            </button>
            <button
              onClick={() => setHighlightMode('skills')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                highlightMode === 'skills' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setHighlightMode('keywords')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                highlightMode === 'keywords' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-400 hover:text-blue-300'
              }`}
            >
              Keywords
            </button>
          </div>
        </div>
      </div>

      {/* Legend & Search bar */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-950 border border-emerald-500 inline-block" />
            <span className="text-slate-300 font-mono text-[11px]">Matched Skill</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-950 border border-rose-500 inline-block" />
            <span className="text-slate-300 font-mono text-[11px]">Missing Target Skill</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-blue-950 border border-blue-500 inline-block" />
            <span className="text-slate-300 font-mono text-[11px]">TF-IDF Keyword</span>
          </span>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Search text..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Side-by-side Dual Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        
        {/* Left: Resume Text */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col shadow-inner">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white font-mono">Candidate Resume Text</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {result.structure.wordCount} words
            </span>
          </div>
          <div className="p-4.5 max-h-96 overflow-y-auto bg-slate-950/70">
            {renderHighlightedText(result.resumeText, false)}
          </div>
        </div>

        {/* Right: Target Job Description Text */}
        <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex flex-col shadow-inner">
          <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-white font-mono">Target Job Description</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {result.targetJobTitle}
            </span>
          </div>
          <div className="p-4.5 max-h-96 overflow-y-auto bg-slate-950/70">
            {renderHighlightedText(result.jobDescriptionText, true)}
          </div>
        </div>

      </div>

    </div>
  );
};

import React, { useState } from 'react';
import { Check, X, Plus, Filter, Search, Tag, AlertCircle, ShieldAlert, Cpu, Sparkles } from 'lucide-react';
import { AnalysisResult, SkillItem } from '../types';

interface SkillGapMatrixProps {
  skills: AnalysisResult['skills'];
}

export const SkillGapMatrix: React.FC<SkillGapMatrixProps> = ({ skills }) => {
  const [filterType, setFilterType] = useState<'all' | 'matched' | 'missing' | 'additional'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'all',
    'Programming Languages',
    'AI / Machine Learning',
    'Web & Backend',
    'Cloud & DevOps',
    'Databases',
    'Tools & Methodologies'
  ];

  // Combine and sort
  let displayList: (SkillItem & { status: 'matched' | 'missing' | 'additional' })[] = [
    ...skills.matched.map(s => ({ ...s, status: 'matched' as const })),
    ...skills.missing.map(s => ({ ...s, status: 'missing' as const })),
    ...skills.additional.map(s => ({ ...s, status: 'additional' as const }))
  ];

  if (filterType !== 'all') {
    displayList = displayList.filter(s => s.status === filterType);
  }

  if (selectedCategory !== 'all') {
    displayList = displayList.filter(s => s.category === selectedCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayList = displayList.filter(s => s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q));
  }

  const criticalMissingCount = skills.missing.filter(s => s.importance === 'critical').length;

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Technical Skill-Gap Matrix</h3>
            <span className="bg-blue-950 text-blue-300 border border-blue-800/60 text-xs px-3 py-1 rounded-full font-bold font-mono">
              {skills.matched.length}/{skills.allDetectedInJob.length} Matched ({skills.matchRate}%)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Categorized taxonomy scan comparing job requirements vs. detected candidate skills.
          </p>
        </div>

        {/* Quick Summary Pill Badges */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <span className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 px-3 py-1.5 rounded-xl font-bold">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{skills.matched.length} Matched</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-rose-950/80 text-rose-300 border border-rose-700/60 px-3 py-1.5 rounded-xl font-bold">
            <X className="w-3.5 h-3.5 text-rose-400" />
            <span>{skills.missing.length} Missing Gaps</span>
          </span>
          <span className="flex items-center space-x-1.5 bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl font-medium">
            <Plus className="w-3.5 h-3.5 text-slate-400" />
            <span>{skills.additional.length} Extra in Resume</span>
          </span>
        </div>
      </div>

      {/* Critical Missing Skills Warning if any */}
      {criticalMissingCount > 0 && (
        <div className="mt-6 bg-rose-950/60 border border-rose-800/60 rounded-2xl p-4 flex items-start space-x-3.5 text-xs text-rose-200 shadow-inner">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-rose-300">High Priority Screener Gaps:</span> {skills.missing
              .filter(s => s.importance === 'critical')
              .map(s => s.name)
              .join(', ')}.
            <p className="mt-1 text-rose-300/80 font-normal">
              These technologies appear frequently in the job requirements and have a heavy weight in ATS algorithms.
            </p>
          </div>
        </div>
      )}

      {/* Controls & Category Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Status Filter Tabs */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({skills.matched.length + skills.missing.length + skills.additional.length})
          </button>
          <button
            onClick={() => setFilterType('matched')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'matched' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Matched ({skills.matched.length})
          </button>
          <button
            onClick={() => setFilterType('missing')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'missing' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-400 hover:text-rose-300'
            }`}
          >
            Missing ({skills.missing.length})
          </button>
          <button
            onClick={() => setFilterType('additional')}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
              filterType === 'additional' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Extra ({skills.additional.length})
          </button>
        </div>

        {/* Search & Category Dropdown */}
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Grid of Skill Badges */}
      <div className="mt-6">
        {displayList.length === 0 ? (
          <div className="text-center py-10 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
            No skills match your filter criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayList.map((skill, index) => {
              const isMatched = skill.status === 'matched';
              const isMissing = skill.status === 'missing';
              const isAdditional = skill.status === 'additional';

              return (
                <div
                  key={`${skill.name}-${index}`}
                  className={`p-3.5 rounded-2xl border transition-all text-xs flex flex-col justify-between ${
                    isMatched
                      ? 'bg-emerald-950/30 border-emerald-700/50 hover:border-emerald-500'
                      : isMissing
                      ? 'bg-rose-950/30 border-rose-700/50 hover:border-rose-500'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2 font-bold text-white">
                      {isMatched && (
                        <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {isMissing && (
                        <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0">
                          <X className="w-2.5 h-2.5" />
                        </div>
                      )}
                      {isAdditional && (
                        <div className="w-4 h-4 rounded-full bg-slate-600 text-white flex items-center justify-center shrink-0">
                          <Plus className="w-2.5 h-2.5" />
                        </div>
                      )}
                      <span className="truncate">{skill.name}</span>
                    </div>

                    {skill.importance === 'critical' && isMissing && (
                      <span className="text-[9px] uppercase tracking-wider font-mono font-black bg-rose-900/80 text-rose-300 border border-rose-700/60 px-1.5 py-0.5 rounded">
                        Critical
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
                    <span className="truncate text-[10px] text-slate-500 font-mono">{skill.category}</span>
                    <span className="font-mono">
                      {isMissing ? (
                        <span className="text-rose-400">JD: {skill.frequencyInJob}x</span>
                      ) : isMatched ? (
                        <span className="text-emerald-400">Resume: {skill.frequencyInResume}x</span>
                      ) : (
                        <span className="text-slate-400">Resume: {skill.frequencyInResume}x</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

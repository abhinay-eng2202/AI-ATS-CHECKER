import React, { useState } from 'react';
import { FileCode, Check, X, Search, Filter, Hash, TrendingUp } from 'lucide-react';
import { KeywordItem } from '../types';

interface KeywordAnalysisProps {
  keywords: {
    matchedKeywords: KeywordItem[];
    missingKeywords: KeywordItem[];
    allJobKeywords: KeywordItem[];
    matchRate: number;
  };
}

export const KeywordAnalysis: React.FC<KeywordAnalysisProps> = ({ keywords }) => {
  const [filter, setFilter] = useState<'all' | 'matched' | 'missing'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'unigram' | 'bigram' | 'trigram'>('all');
  const [search, setSearch] = useState('');

  let list = keywords.allJobKeywords;

  if (filter === 'matched') {
    list = list.filter(k => k.matched);
  } else if (filter === 'missing') {
    list = list.filter(k => !k.matched);
  }

  if (typeFilter !== 'all') {
    list = list.filter(k => k.type === typeFilter);
  }

  if (search.trim()) {
    list = list.filter(k => k.term.toLowerCase().includes(search.toLowerCase()));
  }

  // Maximum TF-IDF for relative progress bars
  const maxScore = Math.max(...keywords.allJobKeywords.map(k => k.tfidfScore), 1);

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">TF-IDF Keyword Matching (N-Grams)</h3>
            <span className="bg-blue-950 text-blue-300 border border-blue-800/60 text-xs px-3 py-1 rounded-full font-bold font-mono">
              {keywords.matchedKeywords.length}/{keywords.allJobKeywords.length} Keywords ({keywords.matchRate}%)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Statistical Term Frequency-Inverse Document Frequency extraction across unigrams, bigrams, and trigrams.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center space-x-1.5 text-xs bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({keywords.allJobKeywords.length})
          </button>
          <button
            onClick={() => setFilter('matched')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'matched' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-400 hover:text-emerald-300'
            }`}
          >
            Found ({keywords.matchedKeywords.length})
          </button>
          <button
            onClick={() => setFilter('missing')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              filter === 'missing' ? 'bg-amber-600 text-white shadow-sm' : 'text-amber-400 hover:text-amber-300'
            }`}
          >
            Missing ({keywords.missingKeywords.length})
          </button>
        </div>
      </div>

      {/* Sub Controls */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter keywords..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span className="font-mono text-slate-500">N-Gram:</span>
          {(['all', 'unigram', 'bigram', 'trigram'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                typeFilter === t ? 'bg-blue-600 text-white font-bold' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Keywords Table */}
      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] font-mono">
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Keyword / Keyphrase</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Job Freq</th>
              <th className="py-3 px-4">Resume Count</th>
              <th className="py-3 px-4">TF-IDF Weight</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/60">
            {list.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  No keywords match your search.
                </td>
              </tr>
            ) : (
              list.map((kw, idx) => {
                const barWidth = Math.round((kw.tfidfScore / maxScore) * 100);
                return (
                  <tr key={`${kw.term}-${idx}`} className="hover:bg-slate-800/50 transition-colors">
                    
                    {/* Status */}
                    <td className="py-2.5 px-4">
                      {kw.matched ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-300 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Matched</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-300 bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded-md font-bold text-[11px]">
                          <X className="w-3 h-3 text-amber-400" />
                          <span>Missing</span>
                        </span>
                      )}
                    </td>

                    {/* Term */}
                    <td className="py-2.5 px-4 font-mono font-medium text-slate-200">
                      {kw.term}
                    </td>

                    {/* Type Badge */}
                    <td className="py-2.5 px-4 capitalize">
                      <span className="bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono">
                        {kw.type}
                      </span>
                    </td>

                    {/* Count in Job */}
                    <td className="py-2.5 px-4 text-slate-300 font-mono font-bold">
                      {kw.countInJob}x
                    </td>

                    {/* Count in Resume */}
                    <td className="py-2.5 px-4 font-mono">
                      {kw.countInResume > 0 ? (
                        <span className="text-emerald-400 font-bold">{kw.countInResume}x</span>
                      ) : (
                        <span className="text-slate-500 font-normal">0x</span>
                      )}
                    </td>

                    {/* TF-IDF Bar */}
                    <td className="py-2.5 px-4 min-w-[120px]">
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${kw.matched ? 'bg-blue-500' : 'bg-amber-500'}`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-slate-400 font-semibold">
                          {kw.tfidfScore}
                        </span>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

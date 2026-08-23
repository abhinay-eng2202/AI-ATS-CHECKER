import React from 'react';
import { Recommendation } from '../types';
import { AlertCircle, ArrowUpRight, CheckCircle2, Lightbulb, Zap } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950 border border-amber-800/60 text-amber-400 flex items-center justify-center">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Actionable ATS Improvement Plan</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Prioritized recommendations to bridge skill gaps and maximize ATS screener pass-through.
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-slate-300 bg-slate-950 border border-slate-800 px-3 py-1 rounded-full self-start sm:self-auto font-mono">
          {recommendations.length} Recommendations
        </span>
      </div>

      {/* Recommendations Cards */}
      <div className="mt-6 space-y-4">
        {recommendations.map((rec) => {
          const isCritical = rec.type === 'critical';
          const isPositive = rec.type === 'positive';

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-800/60'
                  : isPositive
                  ? 'bg-emerald-950/30 border-emerald-800/60'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3.5">
                  <div className="mt-0.5 shrink-0">
                    {isCritical ? (
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    ) : isPositive ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Zap className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded tracking-wider font-mono ${
                        isCritical
                          ? 'bg-rose-900/80 text-rose-300 border border-rose-700/60'
                          : isPositive
                          ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700/60'
                          : 'bg-blue-900/80 text-blue-300 border border-blue-700/60'
                      }`}>
                        {rec.category}
                      </span>
                      <h4 className="font-bold text-sm text-white">{rec.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actionable Step Box */}
              <div className="mt-3.5 bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 flex items-start space-x-2.5">
                <ArrowUpRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-400 font-mono text-[11px] uppercase tracking-wider block mb-0.5">Recommended Action</span>
                  <span className="text-slate-300 leading-relaxed">{rec.actionableStep}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

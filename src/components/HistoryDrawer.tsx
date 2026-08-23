import React from 'react';
import { X, Trash2, ArrowUpRight, History, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { AnalysisResult } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AnalysisResult[];
  onSelectHistory: (item: AnalysisResult) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <h3 className="font-heading font-black text-base">ATS Analysis History</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Scans */}
        <div className="p-6 overflow-y-auto flex-1 space-y-3.5">
          {history.length === 0 ? (
            <div className="text-center py-20 text-slate-500 text-xs">
              <FileText className="w-10 h-10 mx-auto mb-3 text-slate-700" />
              <p className="font-semibold text-slate-400">No saved scans yet.</p>
              <p className="mt-1 text-[11px] text-slate-600">
                Run an analysis and your reports will be saved here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const score = item.scores.overallScore;
              let scoreColor = 'bg-emerald-950 text-emerald-300 border-emerald-800/80';
              if (score < 55) scoreColor = 'bg-rose-950 text-rose-300 border-rose-800/80';
              else if (score < 70) scoreColor = 'bg-amber-950 text-amber-300 border-amber-800/80';
              else if (score < 85) scoreColor = 'bg-blue-950 text-blue-300 border-blue-800/80';

              return (
                <div
                  key={item.id}
                  className="bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-2xl p-4 transition-all text-xs flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-white text-sm truncate max-w-[200px]">
                        {item.targetJobTitle}
                      </h4>
                      <p className="text-slate-400 text-[11px] mt-1 font-mono">
                        Candidate: <span className="font-semibold text-slate-200">{item.candidateName}</span>
                      </p>
                    </div>

                    <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-lg border ${scoreColor}`}>
                      {score}%
                    </span>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-900 flex items-center justify-between text-slate-500 text-[11px] font-mono">
                    <span className="flex items-center space-x-1.5">
                      <Calendar className="w-3 h-3 text-slate-600" />
                      <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onDeleteHistoryItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectHistory(item);
                          onClose();
                        }}
                        className="flex items-center space-x-1 font-bold text-blue-400 hover:text-blue-300 bg-slate-900 border border-slate-800 hover:border-blue-500/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              {history.length} saved scan{history.length !== 1 ? 's' : ''}
            </span>

            <button
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
            >
              Clear All History
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

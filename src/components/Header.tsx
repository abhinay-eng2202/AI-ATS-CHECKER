import React from 'react';
import { FileSearch, Sparkles, BookOpen, History, RotateCcw, Award, GraduationCap, ShieldCheck } from 'lucide-react';
import { SampleProfile } from '../types';

interface HeaderProps {
  onSelectSample: (sample: SampleProfile) => void;
  sampleProfiles: SampleProfile[];
  onOpenReportModal: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  hasResult: boolean;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectSample,
  sampleProfiles,
  onOpenReportModal,
  onOpenHistory,
  onReset,
  hasResult,
  historyCount
}) => {
  return (
    <header className="glass-panel text-white sticky top-0 z-40 shadow-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Project Title */}
          <div className="flex items-center space-x-3.5 cursor-pointer group" onClick={onReset}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform text-white border border-white/20">
              <FileSearch className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-300 transition-colors">
                  AI Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">ATS Engine</span>
                </span>
                <span className="hidden sm:inline-flex items-center space-x-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-blue-400" />
                  <span>Campus Placement Pro</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                <span>Explainable 4-Pillar NLP • Recruiter Match Probability</span>
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Sample Selector */}
            <div className="relative inline-block text-left">
              <select
                id="sample-profile-select"
                aria-label="Load Sample Candidate Profile"
                onChange={(e) => {
                  const found = sampleProfiles.find(s => s.id === e.target.value);
                  if (found) onSelectSample(found);
                  e.target.value = "";
                }}
                defaultValue=""
                className="bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700/90 text-xs sm:text-sm rounded-xl px-3 py-2 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all shadow-inner font-medium"
              >
                <option value="" disabled>⚡ Demo Benchmarks...</option>
                {sampleProfiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.candidateName})
                  </option>
                ))}
              </select>
            </div>

            {/* Academic Project Report & Architecture Modal */}
            <button
              id="open-project-doc-btn"
              onClick={onOpenReportModal}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 hover:from-indigo-900 hover:to-purple-900 text-indigo-200 text-xs sm:text-sm px-3.5 py-2 sm:py-2.5 rounded-xl border border-indigo-700/50 hover:border-indigo-500/70 transition-all font-semibold shadow-sm"
              title="View Academic Project Report, Architecture & Formulas"
            >
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Project Defense & Docs</span>
            </button>

            {/* History Drawer Trigger */}
            <button
              id="history-drawer-btn"
              onClick={onOpenHistory}
              className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-750 text-slate-200 text-xs sm:text-sm px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl border border-slate-700/90 transition-all relative font-medium shadow-inner"
              title="View Saved ATS Analyses"
            >
              <History className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Audits</span>
              {historyCount > 0 && (
                <span className="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full shadow-2xs">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Reset Button */}
            {hasResult && (
              <button
                id="reset-scan-btn"
                onClick={onReset}
                className="flex items-center space-x-1 bg-slate-800/90 hover:bg-rose-950/40 hover:text-rose-300 hover:border-rose-700/50 text-slate-300 text-xs sm:text-sm px-3 py-2 sm:py-2.5 rounded-xl border border-slate-700/90 transition-all font-medium"
                title="Start a fresh scan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Scan</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

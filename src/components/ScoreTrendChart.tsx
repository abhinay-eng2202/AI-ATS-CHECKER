import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Sparkles, 
  RotateCcw, 
  Edit3, 
  Check, 
  Zap, 
  Layers, 
  Sliders,
  ChevronRight,
  Info
} from 'lucide-react';
import { ScoreHistoryPoint, SkillItem, KeywordItem } from '../types';

interface ScoreTrendChartProps {
  scoreHistory: ScoreHistoryPoint[];
  currentScore: number;
  missingSkills?: SkillItem[];
  missingKeywords?: KeywordItem[];
  resumeText: string;
  onAddSkill?: (skillName: string) => void;
  onUpdateResumeText?: (newText: string, label?: string) => void;
  onResetHistory?: () => void;
}

export const ScoreTrendChart: React.FC<ScoreTrendChartProps> = ({
  scoreHistory,
  currentScore,
  missingSkills = [],
  missingKeywords = [],
  resumeText,
  onAddSkill,
  onUpdateResumeText,
  onResetHistory
}) => {
  const [showComponentBreakdown, setShowComponentBreakdown] = useState(false);
  const [isLiveEditorOpen, setIsLiveEditorOpen] = useState(false);
  const [liveEditText, setLiveEditText] = useState(resumeText);
  const [isSimulating, setIsSimulating] = useState(false);

  // Sync liveEditText with prop if not actively editing
  React.useEffect(() => {
    setLiveEditText(resumeText);
  }, [resumeText]);

  // If scoreHistory is empty or only 1 item, synthesize baseline if needed
  const chartData = scoreHistory && scoreHistory.length > 0
    ? scoreHistory
    : [
        {
          revision: 1,
          label: 'Baseline',
          overallScore: currentScore,
          keywordScore: currentScore,
          skillScore: currentScore,
          semanticScore: currentScore,
          structureScore: currentScore,
          timestamp: Date.now(),
          changeDescription: 'Initial scan'
        }
      ];

  const initialScore = chartData[0]?.overallScore ?? currentScore;
  const latestScore = chartData[chartData.length - 1]?.overallScore ?? currentScore;
  const scoreDelta = latestScore - initialScore;
  const isPositive = scoreDelta >= 0;

  // Real-time text edit handler
  const handleApplyLiveEdit = () => {
    if (onUpdateResumeText && liveEditText.trim() !== resumeText.trim()) {
      onUpdateResumeText(liveEditText, 'Live Resume Edit');
      setIsLiveEditorOpen(false);
    }
  };

  // 1-Click Missing Skill Injector
  const handleQuickAdd = (skillName: string) => {
    if (onAddSkill) {
      onAddSkill(skillName);
    } else if (onUpdateResumeText) {
      // Append to resume
      const updated = `${resumeText}\n\n• Proficient in ${skillName}, contributing to scalable production architecture and system performance.`;
      onUpdateResumeText(updated, `Added "${skillName}"`);
    }
  };

  // Simulate Progressive Resume Optimization
  const handleSimulateOptimization = async () => {
    if (isSimulating || !onUpdateResumeText) return;
    setIsSimulating(true);

    const missingSkillNames = missingSkills.slice(0, 3).map(s => s.name);
    let currentText = resumeText;

    if (missingSkillNames.length > 0) {
      // Step 1: Add first missing skill
      await new Promise(r => setTimeout(r, 600));
      currentText += `\n• Implemented robust workflows utilizing ${missingSkillNames[0]} to accelerate service delivery.`;
      onUpdateResumeText(currentText, `+ ${missingSkillNames[0]} integration`);
    }

    if (missingSkillNames.length > 1) {
      // Step 2: Add second missing skill with quantification
      await new Promise(r => setTimeout(r, 700));
      currentText += `\n• Optimized data pipelines with ${missingSkillNames[1]}, achieving 35% reduction in latency and improved reliability.`;
      onUpdateResumeText(currentText, `+ ${missingSkillNames[1]} with metrics`);
    }

    if (missingKeywords.length > 0) {
      // Step 3: Add top missing keyword
      await new Promise(r => setTimeout(r, 700));
      const kw = missingKeywords[0].term;
      currentText += `\n• Spearheaded ${kw} initiatives across cross-functional engineering teams.`;
      onUpdateResumeText(currentText, `+ Keyword: "${kw}"`);
    }

    setIsSimulating(false);
  };

  // Top candidate suggestions for real-time addition
  const topSuggestions = [
    ...missingSkills.slice(0, 4).map(s => ({ name: s.name, type: 'skill' as const })),
    ...missingKeywords.slice(0, 3).filter(k => !missingSkills.some(s => s.name.toLowerCase() === k.term.toLowerCase())).map(k => ({ name: k.term, type: 'keyword' as const }))
  ].slice(0, 5);

  return (
    <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-5 sm:p-6 transition-all hover:border-slate-700">
      
      {/* Header & Stats Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <h3 className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              Real-Time ATS Score Trend
            </h3>
            <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800/60 px-2 py-0.5 rounded-full">
              Live Tracker ({chartData.length} {chartData.length === 1 ? 'scan' : 'revisions'})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Observes how resume modifications & keyword insertions impact ATS alignment in real-time.
          </p>
        </div>

        {/* Delta Indicator & Action Controls */}
        <div className="flex items-center space-x-3">
          
          {/* Net Change Pill */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold border ${
            scoreDelta > 0 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' 
              : scoreDelta < 0 
              ? 'bg-rose-950/80 text-rose-300 border-rose-700/60' 
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {scoreDelta > 0 ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : scoreDelta < 0 ? (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            ) : null}
            <span>
              {scoreDelta > 0 ? `+${scoreDelta} pts` : scoreDelta < 0 ? `${scoreDelta} pts` : 'Baseline'}
            </span>
          </div>

          {/* Breakdown Toggle */}
          <button
            id="toggle-trend-breakdown-btn"
            type="button"
            onClick={() => setShowComponentBreakdown(!showComponentBreakdown)}
            className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
              showComponentBreakdown
                ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            {showComponentBreakdown ? 'All 4 Pillars' : 'Overall Score'}
          </button>

          {/* Reset History */}
          {chartData.length > 1 && onResetHistory && (
            <button
              id="reset-score-history-btn"
              type="button"
              onClick={onResetHistory}
              title="Reset score trend history"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Small Recharts Trend Line Graph */}
      <div className="mt-4 w-full h-44 sm:h-48">
        <ResponsiveContainer width="100%" height="100%">
          {showComponentBreakdown ? (
            <LineChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ScoreHistoryPoint;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[180px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="font-bold text-blue-400">{data.label}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        {data.changeDescription && (
                          <p className="text-[11px] text-slate-300 italic">
                            "{data.changeDescription}"
                          </p>
                        )}
                        <div className="space-y-1 pt-0.5">
                          <div className="flex justify-between font-black text-sm text-white">
                            <span>Overall ATS:</span>
                            <span className="text-blue-400">{data.overallScore}%</span>
                          </div>
                          <div className="flex justify-between text-blue-300">
                            <span>Keywords (30%):</span>
                            <span>{data.keywordScore}%</span>
                          </div>
                          <div className="flex justify-between text-emerald-300">
                            <span>Skills (30%):</span>
                            <span>{data.skillScore}%</span>
                          </div>
                          <div className="flex justify-between text-purple-300">
                            <span>Semantic (25%):</span>
                            <span>{data.semanticScore}%</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>Structure (15%):</span>
                            <span>{data.structureScore}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Shortlist (75%)', position: 'insideTopRight', fill: '#10b981', fontSize: 10 }} />
              <Line type="monotone" dataKey="overallScore" name="Overall" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="keywordScore" name="Keywords" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
              <Line type="monotone" dataKey="skillScore" name="Skills" stroke="#34d399" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
              <Line type="monotone" dataKey="semanticScore" name="Semantic" stroke="#c084fc" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
              <Line type="monotone" dataKey="structureScore" name="Structure" stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="atsScoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="label" 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={{ stroke: '#334155' }}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]} 
                tick={{ fontSize: 11, fill: '#94a3b8' }} 
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as ScoreHistoryPoint;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-2xl border border-slate-700 text-xs space-y-1.5 min-w-[160px]">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                          <span className="font-bold text-blue-400">{data.label}</span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        {data.changeDescription && (
                          <p className="text-[11px] text-slate-300 italic">
                            "{data.changeDescription}"
                          </p>
                        )}
                        <div className="flex items-baseline justify-between pt-1">
                          <span className="text-slate-400">ATS Score:</span>
                          <span className="text-xl font-black text-blue-400">{data.overallScore}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target 75%', position: 'insideTopRight', fill: '#10b981', fontSize: 10 }} />
              <Area 
                type="monotone" 
                dataKey="overallScore" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#atsScoreGrad)" 
                dot={{ r: 4, fill: '#3b82f6', stroke: '#0f172a', strokeWidth: 2 }}
                activeDot={{ r: 6, fill: '#60a5fa', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Real-Time Interactive Actions & Quick Skill Injections */}
      <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Quick Add Missing Skills Pill Bar */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-xs font-bold text-slate-300 flex items-center space-x-1 mr-1 font-mono">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Click Live Tweak:</span>
          </span>
          
          {topSuggestions.length > 0 ? (
            topSuggestions.map((item, idx) => (
              <button
                key={`${item.name}-${idx}`}
                id={`quick-add-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                type="button"
                onClick={() => handleQuickAdd(item.name)}
                title={`Inject "${item.name}" into resume and see real-time score change`}
                className="inline-flex items-center space-x-1 text-xs bg-slate-900 hover:bg-blue-950 hover:text-blue-300 hover:border-blue-500/50 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 font-medium transition-all shadow-sm cursor-pointer group"
              >
                <Plus className="w-3 h-3 text-blue-400 group-hover:rotate-90 transition-transform" />
                <span>{item.name}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>All key requirements matched!</span>
            </span>
          )}
        </div>

        {/* Live Text Editor and Simulation Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Simulate Live Optimization */}
          <button
            id="simulate-optimization-btn"
            type="button"
            disabled={isSimulating || topSuggestions.length === 0}
            onClick={handleSimulateOptimization}
            className="flex items-center space-x-1.5 text-xs bg-purple-950/80 hover:bg-purple-900/90 text-purple-200 border border-purple-700/60 px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Optimizing...' : 'Simulate Trend'}</span>
          </button>

          {/* Expand Live Micro Editor */}
          <button
            id="toggle-live-editor-btn"
            type="button"
            onClick={() => setIsLiveEditorOpen(!isLiveEditorOpen)}
            className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm border border-slate-700 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>{isLiveEditorOpen ? 'Close Editor' : 'Live Resume Editor'}</span>
          </button>
        </div>

      </div>

      {/* Expandable Live Resume Micro-Editor */}
      {isLiveEditorOpen && (
        <div className="mt-4 p-4 bg-slate-900 rounded-xl border border-slate-700 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Edit3 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-white">
                Live Interactive Resume Editor (Real-Time Scoring)
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Edits automatically calculate ATS score & record trend points
            </span>
          </div>

          <textarea
            id="realtime-resume-textarea"
            aria-label="Live Resume Editor"
            rows={6}
            value={liveEditText}
            onChange={(e) => setLiveEditText(e.target.value)}
            className="w-full text-xs font-mono text-slate-200 bg-slate-950 p-3 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
            placeholder="Edit or paste updated bullet points with target keywords..."
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">
              {liveEditText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => { setLiveEditText(resumeText); setIsLiveEditorOpen(false); }}
                className="px-3 py-1.5 text-slate-400 hover:text-white font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="apply-live-resume-edit-btn"
                type="button"
                onClick={handleApplyLiveEdit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply & Plot Score</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

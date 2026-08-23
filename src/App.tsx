import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InputSection } from './components/InputSection';
import { ScoreOverview } from './components/ScoreOverview';
import { SkillGapMatrix } from './components/SkillGapMatrix';
import { KeywordAnalysis } from './components/KeywordAnalysis';
import { StructureReport } from './components/StructureReport';
import { AiBulletOptimizer } from './components/AiBulletOptimizer';
import { RecommendationsList } from './components/RecommendationsList';
import { ComparisonView } from './components/ComparisonView';
import { ProjectReportModal } from './components/ProjectReportModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { SAMPLE_PROFILES } from './data/sampleData';
import { AnalysisResult, SampleProfile, ScoreHistoryPoint } from './types';
import { runLocalAtsAnalysis } from './utils/nlpEngine';
import { 
  BarChart3, 
  Layers, 
  FileCode, 
  FileCheck2, 
  Sparkles, 
  Columns, 
  ArrowLeft,
  BookOpen
} from 'lucide-react';

const STORAGE_KEY = 'ai_resume_ats_history_v1';

export default function App() {
  // Input State
  const [resumeText, setResumeText] = useState<string>(SAMPLE_PROFILES[0].resumeText);
  const [jobDescriptionText, setJobDescriptionText] = useState<string>(SAMPLE_PROFILES[0].jobDescriptionText);
  const [targetJobTitle, setTargetJobTitle] = useState<string>(SAMPLE_PROFILES[0].targetJobTitle);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'keywords' | 'structure' | 'optimizer' | 'comparison'>('overview');

  // AI Enhancement State
  const [isAiEnhancing, setIsAiEnhancing] = useState<boolean>(false);
  const [isAiEnhanced, setIsAiEnhanced] = useState<boolean>(false);

  // Modals & Drawers
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryPoint[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load history from localStorage:', e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: AnalysisResult) => {
    try {
      const updated = [newResult, ...history.filter(h => h.id !== newResult.id)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Real-time resume modification with automatic ATS recalculation & trend recording
  const handleRealtimeResumeUpdate = (newResumeText: string, changeLabel?: string) => {
    if (!jobDescriptionText.trim()) return;
    setResumeText(newResumeText);

    const updatedAnalysis = runLocalAtsAnalysis(
      newResumeText,
      jobDescriptionText,
      targetJobTitle || 'Software Engineer',
      result?.resumeFileName || 'Uploaded_Resume.pdf'
    );

    setResult(updatedAnalysis);

    const nextRevision = (scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1].revision : 0) + 1;
    const baseScore = scoreHistory[0]?.overallScore ?? updatedAnalysis.scores.overallScore;
    const diff = updatedAnalysis.scores.overallScore - baseScore;
    const deltaStr = diff > 0 ? ` (+${diff})` : diff < 0 ? ` (${diff})` : '';

    const newPoint: ScoreHistoryPoint = {
      revision: nextRevision,
      label: `Rev ${nextRevision}${deltaStr}`,
      overallScore: updatedAnalysis.scores.overallScore,
      keywordScore: updatedAnalysis.scores.keywordScore,
      skillScore: updatedAnalysis.scores.skillScore,
      semanticScore: updatedAnalysis.scores.semanticScore,
      structureScore: updatedAnalysis.scores.structureScore,
      timestamp: Date.now(),
      changeDescription: changeLabel || `Modified resume (${updatedAnalysis.scores.overallScore}%)`
    };

    setScoreHistory(prev => {
      // If prev was empty, create baseline first
      if (prev.length === 0) {
        const baseline: ScoreHistoryPoint = {
          revision: 1,
          label: 'Baseline',
          overallScore: updatedAnalysis.scores.overallScore,
          keywordScore: updatedAnalysis.scores.keywordScore,
          skillScore: updatedAnalysis.scores.skillScore,
          semanticScore: updatedAnalysis.scores.semanticScore,
          structureScore: updatedAnalysis.scores.structureScore,
          timestamp: Date.now() - 1000,
          changeDescription: 'Initial scan'
        };
        return [baseline, newPoint];
      }
      return [...prev, newPoint];
    });
  };

  const handleAddSkillToResume = (skillName: string) => {
    const updatedResume = `${resumeText}\n\n• Proficient in ${skillName}, contributing to scalable system architecture and production delivery.`;
    handleRealtimeResumeUpdate(updatedResume, `Added "${skillName}" to technical skills`);
  };

  const handleResetScoreHistory = () => {
    if (!result) return;
    const baselinePoint: ScoreHistoryPoint = {
      revision: 1,
      label: 'Baseline',
      overallScore: result.scores.overallScore,
      keywordScore: result.scores.keywordScore,
      skillScore: result.skills ? result.scores.skillScore : 0,
      semanticScore: result.scores.semanticScore,
      structureScore: result.scores.structureScore,
      timestamp: Date.now(),
      changeDescription: 'Reset baseline'
    };
    setScoreHistory([baselinePoint]);
  };

  // Run full ATS Analysis Pipeline
  const handleRunAnalysis = async () => {
    if (!resumeText.trim() || !jobDescriptionText.trim()) return;

    setIsAnalyzing(true);
    setIsAiEnhanced(false);

    try {
      // Step 1: Extract & Clean
      setAnalysisStep('1/4: Preprocessing text & tokenizing...');
      await new Promise(r => setTimeout(r, 250));

      // Step 2: TF-IDF & Skills
      setAnalysisStep('2/4: Extracting TF-IDF n-grams & matching taxonomy...');
      await new Promise(r => setTimeout(r, 250));

      // Step 3: Semantic Vectors & Structure
      setAnalysisStep('3/4: Calculating vector embeddings & structure audit...');
      await new Promise(r => setTimeout(r, 250));

      // Step 4: Compute Final Weighted Score
      setAnalysisStep('4/4: Calculating ATS compatibility score...');
      const analysis = runLocalAtsAnalysis(
        resumeText,
        jobDescriptionText,
        targetJobTitle || 'Software Engineer',
        'Uploaded_Resume.pdf'
      );

      setResult(analysis);
      saveToHistory(analysis);

      // Initialize trend line baseline
      const initialPoint: ScoreHistoryPoint = {
        revision: 1,
        label: 'Baseline',
        overallScore: analysis.scores.overallScore,
        keywordScore: analysis.scores.keywordScore,
        skillScore: analysis.scores.skillScore,
        semanticScore: analysis.scores.semanticScore,
        structureScore: analysis.scores.structureScore,
        timestamp: Date.now(),
        changeDescription: 'Initial scan'
      };
      setScoreHistory([initialPoint]);

      setActiveTab('overview');

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('results-dashboard-anchor');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);

    } catch (err) {
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Enhance with Gemini Server API
  const handleAiEnhance = async () => {
    if (!result || isAiEnhancing) return;
    setIsAiEnhancing(true);

    try {
      const response = await fetch('/api/ai/enhance-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText: result.resumeText,
          jobDescriptionText: result.jobDescriptionText,
          missingSkills: result.skills.missing.map(s => s.name),
          missingKeywords: result.keywords.missingKeywords.map(k => k.term),
        })
      });

      const resData = await response.json();
      if (resData && resData.enhanced && resData.data) {
        const aiData = resData.data;

        // Merge AI findings into current result
        const updatedResult: AnalysisResult = {
          ...result,
          semanticAnalysis: {
            similarityScore: aiData.semanticScore || result.scores.semanticScore,
            conceptualStrengths: aiData.conceptualStrengths || result.semanticAnalysis.conceptualStrengths,
            conceptualGaps: aiData.conceptualGaps || result.semanticAnalysis.conceptualGaps,
            summary: aiData.executiveSummary || result.semanticAnalysis.summary
          },
          bulletRewrites: aiData.bulletRewrites || []
        };

        setResult(updatedResult);
        setIsAiEnhanced(true);
        saveToHistory(updatedResult);
      }
    } catch (err) {
      console.warn('AI enhancement fallback:', err);
    } finally {
      setIsAiEnhancing(false);
    }
  };

  const handleSelectSample = (sample: SampleProfile) => {
    setResumeText(sample.resumeText);
    setJobDescriptionText(sample.jobDescriptionText);
    setTargetJobTitle(sample.targetJobTitle);
    setResult(null);
    setScoreHistory([]);
  };

  const handleReset = () => {
    setResult(null);
    setScoreHistory([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900/5 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Top Header */}
      <Header
        onSelectSample={handleSelectSample}
        sampleProfiles={SAMPLE_PROFILES}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onReset={handleReset}
        hasResult={!!result}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        
        {/* Step 1: Input & Upload Section */}
        <InputSection
          resumeText={resumeText}
          setResumeText={setResumeText}
          jobDescriptionText={jobDescriptionText}
          setJobDescriptionText={setJobDescriptionText}
          targetJobTitle={targetJobTitle}
          setTargetJobTitle={setTargetJobTitle}
          onAnalyze={handleRunAnalysis}
          isAnalyzing={isAnalyzing}
          analysisStep={analysisStep}
          sampleProfiles={SAMPLE_PROFILES}
          onSelectSample={handleSelectSample}
        />

        {/* Step 2: Results & Dashboard */}
        {result && (
          <div id="results-dashboard-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            
            {/* Results Title & View Selector */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white text-[10px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
                    ATS Audit Results
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Scanned at {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  ATS Score Analysis Dashboard
                </h2>
              </div>

              {/* View Tabs */}
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-2xs text-xs overflow-x-auto">
                <button
                  id="tab-overview-btn"
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'overview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Overview & Scores</span>
                </button>

                <button
                  id="tab-skills-btn"
                  onClick={() => setActiveTab('skills')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'skills'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Skill-Gap Matrix ({result.skills.matched.length}/{result.skills.allDetectedInJob.length})</span>
                </button>

                <button
                  id="tab-keywords-btn"
                  onClick={() => setActiveTab('keywords')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'keywords'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>TF-IDF Keywords ({result.keywords.matchedKeywords.length})</span>
                </button>

                <button
                  id="tab-structure-btn"
                  onClick={() => setActiveTab('structure')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'structure'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <FileCheck2 className="w-3.5 h-3.5" />
                  <span>Structure & ATS Format</span>
                </button>

                <button
                  id="tab-optimizer-btn"
                  onClick={() => setActiveTab('optimizer')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'optimizer'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>STAR Bullet Optimizer</span>
                </button>

                <button
                  id="tab-comparison-btn"
                  onClick={() => setActiveTab('comparison')}
                  className={`px-3 py-2 rounded-lg font-bold transition-all flex items-center space-x-1.5 whitespace-nowrap ${
                    activeTab === 'comparison'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Text Inspector</span>
                </button>
              </div>
            </div>

            {/* Active Tab View Rendering */}
            <div className="space-y-8">
              
              {/* Tab 1: Overview & Scores */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <ScoreOverview
                    result={result}
                    onAiEnhance={handleAiEnhance}
                    isAiEnhancing={isAiEnhancing}
                    isAiEnhanced={isAiEnhanced}
                    scoreHistory={scoreHistory}
                    onAddSkillToResume={handleAddSkillToResume}
                    onUpdateResumeText={handleRealtimeResumeUpdate}
                    onResetScoreHistory={handleResetScoreHistory}
                  />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7">
                      <RecommendationsList recommendations={result.recommendations} />
                    </div>
                    <div className="lg:col-span-5">
                      <StructureReport structure={result.structure} />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Skill-Gap Matrix */}
              {activeTab === 'skills' && (
                <SkillGapMatrix skills={result.skills} />
              )}

              {/* Tab 3: TF-IDF Keywords */}
              {activeTab === 'keywords' && (
                <KeywordAnalysis keywords={result.keywords} />
              )}

              {/* Tab 4: Resume Structure */}
              {activeTab === 'structure' && (
                <StructureReport structure={result.structure} />
              )}

              {/* Tab 5: STAR Bullet Optimizer */}
              {activeTab === 'optimizer' && (
                <AiBulletOptimizer result={result} />
              )}

              {/* Tab 6: Text Comparison Inspector */}
              {activeTab === 'comparison' && (
                <ComparisonView result={result} />
              )}

            </div>

          </div>
        )}

      </main>

      {/* Academic Project Documentation & Report Modal */}
      <ProjectReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={(item) => {
          setResult(item);
          setResumeText(item.resumeText);
          setJobDescriptionText(item.jobDescriptionText);
          setTargetJobTitle(item.targetJobTitle);
          setScoreHistory([{
            revision: 1,
            label: 'Baseline',
            overallScore: item.scores.overallScore,
            keywordScore: item.scores.keywordScore,
            skillScore: item.scores.skillScore,
            semanticScore: item.scores.semanticScore,
            structureScore: item.scores.structureScore,
            timestamp: item.timestamp,
            changeDescription: 'Loaded from history'
          }]);
        }}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-slate-200">AI-Powered Resume ATS Score Checker</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Portfolio & Academic AI System • spaCy, Scikit-learn TF-IDF, Sentence Transformers & Express/Flask
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Project Documentation & Architecture</span>
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}

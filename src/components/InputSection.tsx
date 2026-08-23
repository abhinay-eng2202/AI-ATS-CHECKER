import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  FileCode, 
  Check, 
  GraduationCap, 
  Award, 
  Zap, 
  CheckCircle,
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { extractTextFromFile } from '../utils/textParser';
import { SampleProfile } from '../types';

interface InputSectionProps {
  resumeText: string;
  setResumeText: (text: string) => void;
  jobDescriptionText: string;
  setJobDescriptionText: (text: string) => void;
  targetJobTitle: string;
  setTargetJobTitle: (title: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisStep: string;
  sampleProfiles: SampleProfile[];
  onSelectSample: (sample: SampleProfile) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({
  resumeText,
  setResumeText,
  jobDescriptionText,
  setJobDescriptionText,
  targetJobTitle,
  setTargetJobTitle,
  onAnalyze,
  isAnalyzing,
  analysisStep,
  sampleProfiles,
  onSelectSample
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileParsing, setFileParsing] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'paste'>('upload');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    setFileError(null);
    setFileParsing(true);
    setFileName(file.name);

    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted || extracted.trim().length < 20) {
        setFileError('Could not extract sufficient text from this file. You can paste the text directly in the Text Editor tab.');
      } else {
        setResumeText(extracted);
      }
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setFileError('Failed to parse file. Please try pasting the text directly.');
    } finally {
      setFileParsing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const resumeWordCount = resumeText ? resumeText.trim().split(/\s+/).filter(Boolean).length : 0;
  const jdWordCount = jobDescriptionText ? jobDescriptionText.trim().split(/\s+/).filter(Boolean).length : 0;

  const canAnalyze = resumeText.trim().length > 50 && jobDescriptionText.trim().length > 30;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Intro Hero Section for Students & Job Seekers */}
      <div className="mb-10 text-center max-w-4xl mx-auto">
        
        {/* Authoritative Campus Trust Badge */}
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 via-indigo-500/15 to-purple-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full mb-5 shadow-2xs">
          <GraduationCap className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold text-blue-300 tracking-wide uppercase">
            Campus Placement & Technical Interview Readiness
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
          <span className="text-xs font-semibold text-indigo-200">
            Greenhouse & Lever ATS Matched
          </span>
        </div>

        <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
          Pass The ATS Screener. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-teal-300">
            Land Technical Interviews.
          </span>
        </h1>
        
        <p className="mt-4 text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal">
          Evaluate your resume against real job descriptions using <strong className="text-white font-semibold">TF-IDF keyword extraction</strong>, <strong className="text-white font-semibold">technical skill-gap matrices</strong>, and <strong className="text-white font-semibold">STAR-format bullet rewriting</strong>.
        </p>

        {/* Value Prop Quick Metric Chips */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-xs text-slate-300">
          <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-xl flex items-center justify-center space-x-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-semibold text-slate-200">4-Pillar Scoring</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-xl flex items-center justify-center space-x-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">Live Trend Simulator</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-xl flex items-center justify-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-semibold text-slate-200">STAR Bullet AI</span>
          </div>
          <div className="bg-slate-800/60 border border-slate-700/60 px-3 py-2 rounded-xl flex items-center justify-center space-x-1.5">
            <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold text-slate-200">PDF Report Export</span>
          </div>
        </div>

        {/* Quick 1-Click Sample Preset Benchmarks */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            1-Click Demo Profiles:
          </span>
          {sampleProfiles.map((sample) => (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className="text-xs bg-slate-800/90 hover:bg-blue-600 hover:text-white text-slate-300 px-3.5 py-1.5 rounded-xl border border-slate-700 font-semibold transition-all shadow-sm hover:scale-102 cursor-pointer flex items-center space-x-1.5"
            >
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* LEFT COLUMN: Resume Upload & Input */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-7 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            {/* Header & Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20">
                  1
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-lg">Candidate Resume</h2>
                  <p className="text-xs text-slate-400">Upload PDF, DOCX or paste resume text</p>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setInputMode('upload')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    inputMode === 'upload'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  File Upload
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('paste')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    inputMode === 'paste'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paste Text
                </button>
              </div>
            </div>

            {/* Upload Area */}
            {inputMode === 'upload' ? (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={onDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                    dragOver
                      ? 'border-blue-400 bg-blue-950/40 scale-[1.01]'
                      : fileName
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-slate-700/80 hover:border-blue-500/70 bg-slate-950/50 hover:bg-slate-950'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt,.rtf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />

                  <div className="flex flex-col items-center justify-center space-y-3.5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                      fileName 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                        : 'bg-gradient-to-tr from-blue-600/30 to-indigo-600/30 text-blue-400 border border-blue-500/30'
                    }`}>
                      {fileParsing ? (
                        <RefreshCw className="w-7 h-7 animate-spin text-blue-400" />
                      ) : fileName ? (
                        <Check className="w-7 h-7 text-emerald-400" />
                      ) : (
                        <Upload className="w-7 h-7 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {fileParsing
                          ? 'Extracting text from resume with client-side NLP...'
                          : fileName
                          ? `Uploaded: ${fileName}`
                          : 'Click to upload or drag & drop resume file'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Supports PDF (.pdf), Word (.docx), Plain Text (.txt)
                      </p>
                    </div>
                  </div>
                </div>

                {fileError && (
                  <div className="flex items-center space-x-2 text-xs text-amber-300 bg-amber-950/40 p-3 rounded-xl border border-amber-800/60">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{fileError}</span>
                  </div>
                )}

                {/* Parsed Preview snippet */}
                {resumeText && (
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs text-slate-300">
                    <div className="flex items-center justify-between mb-2 font-semibold text-slate-200">
                      <span className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>Extracted Resume Content</span>
                      </span>
                      <span className="text-blue-400 font-mono text-[11px] bg-blue-950/50 px-2 py-0.5 rounded border border-blue-800/40">
                        {resumeWordCount} words parsed
                      </span>
                    </div>
                    <div className="line-clamp-4 font-mono text-[11px] leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                      {resumeText.slice(0, 350)}...
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Direct Text Editor */
              <div>
                <textarea
                  id="resume-text-input"
                  aria-label="Candidate Resume Plain Text"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste candidate resume text here (Summary, Technical Skills, Work Experience, Projects, Education, Certifications)..."
                  rows={12}
                  className="w-full text-xs sm:text-sm font-mono text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-slate-950 transition-all resize-y leading-relaxed"
                />
                <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-mono">
                  <span>ATS text parser format</span>
                  <span>{resumeWordCount} words</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className={`w-4 h-4 ${resumeText.length > 50 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={resumeText.length > 50 ? 'text-emerald-300' : 'text-slate-500'}>
                {resumeText.length > 50 ? 'Resume loaded & parsed ready' : 'Resume awaiting input'}
              </span>
            </span>
            {resumeText && (
              <button
                type="button"
                onClick={() => { setResumeText(''); setFileName(null); }}
                className="text-slate-400 hover:text-rose-400 transition-colors font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Job Description Input */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-5 sm:p-7 flex flex-col justify-between hover:border-slate-700/80 transition-all">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
                  2
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white text-lg">Target Job Description</h2>
                  <p className="text-xs text-slate-400">Paste job requirements or benchmark role</p>
                </div>
              </div>

              <span className="text-xs font-bold text-indigo-300 bg-indigo-950/80 border border-indigo-800/50 px-2.5 py-1 rounded-lg">
                TF-IDF Ground Truth
              </span>
            </div>

            {/* Target Job Title Input */}
            <div className="mb-3.5">
              <label htmlFor="target-role-input" className="block text-xs font-bold text-slate-300 mb-1.5">
                Target Role / Benchmark Job Title
              </label>
              <input
                id="target-role-input"
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. AI / NLP Machine Learning Engineer (or SDE-1 / Data Analyst)"
                className="w-full text-xs sm:text-sm text-slate-100 bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-950 transition-all placeholder:text-slate-600 font-medium"
              />
            </div>

            {/* Job Description Textarea */}
            <div>
              <label htmlFor="job-description-input" className="block text-xs font-bold text-slate-300 mb-1.5">
                Job Responsibilities & Technical Stack
              </label>
              <textarea
                id="job-description-input"
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the complete Job Description text here including required skills, frameworks, experience levels, and responsibilities..."
                rows={9}
                className="w-full text-xs sm:text-sm font-sans text-slate-200 bg-slate-950/80 p-4 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-slate-950 transition-all resize-y placeholder:text-slate-600 leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-mono">
                <span>Evaluates n-gram frequencies & skill presence</span>
                <span>{jdWordCount} words</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className={`w-4 h-4 ${jobDescriptionText.length > 30 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className={jobDescriptionText.length > 30 ? 'text-emerald-300' : 'text-slate-500'}>
                {jobDescriptionText.length > 30 ? 'Job requirements ready' : 'Job description needed'}
              </span>
            </span>
            {jobDescriptionText && (
              <button
                type="button"
                onClick={() => setJobDescriptionText('')}
                className="text-slate-400 hover:text-rose-400 transition-colors font-medium cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Primary Action Button */}
      <div className="mt-10 flex flex-col items-center justify-center">
        <button
          id="run-ats-analysis-btn"
          disabled={!canAnalyze || isAnalyzing}
          onClick={onAnalyze}
          className={`w-full sm:w-auto px-10 py-4 sm:py-5 rounded-2xl font-heading font-extrabold text-base sm:text-lg shadow-2xl transition-all flex items-center justify-center space-x-3 group ${
            canAnalyze && !isAnalyzing
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-102 cursor-pointer border border-white/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-blue-300" />
              <span>{analysisStep || 'Analyzing Resume with 4-Pillar ATS Engine...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-blue-300 group-hover:rotate-12 transition-transform" />
              <span>Calculate ATS Compatibility & Recruiter Passing Score</span>
              <ArrowRight className="w-5 h-5 ml-1 text-blue-300 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        {!canAnalyze && (
          <p className="mt-3 text-xs text-slate-400 text-center font-medium">
            💡 Provide both a resume (or select a demo benchmark above) and target job description to calculate ATS score.
          </p>
        )}
      </div>

    </div>
  );
};


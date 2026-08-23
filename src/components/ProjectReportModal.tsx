import React, { useState } from 'react';
import { X, BookOpen, Layers, Cpu, Code2, CheckCircle2, FileText, Sparkles, Terminal, Award } from 'lucide-react';

interface ProjectReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectReportModal: React.FC<ProjectReportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'formula' | 'code' | 'testing' | 'portfolio'>('architecture');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl border border-slate-800 overflow-hidden flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-slate-950 text-white px-6 sm:px-8 py-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-blue-400 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-heading font-black text-white">AI-Powered Resume ATS Score Checker</h2>
              <p className="text-xs text-slate-400 font-mono">
                B.Tech Artificial Intelligence & Data Science Project Documentation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-950 px-6 py-2 border-b border-slate-800 flex space-x-2 overflow-x-auto shrink-0 text-xs font-semibold text-slate-400 font-mono">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. System Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'formula' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>9. ATS Scoring Formula</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'code' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>10. Flask Backend Code</span>
          </button>

          <button
            onClick={() => setActiveTab('testing')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'testing' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>13. Testing Strategy</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'portfolio' ? 'bg-slate-800 text-white shadow-sm' : 'hover:text-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>17. Portfolio Description</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          
          {/* TAB 1: System Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-heading font-black text-white mb-2">1. Abstract & System Overview</h3>
                <p className="text-slate-400">
                  The AI-Powered Resume ATS Score Checker is an end-to-end Natural Language Processing system that evaluates candidate resumes against target job descriptions. The system extracts text from PDF and DOCX files, computes TF-IDF n-gram keyword relevance, matches technical skills against a curated taxonomy, evaluates sentence transformer semantic similarity, and audits resume structure to compute an explainable compatibility score.
                </p>
              </div>

              {/* Architecture Layer Table */}
              <div>
                <h3 className="text-base font-heading font-black text-white mb-3">5. Layered Architecture</h3>
                <div className="border border-slate-800 rounded-2xl overflow-hidden bg-slate-950">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-300 font-mono font-bold border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Layer</th>
                        <th className="py-3 px-4">Component</th>
                        <th className="py-3 px-4">Responsibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-slate-400">
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">Frontend</td>
                        <td className="py-2.5 px-4 text-slate-200">React / Tailwind / Chart Dashboard</td>
                        <td className="py-2.5 px-4">Upload UI, interactive score gauge, skill-gap matrix, STAR bullet editor</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">Backend</td>
                        <td className="py-2.5 px-4 text-slate-200">Python Flask / Express REST API</td>
                        <td className="py-2.5 px-4">Routing, file handling, NLP orchestration, AI enhancements</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">Parser</td>
                        <td className="py-2.5 px-4 text-slate-200">PyMuPDF (fitz) / python-docx</td>
                        <td className="py-2.5 px-4">Multi-format resume text extraction, regex contact info parsing</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">NLP Engine</td>
                        <td className="py-2.5 px-4 text-slate-200">spaCy / Scikit-learn (TF-IDF)</td>
                        <td className="py-2.5 px-4">Tokenization, lemmatization, stop-words, unigram/bigram/trigram weights</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">Semantic AI</td>
                        <td className="py-2.5 px-4 text-slate-200">Sentence Transformers / Gemini</td>
                        <td className="py-2.5 px-4">Vector embeddings, cosine similarity, contextual skill alignment</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-400">Scoring</td>
                        <td className="py-2.5 px-4 text-slate-200">Transparent Python Scorer Module</td>
                        <td className="py-2.5 px-4">Weighted combination (Keywords 30%, Skills 30%, Semantic 25%, Structure 15%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* System Flow Diagram */}
              <div className="bg-slate-950 text-slate-200 p-5 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                <p className="text-slate-400 font-bold mb-2">SYSTEM PIPELINE FLOW:</p>
                <p className="text-blue-400">Resume (PDF/DOCX) → Text Extraction → NLP Preprocessing → [TF-IDF Keyword Extraction + Skill Taxonomy Match + Semantic Embeddings + Structure Audit] → Weighted Score Engine → Skill Gap Matrix → Actionable Recommendations → Interactive Dashboard</p>
              </div>
            </div>
          )}

          {/* TAB 2: Scoring Formula */}
          {activeTab === 'formula' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-heading font-black text-white mb-2">9. ATS Scoring Methodology</h3>
                <p className="text-slate-400">
                  Unlike opaque proprietary vendor algorithms, this system uses a deterministic, explainable mathematical scoring formula with 4 transparent components.
                </p>
              </div>

              {/* Formula Card */}
              <div className="bg-blue-950/40 border border-blue-800/80 rounded-2xl p-6 text-center">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block font-mono">
                  Core Scoring Formula
                </span>
                <p className="font-mono text-base sm:text-lg font-black text-blue-200 mt-2">
                  ATS Score = (0.30 × Keyword Score) + (0.30 × Skill Score) + (0.25 × Semantic Score) + (0.15 × Structure Score)
                </p>
              </div>

              {/* Weight Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>1. Keyword Score</span>
                    <span className="text-blue-400 font-mono">30%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    TF-IDF n-gram matches (unigrams, bigrams, trigrams) comparing target job requirements to resume content.
                  </p>
                </div>

                <div className="p-4.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>2. Technical Skill Score</span>
                    <span className="text-emerald-400 font-mono">30%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Weighted skill dictionary matching with 1.5x multiplier for critical technologies and taxonomy alias handling.
                  </p>
                </div>

                <div className="p-4.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>3. Semantic Similarity</span>
                    <span className="text-purple-400 font-mono">25%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Cosine similarity of dense sentence vectors capturing contextual alignment even when synonyms differ.
                  </p>
                </div>

                <div className="p-4.5 bg-slate-950 border border-slate-800 rounded-2xl">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>4. Resume Structure</span>
                    <span className="text-amber-400 font-mono">15%</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Checks contact info, standard ATS headers, bullet density, quantified metrics, and active verb counts.
                  </p>
                </div>
              </div>

              {/* Score Range Interpretation */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-white text-xs mb-3 font-mono">Score Interpretation Bands</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 font-medium text-center">
                    <span className="font-bold block font-mono">85 – 100</span>
                    <span className="text-[11px]">Excellent Match</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-950/80 border border-blue-800/80 text-blue-300 font-medium text-center">
                    <span className="font-bold block font-mono">70 – 84</span>
                    <span className="text-[11px]">Good Alignment</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-950/80 border border-amber-800/80 text-amber-300 font-medium text-center">
                    <span className="font-bold block font-mono">55 – 69</span>
                    <span className="text-[11px]">Needs Work</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 font-medium text-center">
                    <span className="font-bold block font-mono">&lt; 55</span>
                    <span className="text-[11px]">Poor Match</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Code Implementation */}
          {activeTab === 'code' && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-black text-white">10. Main Python/Flask Backend Orchestration</h3>
              <p className="text-slate-400">
                Below is the central Flask implementation pattern matching Page 5 of the B.Tech project report:
              </p>
              
              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                <pre>{`from flask import Flask, render_template, request
from analyzer.parser import extract_text
from analyzer.keywords import keyword_match
from analyzer.skills import compare_skills
from analyzer.similarity import semantic_similarity
from analyzer.recommendations import analyze_structure
from analyzer.scorer import calculate_ats_score

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    resume = request.files.get("resume")
    job_description = request.form.get("job_description", "")
    
    # Save and parse resume
    resume_text = extract_text(saved_file_path)
    
    # NLP & Semantic Analysis Modules
    keyword_result = keyword_match(resume_text, job_description)
    skill_result = compare_skills(resume_text, job_description)
    semantic_score = semantic_similarity(resume_text, job_description)
    structure_result = analyze_structure(resume_text)
    
    # Calculate explainable score using 30/30/25/15 weights
    ats_score = calculate_ats_score(
        keyword_result["score"],
        skill_result["score"],
        semantic_score,
        structure_result["score"]
    )
    
    return render_template("result.html",
        ats_score=ats_score,
        keyword_result=keyword_result,
        skill_result=skill_result,
        semantic_score=semantic_score,
        structure_result=structure_result
    )

if __name__ == "__main__":
    app.run(debug=True)`}</pre>
              </div>
            </div>
          )}

          {/* TAB 4: Testing */}
          {activeTab === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-black text-white">13. Testing Strategy & Pytest Unit Test Suite</h3>
              <p className="text-slate-400">
                Automated tests verify file parsing, score edge cases, empty input handling, and taxonomy boundaries:
              </p>

              <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto border border-slate-800">
                <pre>{`# Run full automated test suite
pytest tests/ -v

# Example test coverage:
# • test_parser.py: Validates PyMuPDF PDF and DOCX text decoding
# • test_scorer.py: Verifies 0.30*K + 0.30*S + 0.25*Sem + 0.15*Struct formula
# • test_skills.py: Verifies alias matching (e.g. 'ts' -> 'TypeScript', 'k8s' -> 'Kubernetes')
# • test_boundary.py: Checks empty JD, 0 keyword match, and 100% full match`}</pre>
              </div>
            </div>
          )}

          {/* TAB 5: Portfolio & Resume Description */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h3 className="text-base font-heading font-black text-white">17. Portfolio & Resume Project Entry</h3>
              <p className="text-slate-400">
                How to showcase this project professionally on your resume and GitHub:
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs space-y-2.5">
                <p className="font-bold text-white text-sm font-heading">
                  AI-Powered Resume ATS Score Checker & Semantic Analyzer
                </p>
                <p className="text-slate-300">
                  • Developed an NLP-based web application that compares resumes with target job descriptions and generates an explainable ATS compatibility score.
                </p>
                <p className="text-slate-300">
                  • Implemented multi-format PDF/DOCX text extraction, TF-IDF n-gram keyword matching, and transformer-based sentence semantic similarity.
                </p>
                <p className="text-slate-300">
                  • Built an automated recommendation engine to identify technical skill gaps, keyword deficiencies, and ATS structure improvements with STAR bullet rewrites.
                </p>
                <p className="text-slate-400 font-mono text-[11px] pt-1.5 border-t border-slate-900">
                  <strong className="text-blue-400">Technologies:</strong> Python, Flask, React, TypeScript, spaCy, Scikit-learn, Sentence Transformers, PyMuPDF, SQLite, Tailwind CSS.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 sm:px-8 py-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer font-mono"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};

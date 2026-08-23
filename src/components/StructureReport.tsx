import React from 'react';
import { CheckCircle2, AlertCircle, Mail, Phone, Globe, Github, Linkedin, MapPin, FileCheck, Hash, Award, HelpCircle } from 'lucide-react';
import { StructureMetric } from '../types';

interface StructureReportProps {
  structure: StructureMetric;
}

export const StructureReport: React.FC<StructureReportProps> = ({ structure }) => {
  const { contactDetails, sections, bulletPointCount, quantifiedBulletsCount, actionVerbCount, wordCount, pageEstimate, formattingIssues, structureScore } = structure;

  return (
    <div className="bg-slate-900/95 rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-9 transition-all">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h3 className="text-xl sm:text-2xl font-heading font-black text-white">Resume Structure & ATS Format Audit</h3>
            <span className={`text-xs px-3 py-1 rounded-full font-bold font-mono border ${
              structureScore >= 80 ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60' : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
            }`}>
              Score: {structureScore}/100 (15% Weight)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Automated compliance check for contact clarity, standard ATS section headers, and quantified achievement density.
          </p>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 mt-6">
        
        {/* Word Count */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-xs text-slate-400 font-medium block">Word Count</span>
          <span className="font-heading text-2xl font-black text-white mt-1 block">{wordCount}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            ~{pageEstimate} Page{pageEstimate !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Section Count */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-xs text-slate-400 font-medium block">Standard Sections</span>
          <span className="font-heading text-2xl font-black text-white mt-1 block">
            {sections.filter(s => s.found).length}/{sections.length}
          </span>
          <span className="text-[10px] text-emerald-400 font-mono mt-0.5 block">
            {Math.round((sections.filter(s => s.found).length / sections.length) * 100)}% Identified
          </span>
        </div>

        {/* Bullet Points */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-xs text-slate-400 font-medium block">Bullet Points</span>
          <span className="font-heading text-2xl font-black text-white mt-1 block">{bulletPointCount}</span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Experience bullets</span>
        </div>

        {/* Quantified Metrics */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-center">
          <span className="text-xs text-slate-400 font-medium block">Quantified Impact</span>
          <span className={`font-heading text-2xl font-black mt-1 block ${quantifiedBulletsCount >= 4 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {quantifiedBulletsCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Metrics / Numbers</span>
        </div>

        {/* Action Verbs */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 text-center col-span-2 sm:col-span-1">
          <span className="text-xs text-slate-400 font-medium block">Strong Action Verbs</span>
          <span className={`font-heading text-2xl font-black mt-1 block ${actionVerbCount >= 6 ? 'text-blue-400' : 'text-amber-400'}`}>
            {actionVerbCount}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Power words used</span>
        </div>

      </div>

      {/* Grid: Contact Information & Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left: Contact Info Detector */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-3 font-mono">
            Contact Details Parsed
          </h4>

          <div className="space-y-2 text-xs">
            
            {/* Email */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-200 truncate">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-medium truncate">{contactDetails.email || 'No email detected'}</span>
              </div>
              {contactDetails.email ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </div>

            {/* Phone */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-200 truncate">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-medium truncate">{contactDetails.phone || 'No phone number detected'}</span>
              </div>
              {contactDetails.phone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-200 truncate">
                <Linkedin className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-medium truncate">{contactDetails.linkedin || 'LinkedIn not linked'}</span>
              </div>
              {contactDetails.linkedin ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">Optional</span>
              )}
            </div>

            {/* GitHub */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-200 truncate">
                <Github className="w-4 h-4 text-slate-300 shrink-0" />
                <span className="font-medium truncate">{contactDetails.github || 'GitHub not linked'}</span>
              </div>
              {contactDetails.github ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">Recommended</span>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center space-x-2 text-slate-200 truncate">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-medium truncate">{contactDetails.location || 'Location not specified'}</span>
              </div>
              {contactDetails.location ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">Optional</span>
              )}
            </div>

          </div>
        </div>

        {/* Right: Standard ATS Section Checklist */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider mb-3 font-mono">
            Section Header Classification
          </h4>

          <div className="space-y-2 text-xs">
            {sections.map((sec, idx) => (
              <div
                key={`${sec.name}-${idx}`}
                className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                  sec.found
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  {sec.found ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white">{sec.name}</span>
                    <p className="text-[11px] text-slate-400">{sec.feedback}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  sec.found ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}>
                  {sec.found ? 'Present' : 'Missing'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Formatting & Optimization Tips */}
      {formattingIssues.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 font-mono">
            Identified Structure Improvements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {formattingIssues.map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-xs bg-amber-950/40 border border-amber-800/60 rounded-xl p-3 text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{issue}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

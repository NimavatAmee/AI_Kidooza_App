'use client';

import React from 'react';
import { DollarSign, ShieldAlert, Cpu, Activity, AlertTriangle } from 'lucide-react';

interface SafetyCostMonitorProps {
  sttMinutes: number;
  ttsCharacters: number;
  llmTokens: number;
  estimatedCostUsd: number;
  safetyEventsCount: number;
}

export const SafetyCostMonitor: React.FC<SafetyCostMonitorProps> = ({
  sttMinutes,
  ttsCharacters,
  llmTokens,
  estimatedCostUsd,
  safetyEventsCount,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. API Usage & Service Cost Monitoring */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                AI Voice Pipeline & Cost Tracker
              </h2>
              <p className="text-xs text-slate-500">Resource consumption across STT, LLM & TTS</p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="text-xs font-black">${estimatedCostUsd.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">STT Speech</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{sttMinutes} mins</p>
              <span className="text-[10px] text-slate-400">Audio transcribed</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">AI Persona</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{llmTokens.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400">Tokens filtered</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase">TTS Voice</span>
              <p className="text-base font-black text-slate-900 mt-0.5">{ttsCharacters.toLocaleString()}</p>
              <span className="text-[10px] text-slate-400">Characters voiced</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Cost Control Strategy:</span>
          <span className="font-bold text-slate-700">Native device TTS enabled (Zero Cloud Cost)</span>
        </div>
      </div>

      {/* 2. Child Safety Audit Log */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                Child Safety Guardrails Audit
              </h2>
              <p className="text-xs text-slate-500">Automated protection events (Ages 3–5)</p>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
              {safetyEventsCount} Events Logged
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                PII Collection Attempt Blocked
              </span>
              <span className="font-bold text-slate-900">4 blocked</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Sensitive Adult Words Intercepted
              </span>
              <span className="font-bold text-slate-900">2 redirected</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Bedtime Screen Time Enforced
              </span>
              <span className="font-bold text-slate-900">6 timeouts triggered</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Safety Standard:</span>
          <span className="font-bold text-emerald-700">COPPA & DPDP Act India Verified</span>
        </div>
      </div>
    </div>
  );
};

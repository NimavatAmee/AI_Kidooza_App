'use client';

import React from 'react';
import { Globe, Smile, TrendingUp } from 'lucide-react';

interface AnalyticsChartsProps {
  characters: {
    dino: number;
    robo: number;
    bunny: number;
  };
  languages: {
    en: number;
    hi: number;
    gu: number;
  };
  dailyActivity: { day: string; sessions: number }[];
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  characters,
  languages,
  dailyActivity,
}) => {
  const totalChar = characters.dino + characters.robo + characters.bunny || 1;
  const dinoPct = Math.round((characters.dino / totalChar) * 100);
  const roboPct = Math.round((characters.robo / totalChar) * 100);
  const bunnyPct = Math.round((characters.bunny / totalChar) * 100);

  const totalLang = languages.en + languages.hi + languages.gu || 1;
  const enPct = Math.round((languages.en / totalLang) * 100);
  const hiPct = Math.round((languages.hi / totalLang) * 100);
  const guPct = Math.round((languages.gu / totalLang) * 100);

  const maxSessions = Math.max(...dailyActivity.map((d) => d.sessions), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Character Popularity Breakdown */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smile className="w-4 h-4 text-green-600" />
                Character Popularity
              </h2>
              <p className="text-xs text-slate-500">Most chosen learning companions</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
              Total {totalChar}
            </span>
          </div>

          <div className="space-y-4">
            {/* Dino */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🦖 Dino (Curious & energetic)</span>
                <span>{dinoPct}% ({characters.dino})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${dinoPct}%` }}
                />
              </div>
            </div>

            {/* Robo */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🤖 Robo (Numbers & shapes)</span>
                <span>{roboPct}% ({characters.robo})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${roboPct}%` }}
                />
              </div>
            </div>

            {/* Bunny */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🐰 Bunny (Stories & rhymes)</span>
                <span>{bunnyPct}% ({characters.bunny})</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${bunnyPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Leading Character:</span>
          <span className="font-bold text-emerald-700">🦖 Dino</span>
        </div>
      </div>

      {/* 2. Language Distribution */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                Language Distribution
              </h2>
              <p className="text-xs text-slate-500">English, Hindi & Gujarati uptake</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-700">
              India Market
            </span>
          </div>

          <div className="space-y-4">
            {/* English */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🇬🇧 English</span>
                <span>{enPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${enPct}%` }}
                />
              </div>
            </div>

            {/* Hindi */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🇮🇳 हिन्दी (Hindi)</span>
                <span>{hiPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${hiPct}%` }}
                />
              </div>
            </div>

            {/* Gujarati */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>🇮🇳 ગુજરાતી (Gujarati)</span>
                <span>{guPct}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${guPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Multilingual Reach:</span>
          <span className="font-bold text-slate-800">3 Indian Languages Active</span>
        </div>
      </div>

      {/* 3. Daily Active Sessions Chart */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                Session Activity Trend
              </h2>
              <p className="text-xs text-slate-500">Daily learning sessions completed</p>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
              Active
            </span>
          </div>

          <div className="h-36 flex items-end justify-between gap-2 pt-6">
            {dailyActivity.map((item, idx) => {
              const heightPct = Math.max(15, Math.round((item.sessions / maxSessions) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.sessions}
                  </div>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-purple-600 to-indigo-400 group-hover:from-purple-700 group-hover:to-indigo-500 transition-all cursor-pointer shadow-sm"
                    style={{ height: `${heightPct}%` }}
                  />
                  <span className="text-[10px] font-semibold text-slate-500">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span>Weekly Completion:</span>
          <span className="font-bold text-purple-700">98.4% without dropouts</span>
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, BarChart3 } from 'lucide-react';

interface HeaderProps {
  filter: 'today' | '7days' | '30days';
  onFilterChange: (f: 'today' | '7days' | '30days') => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  onFilterChange,
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-md shadow-green-500/20">
            K
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black text-slate-900 tracking-tight">Kidooza Admin</h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3 h-3" />
                DPDP Safe
              </span>
            </div>
            <p className="text-xs text-slate-500">Safe Kids AI Learning Companion • Operation Dashboard</p>
          </div>
        </div>

        {/* Date Filters & Refresh */}
        <div className="flex items-center gap-3">
          {/* Time Filter Pills */}
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => onFilterChange('today')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === 'today'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onFilterChange('7days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === '7days'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => onFilterChange('30days')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                filter === '30days'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-green-600' : ''}`} />
          </button>
        </div>
      </div>
    </header>
  );
};

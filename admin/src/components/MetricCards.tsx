'use client';

import React from 'react';
import { Users, Baby, PlayCircle, Clock, ShieldAlert, Sparkles } from 'lucide-react';

interface MetricCardsProps {
  totalParents: number;
  totalChildren: number;
  totalSessions: number;
  avgDurationMins: number;
  activeToday: number;
  safetyBlocks: number;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalParents,
  totalChildren,
  totalSessions,
  avgDurationMins,
  activeToday,
  safetyBlocks,
}) => {
  const cards = [
    {
      label: 'Verified Parent Accounts',
      value: totalParents.toLocaleString(),
      change: '+100% consent audit',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      label: 'Active Child Profiles',
      value: totalChildren.toLocaleString(),
      change: 'Ages 3–5 strictly',
      icon: Baby,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      label: 'Total Learning Sessions',
      value: totalSessions.toLocaleString(),
      change: `${activeToday} active today`,
      icon: PlayCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      label: 'Avg Session Duration',
      value: `${avgDurationMins} mins`,
      change: 'Below parent limit (20m)',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    {
      label: 'Child Safety Interceptions',
      value: safetyBlocks.toString(),
      change: 'PII / adult filter active',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-white border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.bgColor} ${card.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 tracking-tight">
                {card.value}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">{card.change}</p>
          </div>
        );
      })}
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle2, UserCheck } from 'lucide-react';

export interface ParentUserRecord {
  id: string;
  email: string;
  registeredDate: string;
  childrenCount: number;
  totalSessions: number;
  consentStatus: 'VERIFIED' | 'REVOKED';
  status: 'ACTIVE' | 'INACTIVE';
}

interface UserManagementTableProps {
  users: ParentUserRecord[];
}

export const UserManagementTable: React.FC<UserManagementTableProps> = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header & Search */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Parent & Account Management</h2>
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {users.length} Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Privacy Guaranteed: Child voice audio and conversation transcripts are strictly withheld from admin view per DPDP Act standards.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by parent email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all bg-slate-50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200 tracking-wider">
            <tr>
              <th className="py-3 px-5">Parent Account</th>
              <th className="py-3 px-5">DPDP Consent</th>
              <th className="py-3 px-5">Child Profiles</th>
              <th className="py-3 px-5">Total Sessions</th>
              <th className="py-3 px-5">Registered Date</th>
              <th className="py-3 px-5">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No parent accounts matching search query.
                </td>
              </tr>
            ) : (
              filtered.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                      {user.email.charAt(0).toUpperCase()}
                    </div>
                    {user.email}
                  </td>
                  <td className="py-3.5 px-5">
                    {user.consentStatus === 'VERIFIED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified (v1.0)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-slate-800">{user.childrenCount}</span> profile(s)
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-purple-700">{user.totalSessions}</span> sessions
                  </td>
                  <td className="py-3.5 px-5 text-slate-500">
                    {user.registeredDate}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

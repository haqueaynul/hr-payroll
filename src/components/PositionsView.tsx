import React, { useState } from 'react';
import { Briefcase, Plus, Search, Edit3, Trash2, Users, DollarSign, CheckCircle2 } from 'lucide-react';
import { JobPosition, Employee } from '../types';

interface PositionsViewProps {
  positions: JobPosition[];
  employees: Employee[];
  onAddPosition: () => void;
  onEditPosition: (pos: JobPosition) => void;
  onDeletePosition: (id: string) => void;
}

export const PositionsView: React.FC<PositionsViewProps> = ({
  positions,
  employees,
  onAddPosition,
  onEditPosition,
  onDeletePosition,
}) => {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filtered = positions.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'all' || p.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-600" />
              Job Position Manipulation &amp; Salary Bands
            </h1>
            <p className="text-xs text-slate-500">
              Create, adjust, and structure organizational job titles, salary bands, level ladders, and requirements.
            </p>
          </div>

          <button
            onClick={onAddPosition}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition shadow-sm shadow-purple-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Position</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by position title or job code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
        </div>
      </div>

      {/* Positions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((pos) => {
          const assignedEmployees = employees.filter((e) => e.positionId === pos.id);

          return (
            <div
              key={pos.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-100">
                        {pos.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {pos.level}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-2">{pos.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">{pos.department}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditPosition(pos)}
                      title="Edit Position"
                      className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete position ${pos.title}?`)) onDeletePosition(pos.id);
                      }}
                      title="Delete Position"
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2">{pos.description}</p>

                {/* Salary Band Bar */}
                <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>Approved Salary Band</span>
                    <span className="font-mono font-semibold text-purple-700">
                      ${(pos.minSalary / 1000).toFixed(0)}k - ${(pos.maxSalary / 1000).toFixed(0)}k / yr
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-1.5 rounded-full w-3/4" />
                  </div>
                </div>

                {/* Requirements list */}
                {pos.requirements && pos.requirements.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[11px] font-semibold text-slate-400 block mb-1">Key Requirements:</span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {pos.requirements.slice(0, 2).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="truncate">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer: Assigned Staff count */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-purple-600" />
                  <span>Assigned Staff:</span>
                </span>
                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                  {assignedEmployees.length} active
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

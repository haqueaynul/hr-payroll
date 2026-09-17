import React, { useState } from 'react';
import { X, Briefcase, Plus, Check } from 'lucide-react';
import { JobPosition, Department, JobLevel, EmploymentType } from '../types';

interface PositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (position: JobPosition) => void;
  positionToEdit?: JobPosition | null;
}

const DEPARTMENTS: Department[] = [
  'Engineering',
  'Product',
  'Design',
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Operations',
];

const LEVELS: JobLevel[] = ['Junior', 'Mid', 'Senior', 'Lead', 'Director', 'Executive'];

export const PositionModal: React.FC<PositionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  positionToEdit,
}) => {
  const [code, setCode] = useState(positionToEdit?.code || `POS-${Math.floor(100 + Math.random() * 900)}`);
  const [title, setTitle] = useState(positionToEdit?.title || '');
  const [department, setDepartment] = useState<Department>(positionToEdit?.department || 'Engineering');
  const [level, setLevel] = useState<JobLevel>(positionToEdit?.level || 'Mid');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(positionToEdit?.employmentType || 'Full-time');
  const [minSalary, setMinSalary] = useState(positionToEdit?.minSalary || 95000);
  const [maxSalary, setMaxSalary] = useState(positionToEdit?.maxSalary || 135000);
  const [description, setDescription] = useState(positionToEdit?.description || '');
  const [requirementsInput, setRequirementsInput] = useState(positionToEdit?.requirements?.join('\n') || '');
  const [responsibilitiesInput, setResponsibilitiesInput] = useState(
    positionToEdit?.responsibilities?.join('\n') || ''
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const positionData: JobPosition = {
      id: positionToEdit?.id || `pos_${Date.now()}`,
      code: code.trim(),
      title: title.trim() || 'Untitled Role',
      department,
      level,
      employmentType,
      minSalary: Number(minSalary),
      maxSalary: Number(maxSalary),
      description: description.trim(),
      requirements: requirementsInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      responsibilities: responsibilitiesInput
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean),
      status: 'active',
      createdAt: positionToEdit?.createdAt || new Date().toISOString().split('T')[0],
    };

    onSave(positionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {positionToEdit ? `Edit Job Position (${positionToEdit.code})` : 'Create New Job Position'}
              </h2>
              <p className="text-xs text-slate-500">
                Configure job codes, departments, career levels, and annual compensation salary bands.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Position Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lead Cloud Architect"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Code *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. ENG-SR-04"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as Department)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as JobLevel)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
              >
                {LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Min Salary ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={minSalary}
                onChange={(e) => setMinSalary(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Annual Max Salary ($)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={maxSalary}
                onChange={(e) => setMaxSalary(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Position Overview</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of expectations and core mission..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Requirements (one per line)</label>
            <textarea
              rows={2}
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              placeholder="5+ years experience&#10;Bachelor in Computer Science or equivalent"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition shadow-sm cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Job Position</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

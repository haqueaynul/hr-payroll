import React, { useState } from 'react';
import { 
  Clock, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  Calendar, 
  User, 
  Check, 
  X,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import { WorkHourLog, Employee } from '../types';

interface HoursTrackerViewProps {
  employees: Employee[];
  hourLogs: WorkHourLog[];
  onAddHourLog: (log: WorkHourLog) => void;
  onUpdateHourLog: (log: WorkHourLog) => void;
  onDeleteHourLog: (id: string) => void;
}

export const HoursTrackerView: React.FC<HoursTrackerViewProps> = ({
  employees,
  hourLogs,
  onAddHourLog,
  onUpdateHourLog,
  onDeleteHourLog,
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('all');
  const [showLogModal, setShowLogModal] = useState(false);

  // Form State
  const [formEmpId, setFormEmpId] = useState(employees[0]?.id || '');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formRegular, setFormRegular] = useState(80);
  const [formOvertime, setFormOvertime] = useState(4);
  const [formHoliday, setFormHoliday] = useState(0);
  const [formNotes, setFormNotes] = useState('Standard sprint delivery and on-call rotation');

  const filteredLogs = hourLogs.filter((log) => {
    return selectedEmployeeId === 'all' || log.employeeId === selectedEmployeeId;
  });

  const totalRegular = filteredLogs.reduce((acc, l) => acc + l.regularHours, 0);
  const totalOvertime = filteredLogs.reduce((acc, l) => acc + l.overtimeHours, 0);
  const totalHoliday = filteredLogs.reduce((acc, l) => acc + l.holidayHours, 0);

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: WorkHourLog = {
      id: `log_${Date.now()}`,
      employeeId: formEmpId,
      date: formDate,
      regularHours: Number(formRegular),
      overtimeHours: Number(formOvertime),
      holidayHours: Number(formHoliday),
      status: 'approved',
      notes: formNotes,
    };
    onAddHourLog(newLog);
    setShowLogModal(false);
  };

  const toggleApproval = (log: WorkHourLog) => {
    onUpdateHourLog({
      ...log,
      status: log.status === 'approved' ? 'pending' : 'approved',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Employee Hours &amp; Timesheets Tracker
            </h1>
            <p className="text-xs text-slate-500">
              Track regular hours, overtime (1.5x rate), and holiday hours (2.0x rate) fed directly into automated payslips.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm shadow-blue-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Log Work Hours</span>
            </button>
          </div>
        </div>

        {/* Filter & Metric Pill Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-3 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Filter by Staff Member</label>
            <select
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Employees ({employees.length})</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.firstName} {emp.lastName} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">Regular Hours</span>
            <span className="text-sm font-bold text-slate-900">{totalRegular.toFixed(1)} hrs</span>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/70 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-amber-800 font-medium">Overtime (1.5x)</span>
            <span className="text-sm font-bold text-amber-900">+{totalOvertime.toFixed(1)} hrs</span>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/70 rounded-lg p-3 flex items-center justify-between">
            <span className="text-xs text-purple-800 font-medium">Holiday (2.0x)</span>
            <span className="text-sm font-bold text-purple-900">{totalHoliday.toFixed(1)} hrs</span>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Timesheets Recorded ({filteredLogs.length})
          </span>
          <span className="text-xs text-slate-500">Auto-calculated into payroll cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Regular Hours</th>
                <th className="px-4 py-3">Overtime (1.5x)</th>
                <th className="px-4 py-3">Holiday (2.0x)</th>
                <th className="px-4 py-3">Notes &amp; Tasks</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => {
                const emp = employees.find((e) => e.id === log.employeeId);
                const isApproved = log.status === 'approved';

                return (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown Staff'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">{emp?.employeeCode}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700">{log.date}</td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{log.regularHours}h</td>
                    <td className="px-4 py-3 font-mono font-semibold text-amber-600">
                      {log.overtimeHours > 0 ? `+${log.overtimeHours}h` : '0h'}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-purple-600">
                      {log.holidayHours > 0 ? `${log.holidayHours}h` : '0h'}
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{log.notes || '—'}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleApproval(log)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {isApproved ? (
                          <>
                            <Check className="w-3 h-3" />
                            Approved
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            Pending Approval
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onDeleteHourLog(log.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                        title="Delete Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Hours Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Log Work Hours &amp; Overtime</h3>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Employee *</label>
                <select
                  value={formEmpId}
                  onChange={(e) => setFormEmpId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.firstName} {emp.lastName} ({emp.positionTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Regular (h)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formRegular}
                    onChange={(e) => setFormRegular(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Overtime (1.5x)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formOvertime}
                    onChange={(e) => setFormOvertime(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holiday (2.0x)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={formHoliday}
                    onChange={(e) => setFormHoliday(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes / Sprint Focus</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Details about task or project worked on..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Receipt, 
  Calendar, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Building, 
  Mail, 
  Phone,
  LayoutGrid,
  List
} from 'lucide-react';
import { Employee, Department, JobPosition, EmployeeStatus } from '../types';
import { calculateTenure, calculateProbationStatus } from '../utils/taxCalculator';

interface EmployeesViewProps {
  employees: Employee[];
  positions: JobPosition[];
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (id: string) => void;
  onGenerateDoc: (employeeId: string, docType: 'offer_letter' | 'appointment_letter' | 'nda_paper') => void;
  onViewPaySlip: (employeeId: string) => void;
}

export const EmployeesView: React.FC<EmployeesViewProps> = ({
  employees,
  positions,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onGenerateDoc,
  onViewPaySlip,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.positionTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'all' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'all' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Employee Directory &amp; Staff Files
            </h1>
            <p className="text-xs text-slate-500">
              Manage personal info, photos, joining dates, tenure countdowns, salary profiles, and legal paperwork.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onAddEmployee}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, employee code, position, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
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

          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Staff</option>
              <option value="probation">Probation Period</option>
              <option value="on_leave">On Leave</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((emp) => {
            const tenure = calculateTenure(emp.joiningDate);
            const probation = calculateProbationStatus(emp.joiningDate, emp.probationMonths);

            return (
              <div
                key={emp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                {/* Header Card Profile */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={emp.firstName}
                          className="w-14 h-14 rounded-xl object-cover border-2 border-indigo-100 shadow-xs"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${
                            emp.status === 'active'
                              ? 'bg-emerald-500'
                              : emp.status === 'probation'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-bold text-slate-900 text-sm">
                            {emp.firstName} {emp.lastName}
                          </h3>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mt-0.5">
                          {emp.employeeCode}
                        </span>
                        <p className="text-xs text-indigo-600 font-medium mt-0.5">{emp.positionTitle}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditEmployee(emp)}
                        title="Edit Info & Photo"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove ${emp.firstName} ${emp.lastName}?`)) {
                            onDeleteEmployee(emp.id);
                          }
                        }}
                        title="Remove Employee"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Badges row */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {emp.department}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium">
                      {emp.employmentType}
                    </span>
                    {probation.isProbationActive ? (
                      <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                        Probation ({probation.daysRemaining}d left)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                        Confirmed
                      </span>
                    )}
                  </div>

                  {/* Key Metrics: Joining date & Salary */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Joined Date:
                      </span>
                      <span className="font-semibold text-slate-900">{emp.joiningDate}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-500">Tenure Seniority:</span>
                      <span className="font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        {tenure.formatted}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        Base Salary:
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        ${emp.baseSalary.toLocaleString()}/mo
                        <span className="text-[10px] text-slate-500 font-normal ml-1">
                          (${emp.hourlyRate.toFixed(2)}/hr)
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>Bank &amp; Tax:</span>
                      <span>
                        {emp.bankDetails.bankName} • Tax: {emp.taxInfo.taxId}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer: Generate Documents & Payslip */}
                <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onGenerateDoc(emp.id, 'offer_letter')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                      title="Generate Offer Letter"
                    >
                      Offer Letter
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => onGenerateDoc(emp.id, 'appointment_letter')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                      title="Generate Appointment Letter"
                    >
                      Contract
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={() => onGenerateDoc(emp.id, 'nda_paper')}
                      className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                      title="Generate NDA Agreement"
                    >
                      NDA
                    </button>
                  </div>

                  <button
                    onClick={() => onViewPaySlip(emp.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-100/70 hover:bg-indigo-100 transition cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Pay Slip</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Role &amp; Department</th>
                  <th className="px-4 py-3">Joining Date</th>
                  <th className="px-4 py-3">Tenure</th>
                  <th className="px-4 py-3">Monthly Base</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((emp) => {
                  const tenure = calculateTenure(emp.joiningDate);
                  const probation = calculateProbationStatus(emp.joiningDate, emp.probationMonths);

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                            alt=""
                            className="w-9 h-9 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {emp.firstName} {emp.lastName}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{emp.employeeCode}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800 block">{emp.positionTitle}</span>
                        <span className="text-slate-500 text-[11px]">{emp.department}</span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">{emp.joiningDate}</td>
                      <td className="px-4 py-3 font-medium text-indigo-700">{tenure.formatted}</td>
                      <td className="px-4 py-3 font-mono font-bold text-slate-900">
                        ${emp.baseSalary.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {probation.isProbationActive ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Probation ({probation.daysRemaining}d)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onViewPaySlip(emp.id)}
                            className="px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded font-medium"
                          >
                            Pay Slip
                          </button>
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${emp.firstName}?`)) onDeleteEmployee(emp.id);
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

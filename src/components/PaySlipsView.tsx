import React, { useState } from 'react';
import { 
  Receipt, 
  PlayCircle, 
  Search, 
  Printer, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  FileText, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PaySlip, Employee } from '../types';

interface PaySlipsViewProps {
  payslips: PaySlip[];
  employees: Employee[];
  onRunPayroll: () => void;
  onViewPaySlip: (slip: PaySlip) => void;
  onMarkPaid: (slipId: string) => void;
}

export const PaySlipsView: React.FC<PaySlipsViewProps> = ({
  payslips,
  employees,
  onRunPayroll,
  onViewPaySlip,
  onMarkPaid,
}) => {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('all');

  const filtered = payslips.filter((slip) => {
    const matchesSearch =
      slip.employeeName.toLowerCase().includes(search.toLowerCase()) ||
      slip.slipNumber.toLowerCase().includes(search.toLowerCase()) ||
      slip.employeeCode.toLowerCase().includes(search.toLowerCase());
    const matchesDept = filterDept === 'all' || slip.department === filterDept;
    return matchesSearch && matchesDept;
  });

  const totalGross = payslips.reduce((acc, s) => acc + s.earnings.totalGross, 0);
  const totalDeductions = payslips.reduce((acc, s) => acc + s.deductions.totalDeductions, 0);
  const totalNet = payslips.reduce((acc, s) => acc + s.netPay, 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-indigo-600" />
              Automated Pay Slips &amp; Payroll Run
            </h1>
            <p className="text-xs text-slate-500">
              Compute approved work hours, calculate progressive tax withholdings, and disburse official payslips.
            </p>
          </div>

          <button
            onClick={onRunPayroll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 cursor-pointer"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Run Automated Payroll</span>
          </button>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-500 block">Total Gross Wages</span>
            <span className="text-xl font-bold font-mono text-slate-900">${totalGross.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200">
            <span className="text-xs text-amber-800 block">Total Statutory Taxes Withheld</span>
            <span className="text-xl font-bold font-mono text-amber-900">-${totalDeductions.toLocaleString()}</span>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200">
            <span className="text-xs text-emerald-800 block">Total Net Disbursed</span>
            <span className="text-xl font-bold font-mono text-emerald-700">${totalNet.toLocaleString()}</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by staff name, employee code, or payslip number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
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

      {/* Pay Slips Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Slip Number</th>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Pay Period</th>
                <th className="px-4 py-3">Gross Earnings</th>
                <th className="px-4 py-3">Total Deductions</th>
                <th className="px-4 py-3">Net Take-Home</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((slip) => {
                const emp = employees.find((e) => e.id === slip.employeeId);
                const isPaid = slip.status === 'paid';

                return (
                  <tr key={slip.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono font-bold text-indigo-700">
                      {slip.slipNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <span className="font-semibold text-slate-900 block">{slip.employeeName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {slip.employeeCode} • {slip.department}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <span className="block font-medium">{slip.payPeriodName}</span>
                      <span className="text-[10px] text-slate-400">Paid: {slip.payDate}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">
                      ${slip.earnings.totalGross.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono text-red-600">
                      -${slip.deductions.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600 text-sm">
                      ${slip.netPay.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => onMarkPaid(slip.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer ${
                          isPaid
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to toggle paid status"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{isPaid ? 'Paid' : 'Pending Transfer'}</span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => onViewPaySlip(slip)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Statement</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Users, 
  DollarSign, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Award, 
  FileText, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles,
  Smartphone,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Employee, JobPosition, PaySlip, WorkHourLog } from '../types';
import { calculateTenure, calculateProbationStatus } from '../utils/taxCalculator';
import { ActiveTab } from './Navbar';

interface DashboardViewProps {
  employees: Employee[];
  positions: JobPosition[];
  hourLogs: WorkHourLog[];
  payslips: PaySlip[];
  onNavigate: (tab: ActiveTab) => void;
  onSelectEmployeeForDocs: (empId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  employees,
  positions,
  hourLogs,
  payslips,
  onNavigate,
  onSelectEmployeeForDocs,
}) => {
  // Aggregate stats
  const totalGross = payslips.reduce((sum, s) => sum + s.earnings.totalGross, 0);
  const totalNet = payslips.reduce((sum, s) => sum + s.netPay, 0);
  const totalTaxes = payslips.reduce((sum, s) => sum + s.deductions.totalDeductions, 0);

  const totalRegularHours = hourLogs.reduce((sum, l) => sum + l.regularHours, 0);
  const totalOvertimeHours = hourLogs.reduce((sum, l) => sum + l.overtimeHours, 0);
  const totalHolidayHours = hourLogs.reduce((sum, l) => sum + l.holidayHours, 0);

  // Probation & Anniversary tracking
  const probationList = employees
    .map((emp) => ({
      employee: emp,
      ...calculateProbationStatus(emp.joiningDate, emp.probationMonths),
    }))
    .filter((item) => item.isProbationActive);

  const tenureList = employees.map((emp) => ({
    employee: emp,
    ...calculateTenure(emp.joiningDate),
  }));

  const upcomingAnniversaries = tenureList.filter((item) => item.isUpcomingAnniversary);

  return (
    <div className="space-y-6">
      {/* Welcome & Highlight Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-medium mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Automated HR Operations & Multiplatform Core
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Enterprise HR &amp; Payroll Management
            </h1>
            <p className="mt-2 text-indigo-100/90 text-sm leading-relaxed">
              Track position manipulations, employee files with photo saving, joining date tenures, automated tax withholdings, dynamic offer letters &amp; NDAs, plus native iOS (Xcode) and Android (Android Studio) codebases.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
            <button
              onClick={() => onNavigate('mobile')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-semibold text-xs hover:bg-indigo-50 transition shadow-sm cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <span>Native Xcode &amp; Android Apps</span>
            </button>
            <button
              onClick={() => onNavigate('payslips')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition border border-indigo-400/30 shadow-sm cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>View Automated Slips</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Payroll Gross */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gross Payroll Cycle</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">${totalGross.toLocaleString()}</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-emerald-600 font-medium">${totalNet.toLocaleString()} net</span>
              <span>paid to employees</span>
            </div>
          </div>
        </div>

        {/* Taxes & Deductions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Statutory Tax Withholding</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">${totalTaxes.toLocaleString()}</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Federal, State, Social Security, Medicare</span>
            </div>
          </div>
        </div>

        {/* Active Staff */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Staff / Roles</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">{employees.length} Employees</span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span>Across {positions.length} configured positions</span>
            </div>
          </div>
        </div>

        {/* Total Work Hours Logged */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Work Hours Logged</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-900">
              {(totalRegularHours + totalOvertimeHours + totalHolidayHours).toFixed(1)} hrs
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-amber-600 font-medium">+{totalOvertimeHours.toFixed(1)}h overtime</span>
              <span>• {totalHolidayHours}h holiday</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Joining Date & Probation Tracker + Payroll Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Joining Date, Tenure & Probation Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Joining Date & Tenure Milestone Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Joining Date &amp; Tenure Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  Continuous tracking of seniority, probation evaluation, and annual work milestones.
                </p>
              </div>
              <button
                onClick={() => onNavigate('employees')}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View All Staff</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {tenureList.map(({ employee, formatted, years, months, isUpcomingAnniversary, daysToAnniversary }) => {
                const probation = calculateProbationStatus(employee.joiningDate, employee.probationMonths);
                return (
                  <div key={employee.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={employee.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={employee.firstName}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 text-sm truncate">
                            {employee.firstName} {employee.lastName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            {employee.employeeCode}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">
                          {employee.positionTitle} • {employee.department}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-semibold text-slate-800">
                          Joined {employee.joiningDate}
                        </div>
                        <div className="text-xs font-medium text-indigo-600">
                          Tenure: {formatted}
                        </div>
                      </div>

                      {probation.isProbationActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <ShieldAlert className="w-3 h-3" />
                          Probation ({probation.daysRemaining}d left)
                        </span>
                      ) : isUpcomingAnniversary ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          <Award className="w-3 h-3" />
                          Anniversary in {daysToAnniversary}d
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Confirmed Staff
                        </span>
                      )}

                      <button
                        onClick={() => {
                          onSelectEmployeeForDocs(employee.id);
                          onNavigate('documents');
                        }}
                        title="Generate Legal Docs (Offer, Contract, NDA)"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Legal Document Generator Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Employment Contract &amp; NDA Suite</h3>
                <p className="text-xs text-slate-500">
                  Instantly produce binding Offer Letters, Appointment Letters, and Non-Disclosure Agreements.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('documents')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition shadow-xs cursor-pointer shrink-0"
            >
              <span>Open Document Generator</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Right Column: Probation Alert, Anniversaries & Mobile Ready Stack */}
        <div className="space-y-6">
          {/* Active Probation Alerts */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Probation Watchlist ({probationList.length})
            </h3>
            {probationList.length === 0 ? (
              <p className="text-xs text-slate-500">All current employees have completed probation.</p>
            ) : (
              <div className="space-y-3">
                {probationList.map(({ employee, daysRemaining, probationEndDate }) => (
                  <div key={employee.id} className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/70">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-amber-950">
                        {employee.firstName} {employee.lastName}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-800">
                        {daysRemaining} Days Left
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800/90 mt-1">
                      {employee.positionTitle} • Ends {probationEndDate}
                    </p>
                    <div className="mt-2 w-full bg-amber-200/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-amber-500 h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(10, ((90 - daysRemaining) / 90) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Native Mobile Project Showcase */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-indigo-950">Xcode &amp; Android Studio</h3>
            </div>
            <p className="text-xs text-indigo-900/80 leading-relaxed mb-4">
              Complete native projects are bundled with this application. Run the SwiftUI codebase in Xcode and the Jetpack Compose codebase in Android Studio.
            </p>
            <div className="space-y-2 text-xs text-indigo-950 font-medium">
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-indigo-100/80">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>iOS: Swift 5.9 + SwiftUI (Xcode 15/16)</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg border border-indigo-100/80">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Android: Kotlin + Jetpack Compose Material 3</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('mobile')}
              className="mt-4 w-full py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Download &amp; Inspect Projects</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Printer, Download, Building2, CheckCircle2, DollarSign } from 'lucide-react';
import { PaySlip, CompanyProfile } from '../types';

interface PaySlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PaySlip | null;
  company: CompanyProfile;
}

export const PaySlipModal: React.FC<PaySlipModalProps> = ({
  isOpen,
  onClose,
  payslip,
  company,
}) => {
  if (!isOpen || !payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Top Modal Controls (Hidden in print) */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Official Payslip Statement</span>
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">
              {payslip.slipNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div id="printable-payslip" className="p-8 space-y-6 text-slate-800 bg-white">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">{company.name}</h1>
              </div>
              <p className="text-xs text-slate-500">{company.address}</p>
              <p className="text-xs text-slate-500 font-mono">Tax ID / EIN: {company.taxNumber}</p>
            </div>

            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Earnings Statement</div>
              <div className="text-base font-bold font-mono text-slate-900">{payslip.slipNumber}</div>
              <div className="text-xs text-slate-500 mt-1">Pay Date: {payslip.payDate}</div>
              <span className="inline-block mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Disbursed: Direct Deposit
              </span>
            </div>
          </div>

          {/* Employee & Pay Period Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Employee Name</span>
              <span className="font-bold text-slate-900">{payslip.employeeName}</span>
              <span className="font-mono text-slate-500 text-[10px] block">{payslip.employeeCode}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Position &amp; Dept</span>
              <span className="font-semibold text-slate-800 block truncate">{payslip.positionTitle}</span>
              <span className="text-slate-500 text-[10px]">{payslip.department}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Joining Date</span>
              <span className="font-semibold text-slate-800">{payslip.joiningDate}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Pay Period</span>
              <span className="font-semibold text-slate-800">{payslip.payPeriodName}</span>
            </div>
          </div>

          {/* Earnings vs Deductions Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Earnings Column */}
            <div className="space-y-3">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                Gross Earnings
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Regular Base Salary</span>
                  <span className="font-mono font-medium">${payslip.earnings.regularPay.toLocaleString()}</span>
                </div>
                {payslip.earnings.regularHoursWorked > 0 && (
                  <div className="flex justify-between text-slate-500 text-[11px] pl-2">
                    <span>• Regular Hours Logged</span>
                    <span className="font-mono">{payslip.earnings.regularHoursWorked} hrs</span>
                  </div>
                )}
                {payslip.earnings.overtimeHoursWorked > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Overtime Pay (1.5x)</span>
                    <span className="font-mono font-medium">${payslip.earnings.overtimePay.toLocaleString()}</span>
                  </div>
                )}
                {payslip.earnings.holidayHoursWorked > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Holiday Pay (2.0x)</span>
                    <span className="font-mono font-medium">${payslip.earnings.holidayPay.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-700">
                  <span>Standard Allowances &amp; Stipend</span>
                  <span className="font-mono font-medium">${payslip.earnings.allowances.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Gross Pay</span>
                <span className="font-mono">${payslip.earnings.totalGross.toLocaleString()}</span>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="space-y-3">
              <div className="font-bold text-slate-900 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                Statutory Withholdings &amp; Deductions
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Federal Income Tax</span>
                  <span className="font-mono text-red-600">-${payslip.deductions.federalTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>State Income Tax</span>
                  <span className="font-mono text-red-600">-${payslip.deductions.stateTax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>FICA Social Security (6.2%)</span>
                  <span className="font-mono text-red-600">-${payslip.deductions.socialSecurity.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>FICA Medicare (1.45%)</span>
                  <span className="font-mono text-red-600">-${payslip.deductions.medicare.toFixed(2)}</span>
                </div>
                {payslip.deductions.preTax401k > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Pre-Tax 401(k) Retirement</span>
                    <span className="font-mono text-amber-700">-${payslip.deductions.preTax401k.toFixed(2)}</span>
                  </div>
                )}
                {payslip.deductions.healthInsurance > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Health &amp; Medical Insurance</span>
                    <span className="font-mono text-amber-700">-${payslip.deductions.healthInsurance.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Deductions</span>
                <span className="font-mono text-red-600">-${payslip.deductions.totalDeductions.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Net Pay Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block">
                Net Pay Distribution
              </span>
              <span className="text-xs text-slate-300">
                Direct Deposit to {payslip.bankSummary}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black font-mono tracking-tight text-white">
                ${payslip.netPay.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Footer Signoff */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Confidential • Authorized by {company.hrDirector}</span>
            <span>Generated on {new Date(payslip.generatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

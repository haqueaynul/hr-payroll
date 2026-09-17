import React, { useState } from 'react';
import { 
  Calculator, 
  Percent, 
  ShieldCheck, 
  HelpCircle, 
  DollarSign, 
  FileCheck2, 
  ArrowRight,
  TrendingDown,
  PieChart
} from 'lucide-react';
import { calculateFederalIncomeTax } from '../utils/taxCalculator';

export const TaxWithholdingsView: React.FC = () => {
  // Simulator State
  const [simSalary, setSimSalary] = useState(12000);
  const [simFilingStatus, setSimFilingStatus] = useState<'single' | 'married'>('single');
  const [simAllowances, setSimAllowances] = useState(1);
  const [simStateRate, setSimStateRate] = useState(5.0);
  const [sim401kPercent, setSim401kPercent] = useState(5.0);
  const [simHealthInsurance, setSimHealthInsurance] = useState(150);

  // Calculations
  const preTax401k = Math.round(simSalary * (sim401kPercent / 100) * 100) / 100;
  const taxableWage = Math.max(0, simSalary - preTax401k - simHealthInsurance);

  const federalTax = calculateFederalIncomeTax(taxableWage, simFilingStatus, simAllowances);
  const stateTax = Math.round(taxableWage * (simStateRate / 100) * 100) / 100;
  const socialSecurity = Math.round(simSalary * 0.062 * 100) / 100; // 6.2%
  const medicare = Math.round(simSalary * 0.0145 * 100) / 100; // 1.45%

  const totalDeductions = Math.round(
    (federalTax + stateTax + socialSecurity + medicare + preTax401k + simHealthInsurance) * 100
  ) / 100;

  const netTakeHome = Math.max(0, Math.round((simSalary - totalDeductions) * 100) / 100);
  const effectiveTaxRate = simSalary > 0 ? ((totalDeductions / simSalary) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-amber-600" />
          Statutory Tax Withholdings &amp; Calculation Engine
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Automated progressive federal income brackets, state tax rates, and FICA statutory withholdings (Social Security &amp; Medicare).
        </p>
      </div>

      {/* Two Column Layout: Interactive Simulator & Official Tax Brackets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Withholding Simulator */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-600" />
              Live Salary &amp; Tax Withholding Simulator
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700">
              Tax Year 2026
            </span>
          </div>

          {/* Sliders and inputs */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Monthly Gross Remuneration</span>
                <span className="font-mono text-indigo-700 font-bold">${simSalary.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min="2000"
                max="30000"
                step="250"
                value={simSalary}
                onChange={(e) => setSimSalary(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                <span>$2,000/mo ($24k/yr)</span>
                <span>$15,000/mo ($180k/yr)</span>
                <span>$30,000/mo ($360k/yr)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Filing Status</label>
                <select
                  value={simFilingStatus}
                  onChange={(e) => setSimFilingStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                >
                  <option value="single">Single / Head of Household</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State Withholding Rate (%)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.1"
                    value={simStateRate}
                    onChange={(e) => setSimStateRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                  <span className="text-xs text-slate-500 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">401(k) Pre-Tax Contribution</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.5"
                    value={sim401kPercent}
                    onChange={(e) => setSim401kPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                  <span className="text-xs text-slate-500 font-medium">%</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Health Insurance</label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">$</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={simHealthInsurance}
                    onChange={(e) => setSimHealthInsurance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Gross Monthly Earnings</span>
              <span className="text-sm font-bold font-mono text-slate-900">${simSalary.toLocaleString()}</span>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Federal Income Tax Withholding</span>
                <span className="font-mono text-red-600">-${federalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax Withholding ({simStateRate}%)</span>
                <span className="font-mono text-red-600">-${stateTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>FICA Social Security (6.2%)</span>
                <span className="font-mono text-red-600">-${socialSecurity.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>FICA Medicare (1.45%)</span>
                <span className="font-mono text-red-600">-${medicare.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Pre-Tax 401(k) Retirement ({sim401kPercent}%)</span>
                <span className="font-mono text-amber-700">-${preTax401k.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Insurance Premium</span>
                <span className="font-mono text-amber-700">-${simHealthInsurance.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Net Estimated Take-Home</span>
                <span className="text-[11px] text-slate-500">Effective Tax &amp; Deduction Rate: {effectiveTaxRate}%</span>
              </div>
              <span className="text-2xl font-black font-mono text-emerald-600">
                ${netTakeHome.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Statutory Reference Guides */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Statutory Withholding Standards
            </h2>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <span className="font-bold text-emerald-950 block">FICA Social Security (OASDI)</span>
                <p className="mt-0.5 text-emerald-900/80">
                  Fixed at <strong>6.2%</strong> on wages up to the statutory wage base limit ($168,600).
                </p>
              </div>

              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="font-bold text-blue-950 block">FICA Medicare (HI)</span>
                <p className="mt-0.5 text-blue-900/80">
                  Fixed at <strong>1.45%</strong> with an additional 0.9% surtax on compensation exceeding $200,000.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-purple-50/60 border border-purple-100">
                <span className="font-bold text-purple-950 block">Pre-Tax Retirement &amp; Benefits</span>
                <p className="mt-0.5 text-purple-900/80">
                  401(k) and Qualified Section 125 health insurance reduce taxable income prior to federal &amp; state assessment.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 text-xs text-slate-600">
            <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-indigo-600" />
              Automated Payroll Compliance
            </h3>
            <p className="leading-relaxed">
              All numbers in the automated payslips and payroll runs pull seamlessly from each employee&apos;s configured tax profile and approved work hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

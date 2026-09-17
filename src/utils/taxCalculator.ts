import { Employee, WorkHourLog, PaySlip, PayPeriod } from '../types';

/**
 * Calculates standard progressive federal income tax withholding (annualized, then monthly)
 */
export function calculateFederalIncomeTax(
  monthlyTaxableWage: number,
  filingStatus: 'single' | 'married' | 'head_of_household' = 'single',
  allowances: number = 0
): number {
  const annualized = Math.max(0, monthlyTaxableWage * 12 - allowances * 4400);

  let annualTax = 0;
  if (filingStatus === 'married') {
    // 2026 approximate married filing jointly brackets
    if (annualized <= 23200) {
      annualTax = annualized * 0.10;
    } else if (annualized <= 94300) {
      annualTax = 2320 + (annualized - 23200) * 0.12;
    } else if (annualized <= 201050) {
      annualTax = 10852 + (annualized - 94300) * 0.22;
    } else if (annualized <= 383900) {
      annualTax = 34337 + (annualized - 201050) * 0.24;
    } else {
      annualTax = 78221 + (annualized - 383900) * 0.32;
    }
  } else {
    // Single / Head of household
    if (annualized <= 11600) {
      annualTax = annualized * 0.10;
    } else if (annualized <= 47150) {
      annualTax = 1160 + (annualized - 11600) * 0.12;
    } else if (annualized <= 100525) {
      annualTax = 5426 + (annualized - 47150) * 0.22;
    } else if (annualized <= 191950) {
      annualTax = 17168 + (annualized - 100525) * 0.24;
    } else {
      annualTax = 39110 + (annualized - 191950) * 0.32;
    }
  }

  const monthlyTax = Math.round((annualTax / 12) * 100) / 100;
  return Math.max(0, monthlyTax);
}

/**
 * Calculates itemized payroll breakdown and returns a complete PaySlip
 */
export function generateAutomatedPaySlip(
  employee: Employee,
  workLogs: WorkHourLog[],
  payPeriod: PayPeriod,
  slipIndex: number = 1
): PaySlip {
  // Aggregate hours for this employee
  const employeeLogs = workLogs.filter((log) => log.employeeId === employee.id && log.status === 'approved');

  const regularHoursWorked = employeeLogs.reduce((sum, log) => sum + log.regularHours, 0);
  const overtimeHoursWorked = employeeLogs.reduce((sum, log) => sum + log.overtimeHours, 0);
  const holidayHoursWorked = employeeLogs.reduce((sum, log) => sum + log.holidayHours, 0);

  let regularPay = 0;
  let basePay = employee.baseSalary;

  if (employee.salaryType === 'hourly') {
    regularPay = Math.round(regularHoursWorked * employee.hourlyRate * 100) / 100;
    basePay = regularPay;
  } else {
    // Monthly salary with standard 160h expected, or fixed monthly base
    regularPay = employee.baseSalary;
  }

  const hourlyEquivalent = employee.salaryType === 'hourly' 
    ? employee.hourlyRate 
    : (employee.baseSalary / 160);

  const overtimePay = Math.round(overtimeHoursWorked * (hourlyEquivalent * 1.5) * 100) / 100;
  const holidayPay = Math.round(holidayHoursWorked * (hourlyEquivalent * 2.0) * 100) / 100;

  // Monthly standard allowances (e.g. tech/transport)
  const allowances = employee.employmentType === 'Full-time' ? 150 : 50;
  const bonuses = 0;

  const totalGross = Math.round((regularPay + overtimePay + holidayPay + allowances + bonuses) * 100) / 100;

  // Pre-tax deductions: 401(k) and health insurance
  const preTax401k = Math.round((totalGross * (employee.taxInfo.preTax401kPercent / 100)) * 100) / 100;
  const healthInsurance = employee.taxInfo.monthlyHealthInsurance || 0;

  const taxableIncome = Math.max(0, totalGross - preTax401k - healthInsurance);

  // Taxes
  const federalTax = calculateFederalIncomeTax(
    taxableIncome,
    employee.taxInfo.filingStatus,
    employee.taxInfo.federalAllowances
  ) + (employee.taxInfo.additionalFederalWithholding || 0);

  const stateTax = Math.round(taxableIncome * (employee.taxInfo.stateWithholdingRate / 100) * 100) / 100;
  const socialSecurity = Math.round(totalGross * 0.062 * 100) / 100; // 6.2%
  const medicare = Math.round(totalGross * 0.0145 * 100) / 100; // 1.45%
  const otherDeductions = 0;

  const totalDeductions = Math.round(
    (federalTax + stateTax + socialSecurity + medicare + healthInsurance + preTax401k + otherDeductions) * 100
  ) / 100;

  const netPay = Math.max(0, Math.round((totalGross - totalDeductions) * 100) / 100);

  const slipCodeYear = payPeriod.endDate.slice(0, 7).replace('-', '');
  const slipNumber = `PSL-${slipCodeYear}-${String(slipIndex).padStart(4, '0')}`;

  const last4 = employee.bankDetails.accountNumber.slice(-4) || '9999';
  const bankSummary = `${employee.bankDetails.bankName} (••••${last4})`;

  return {
    id: `slip_${employee.id}_${payPeriod.id}`,
    slipNumber,
    employeeId: employee.id,
    employeeCode: employee.employeeCode,
    employeeName: `${employee.firstName} ${employee.lastName}`,
    positionTitle: employee.positionTitle,
    department: employee.department,
    joiningDate: employee.joiningDate,
    payPeriodId: payPeriod.id,
    payPeriodName: payPeriod.name,
    payDate: payPeriod.payDate,
    earnings: {
      basePay,
      regularHoursWorked,
      regularPay,
      overtimeHoursWorked,
      overtimePay,
      holidayHoursWorked,
      holidayPay,
      bonuses,
      allowances,
      totalGross,
    },
    deductions: {
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      healthInsurance,
      preTax401k,
      otherDeductions,
      totalDeductions,
    },
    netPay,
    paymentMethod: 'Direct Deposit',
    bankSummary,
    status: payPeriod.status === 'paid' ? 'paid' : 'pending',
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Calculates tenure in years, months, and days from joiningDate
 */
export function calculateTenure(joiningDateStr: string): {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  formatted: string;
  isUpcomingAnniversary: boolean;
  daysToAnniversary: number;
} {
  const joinDate = new Date(joiningDateStr);
  const today = new Date();

  let years = today.getFullYear() - joinDate.getFullYear();
  let months = today.getMonth() - joinDate.getMonth();
  let days = today.getDate() - joinDate.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    days += prevMonthDays;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const diffTime = Math.max(0, today.getTime() - joinDate.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // Check upcoming anniversary within 30 days
  const thisYearAnniversary = new Date(today.getFullYear(), joinDate.getMonth(), joinDate.getDate());
  let targetAnniv = thisYearAnniversary;
  if (thisYearAnniversary.getTime() < today.getTime()) {
    targetAnniv = new Date(today.getFullYear() + 1, joinDate.getMonth(), joinDate.getDate());
  }
  const daysToAnniversary = Math.ceil((targetAnniv.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const isUpcomingAnniversary = daysToAnniversary <= 30 && daysToAnniversary >= 0;

  let formatted = '';
  if (years > 0) {
    formatted = `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  } else if (months > 0) {
    formatted = `${months} mo${months > 1 ? 's' : ''} ${days} day${days > 1 ? 's' : ''}`;
  } else {
    formatted = `${days} day${days > 1 ? 's' : ''}`;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    totalDays,
    formatted,
    isUpcomingAnniversary,
    daysToAnniversary,
  };
}

/**
 * Calculates probation countdown
 */
export function calculateProbationStatus(joiningDateStr: string, probationMonths: number = 3): {
  isProbationActive: boolean;
  probationEndDate: string;
  daysRemaining: number;
} {
  const join = new Date(joiningDateStr);
  const end = new Date(join);
  end.setMonth(end.getMonth() + probationMonths);

  const today = new Date();
  const diff = end.getTime() - today.getTime();
  const daysRemaining = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return {
    isProbationActive: daysRemaining > 0,
    probationEndDate: end.toISOString().split('T')[0],
    daysRemaining: Math.max(0, daysRemaining),
  };
}

/**
 * Convenient helper to generate a PaySlip directly from hours parameters
 */
export function generatePaySlipForEmployee(
  employee: Employee,
  payPeriodName: string = 'September 2026',
  payDate: string = '2026-09-30',
  regularHoursWorked: number = 160,
  overtimeHoursWorked: number = 0,
  holidayHoursWorked: number = 0
): PaySlip {
  const dummyLog: WorkHourLog = {
    id: `log_gen_${Date.now()}`,
    employeeId: employee.id,
    date: payDate,
    regularHours: regularHoursWorked,
    overtimeHours: overtimeHoursWorked,
    holidayHours: holidayHoursWorked,
    status: 'approved',
  };

  const period: PayPeriod = {
    id: `period_${payPeriodName.replace(/\s+/g, '_')}`,
    name: payPeriodName,
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    payDate,
    status: 'paid',
  };

  return generateAutomatedPaySlip(employee, [dummyLog], period, 1);
}

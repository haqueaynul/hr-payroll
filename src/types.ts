export type Department = 
  | 'Engineering' 
  | 'Product' 
  | 'Design' 
  | 'Human Resources' 
  | 'Finance' 
  | 'Marketing' 
  | 'Sales' 
  | 'Operations';

export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
export type JobLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Director' | 'Executive';
export type EmployeeStatus = 'active' | 'probation' | 'on_leave' | 'terminated';

export interface JobPosition {
  id: string;
  code: string;
  title: string;
  department: Department;
  level: JobLevel;
  employmentType: EmploymentType;
  minSalary: number;
  maxSalary: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

export interface TaxInfo {
  taxId: string; // e.g. SSN or National Tax ID (masked or full)
  filingStatus: 'single' | 'married' | 'head_of_household';
  stateWithholdingRate: number; // percentage, e.g., 4.5%
  federalAllowances: number;
  additionalFederalWithholding: number; // flat extra amount if any
  preTax401kPercent: number; // e.g. 5%
  monthlyHealthInsurance: number; // e.g. $150
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  employeeCode: string; // e.g. EMP-101
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string; // Base64 or URL
  positionId: string;
  positionTitle: string;
  department: Department;
  joiningDate: string; // YYYY-MM-DD
  probationMonths: number; // usually 3 or 6 months
  status: EmployeeStatus;
  employmentType: EmploymentType;
  salaryType: 'monthly' | 'hourly';
  baseSalary: number; // Monthly base or annual
  hourlyRate: number; // Hourly rate for timesheets
  bankDetails: BankDetails;
  taxInfo: TaxInfo;
  emergencyContact: EmergencyContact;
  workLocation: string; // e.g. 'San Francisco, CA' or 'Remote'
  address: string;
  createdAt: string;
}

export interface WorkHourLog {
  id: string;
  employeeId: string;
  date: string; // YYYY-MM-DD
  regularHours: number;
  overtimeHours: number;
  holidayHours: number;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
}

export interface PayPeriod {
  id: string;
  name: string; // e.g., 'September 2026'
  startDate: string;
  endDate: string;
  payDate: string;
  status: 'draft' | 'processed' | 'paid';
}

export interface PaySlipEarnings {
  basePay: number;
  regularHoursWorked: number;
  regularPay: number;
  overtimeHoursWorked: number;
  overtimePay: number;
  holidayHoursWorked: number;
  holidayPay: number;
  bonuses: number;
  allowances: number; // e.g. remote stipend, travel
  totalGross: number;
}

export interface PaySlipDeductions {
  federalTax: number;
  stateTax: number;
  socialSecurity: number; // FICA 6.2%
  medicare: number; // FICA 1.45%
  healthInsurance: number;
  preTax401k: number;
  otherDeductions: number;
  totalDeductions: number;
}

export interface PaySlip {
  id: string;
  slipNumber: string; // e.g. PSL-202609-001
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  positionTitle: string;
  department: Department;
  joiningDate: string;
  payPeriodId: string;
  payPeriodName: string;
  payDate: string;
  earnings: PaySlipEarnings;
  deductions: PaySlipDeductions;
  netPay: number;
  paymentMethod: 'Direct Deposit' | 'Wire Transfer' | 'Cheque';
  bankSummary: string; // e.g. 'Chase Bank (****4892)'
  status: 'paid' | 'pending';
  generatedAt: string;
}

export type DocumentType = 'offer_letter' | 'appointment_letter' | 'nda_paper';

export interface DocumentGenerationData {
  id: string;
  docType: DocumentType;
  employeeId?: string;
  recipientName: string;
  recipientAddress: string;
  recipientEmail: string;
  recipientPhone: string;
  companyName: string;
  companyAddress: string;
  companyContact: string;
  positionTitle: string;
  department: string;
  joiningDate: string;
  reportingManager: string;
  workLocation: string;
  baseSalary: number;
  salaryFrequency: 'Monthly' | 'Annual';
  probationMonths: number;
  noticePeriodDays: number;
  signeeName: string;
  signeeTitle: string;
  signDate: string;
  customTerms?: string;
}

export interface CompanyProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  hrDirector: string;
  logoUrl?: string;
}

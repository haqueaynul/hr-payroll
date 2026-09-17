import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  User, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Building, 
  CreditCard, 
  FileText,
  Trash2,
  Check
} from 'lucide-react';
import { Employee, Department, JobPosition, EmploymentType, EmployeeStatus } from '../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  employeeToEdit?: Employee | null;
  positions: JobPosition[];
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

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
];

export const EmployeeModal: React.FC<EmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeToEdit,
  positions,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'profile' | 'position' | 'compensation' | 'tax_bank'>('profile');

  // Form State
  const [firstName, setFirstName] = useState(employeeToEdit?.firstName || '');
  const [lastName, setLastName] = useState(employeeToEdit?.lastName || '');
  const [email, setEmail] = useState(employeeToEdit?.email || '');
  const [phone, setPhone] = useState(employeeToEdit?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(employeeToEdit?.avatarUrl || PRESET_AVATARS[0]);
  const [workLocation, setWorkLocation] = useState(employeeToEdit?.workLocation || 'San Francisco, CA (Hybrid)');
  const [address, setAddress] = useState(employeeToEdit?.address || '');

  const [positionId, setPositionId] = useState(employeeToEdit?.positionId || positions[0]?.id || '');
  const [department, setDepartment] = useState<Department>(employeeToEdit?.department || 'Engineering');
  const [joiningDate, setJoiningDate] = useState(employeeToEdit?.joiningDate || new Date().toISOString().split('T')[0]);
  const [probationMonths, setProbationMonths] = useState(employeeToEdit?.probationMonths ?? 3);
  const [status, setStatus] = useState<EmployeeStatus>(employeeToEdit?.status || 'active');
  const [employmentType, setEmploymentType] = useState<EmploymentType>(employeeToEdit?.employmentType || 'Full-time');

  const [salaryType, setSalaryType] = useState<'monthly' | 'hourly'>(employeeToEdit?.salaryType || 'monthly');
  const [baseSalary, setBaseSalary] = useState(employeeToEdit?.baseSalary || 10000);
  const [hourlyRate, setHourlyRate] = useState(employeeToEdit?.hourlyRate || 62.5);

  const [bankName, setBankName] = useState(employeeToEdit?.bankDetails?.bankName || 'JPMorgan Chase');
  const [accountNumber, setAccountNumber] = useState(employeeToEdit?.bankDetails?.accountNumber || '4829104829');
  const [routingNumber, setRoutingNumber] = useState(employeeToEdit?.bankDetails?.routingNumber || '12100024');
  const [accountHolderName, setAccountHolderName] = useState(
    employeeToEdit?.bankDetails?.accountHolderName || `${employeeToEdit?.firstName || ''} ${employeeToEdit?.lastName || ''}`
  );

  const [taxId, setTaxId] = useState(employeeToEdit?.taxInfo?.taxId || '***-**-4910');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head_of_household'>(
    employeeToEdit?.taxInfo?.filingStatus || 'single'
  );
  const [stateWithholdingRate, setStateWithholdingRate] = useState(employeeToEdit?.taxInfo?.stateWithholdingRate || 5.0);
  const [federalAllowances, setFederalAllowances] = useState(employeeToEdit?.taxInfo?.federalAllowances ?? 1);
  const [preTax401kPercent, setPreTax401kPercent] = useState(employeeToEdit?.taxInfo?.preTax401kPercent || 5.0);
  const [monthlyHealthInsurance, setMonthlyHealthInsurance] = useState(
    employeeToEdit?.taxInfo?.monthlyHealthInsurance || 150
  );

  const [emergencyName, setEmergencyName] = useState(employeeToEdit?.emergencyContact?.name || '');
  const [emergencyPhone, setEmergencyPhone] = useState(employeeToEdit?.emergencyContact?.phone || '');
  const [emergencyRelation, setEmergencyRelation] = useState(employeeToEdit?.emergencyContact?.relationship || 'Spouse');

  if (!isOpen) return null;

  // Handle Photo upload & conversion to base64 Data URL for persistent saving
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePositionChange = (posId: string) => {
    setPositionId(posId);
    const selected = positions.find((p) => p.id === posId);
    if (selected) {
      setDepartment(selected.department);
      // Auto-set reasonable mid-point salary from position band
      const avg = Math.round((selected.minSalary + selected.maxSalary) / 2 / 12);
      if (!employeeToEdit) {
        setBaseSalary(avg);
        setHourlyRate(Math.round((avg / 160) * 100) / 100);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedPos = positions.find((p) => p.id === positionId);
    const positionTitle = selectedPos ? selectedPos.title : 'Software Specialist';

    const employeeData: Employee = {
      id: employeeToEdit?.id || `emp_${Date.now()}`,
      employeeCode: employeeToEdit?.employeeCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: firstName.trim() || 'New',
      lastName: lastName.trim() || 'Employee',
      email: email.trim() || 'employee@enterprise.io',
      phone: phone.trim() || '+1 (555) 000-0000',
      avatarUrl,
      positionId,
      positionTitle,
      department,
      joiningDate,
      probationMonths: Number(probationMonths),
      status,
      employmentType,
      salaryType,
      baseSalary: Number(baseSalary),
      hourlyRate: Number(hourlyRate),
      bankDetails: {
        bankName,
        accountNumber,
        routingNumber,
        accountHolderName: accountHolderName || `${firstName} ${lastName}`,
      },
      taxInfo: {
        taxId,
        filingStatus,
        stateWithholdingRate: Number(stateWithholdingRate),
        federalAllowances: Number(federalAllowances),
        additionalFederalWithholding: 0,
        preTax401kPercent: Number(preTax401kPercent),
        monthlyHealthInsurance: Number(monthlyHealthInsurance),
      },
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRelation,
      },
      workLocation,
      address,
      createdAt: employeeToEdit?.createdAt || new Date().toISOString(),
    };

    onSave(employeeData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {employeeToEdit ? `Edit Employee (${employeeToEdit.employeeCode})` : 'New Employee Onboarding'}
              </h2>
              <p className="text-xs text-slate-500">
                Complete personal info, photo saving, joining date, salary, and tax withholdings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-6 text-xs font-semibold">
          {[
            { id: 'profile', label: '1. Photo & Profile', icon: User },
            { id: 'position', label: '2. Position & Joining Date', icon: Briefcase },
            { id: 'compensation', label: '3. Salary & Compensation', icon: DollarSign },
            { id: 'tax_bank', label: '4. Taxes & Bank Details', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCur = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                  isCur
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* TAB 1: Photo & Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Photo Saving Section */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <img
                    src={avatarUrl}
                    alt="Preview"
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 text-white rounded-2xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[10px] font-bold">Change</span>
                  </button>
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 justify-center sm:justify-start">
                    <Camera className="w-4 h-4 text-indigo-600" />
                    <span>Employee Photo Saving (Upload or Select Avatar)</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Upload an authentic profile image. Automatically converted into local data storage for payslips and IDs.
                  </p>

                  <div className="flex items-center gap-2 pt-1 justify-center sm:justify-start">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition cursor-pointer shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                    </button>
                  </div>

                  {/* Preset Avatars row */}
                  <div className="flex items-center gap-1.5 pt-2 justify-center sm:justify-start">
                    <span className="text-[11px] text-slate-400">Or pick preset:</span>
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatarUrl(url)}
                        className={`w-6 h-6 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                          avatarUrl === url ? 'border-indigo-600 scale-110' : 'border-transparent hover:opacity-80'
                        }`}
                      >
                        <img src={url} alt={`Preset ${i}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Marcus"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus.vance@company.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (415) 555-0199"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Location</label>
                  <input
                    type="text"
                    value={workLocation}
                    onChange={(e) => setWorkLocation(e.target.value)}
                    placeholder="San Francisco, CA (Hybrid)"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="420 Mission St, San Francisco, CA"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-700 block mb-2">Emergency Contact</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    value={emergencyRelation}
                    onChange={(e) => setEmergencyRelation(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Phone"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Position & Joining Date Tracking */}
          {activeTab === 'position' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Job Position *</label>
                  <select
                    value={positionId}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  >
                    {positions.map((pos) => (
                      <option key={pos.id} value={pos.id}>
                        {pos.title} ({pos.code}) - {pos.department}
                      </option>
                    ))}
                  </select>
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Joining Date (Tracks Tenure &amp; Seniority) *
                  </label>
                  <input
                    type="date"
                    required
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Used to calculate work anniversaries, paid leave seniority, and milestone rewards.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Probation Period (Months)
                  </label>
                  <select
                    value={probationMonths}
                    onChange={(e) => setProbationMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value={1}>1 Month</option>
                    <option value={3}>3 Months (Standard)</option>
                    <option value={6}>6 Months (Extended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Intern">Intern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="active">Active</option>
                    <option value="probation">Under Probation</option>
                    <option value="on_leave">On Leave</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Salary & Compensation */}
          {activeTab === 'compensation' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Compensation Basis</label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryType"
                        value="monthly"
                        checked={salaryType === 'monthly'}
                        onChange={() => setSalaryType('monthly')}
                        className="text-indigo-600"
                      />
                      <span>Monthly Base Salary</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="salaryType"
                        value="hourly"
                        checked={salaryType === 'hourly'}
                        onChange={() => setSalaryType('hourly')}
                        className="text-indigo-600"
                      />
                      <span>Hourly Rate (Timesheet)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {salaryType === 'monthly' ? 'Base Monthly Remuneration ($)' : 'Standard Hourly Rate ($/hr)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-semibold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      value={salaryType === 'monthly' ? baseSalary : hourlyRate}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value) || 0;
                        if (salaryType === 'monthly') {
                          setBaseSalary(val);
                          setHourlyRate(Math.round((val / 160) * 100) / 100);
                        } else {
                          setHourlyRate(val);
                          setBaseSalary(Math.round(val * 160));
                        }
                      }}
                      className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-indigo-50/60 p-4 rounded-xl border border-indigo-100">
                <div>
                  <span className="text-slate-500 block">Estimated Annualized Gross</span>
                  <span className="text-lg font-bold text-indigo-900">
                    ${(baseSalary * 12).toLocaleString()} / year
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Calculated Hourly Equivalent (160h)</span>
                  <span className="text-lg font-bold text-indigo-900">
                    ${hourlyRate.toFixed(2)} / hour
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Taxes & Bank Details */}
          {activeTab === 'tax_bank' && (
            <div className="space-y-6">
              {/* Statutory Tax Withholding */}
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Statutory Tax Withholding Configuration
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Tax ID / SSN</label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="***-**-4910"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Filing Status</label>
                    <select
                      value={filingStatus}
                      onChange={(e) => setFilingStatus(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="single">Single</option>
                      <option value="married">Married (Joint)</option>
                      <option value="head_of_household">Head of Household</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State Withholding Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={stateWithholdingRate}
                      onChange={(e) => setStateWithholdingRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">401(k) Pre-Tax Contribution (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={preTax401kPercent}
                      onChange={(e) => setPreTax401kPercent(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Health Insurance (Monthly $)</label>
                    <input
                      type="number"
                      value={monthlyHealthInsurance}
                      onChange={(e) => setMonthlyHealthInsurance(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Federal Allowances</label>
                    <input
                      type="number"
                      min="0"
                      value={federalAllowances}
                      onChange={(e) => setFederalAllowances(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Direct Deposit & Bank Details */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                  Direct Deposit &amp; Payroll Bank Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder="JPMorgan Chase"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="4092817294"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Routing Number / Swift</label>
                    <input
                      type="text"
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      placeholder="12100024"
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Navigation & Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'profile' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'position') setActiveTab('profile');
                    if (activeTab === 'compensation') setActiveTab('position');
                    if (activeTab === 'tax_bank') setActiveTab('compensation');
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                >
                  Back
                </button>
              )}

              {activeTab !== 'tax_bank' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'profile') setActiveTab('position');
                    else if (activeTab === 'position') setActiveTab('compensation');
                    else if (activeTab === 'compensation') setActiveTab('tax_bank');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm shadow-indigo-200 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Employee</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

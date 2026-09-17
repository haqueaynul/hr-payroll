import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  FileSignature, 
  Users, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Employee, CompanyProfile, DocumentType, DocumentGenerationData } from '../types';
import { getOfferLetterContent, getAppointmentLetterContent, getNDAPaperContent } from '../utils/documentTemplates';

interface DocumentsViewProps {
  employees: Employee[];
  company: CompanyProfile;
  preSelectedEmployeeId?: string | null;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  employees,
  company,
  preSelectedEmployeeId,
}) => {
  const [docType, setDocType] = useState<DocumentType>('offer_letter');
  const [selectedEmpId, setSelectedEmpId] = useState<string>(
    preSelectedEmployeeId || employees[0]?.id || ''
  );
  const [copied, setCopied] = useState(false);

  // Form Fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [positionTitle, setPositionTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [joiningDate, setJoiningDate] = useState('');
  const [baseSalary, setBaseSalary] = useState(12000);
  const [probationMonths, setProbationMonths] = useState(3);
  const [noticePeriodDays, setNoticePeriodDays] = useState(30);
  const [signeeName, setSigneeName] = useState(company.hrDirector.split(',')[0]);
  const [signeeTitle, setSigneeTitle] = useState('Chief People Officer');
  const [workLocation, setWorkLocation] = useState('San Francisco, CA (HQ)');
  const [customTerms, setCustomTerms] = useState('');

  // Autofill when employee changes
  useEffect(() => {
    if (selectedEmpId) {
      const emp = employees.find((e) => e.id === selectedEmpId);
      if (emp) {
        setRecipientName(`${emp.firstName} ${emp.lastName}`);
        setRecipientEmail(emp.email);
        setRecipientPhone(emp.phone);
        setRecipientAddress(emp.address || '420 Mission Street, San Francisco, CA');
        setPositionTitle(emp.positionTitle);
        setDepartment(emp.department);
        setJoiningDate(emp.joiningDate);
        setBaseSalary(emp.baseSalary);
        setProbationMonths(emp.probationMonths);
        setWorkLocation(emp.workLocation);
      }
    }
  }, [selectedEmpId, employees]);

  const docData: DocumentGenerationData = {
    id: `doc_${Date.now()}`,
    docType,
    recipientName: recipientName || 'Candidate Name',
    recipientEmail: recipientEmail || 'candidate@example.com',
    recipientPhone: recipientPhone || '+1 (555) 000-0000',
    recipientAddress: recipientAddress || 'Residential Address',
    companyName: company.name,
    companyAddress: company.address,
    companyContact: company.phone,
    positionTitle: positionTitle || 'Software Engineer',
    department: department || 'Engineering',
    joiningDate: joiningDate || '2026-10-01',
    reportingManager: 'Engineering Director',
    workLocation,
    baseSalary,
    salaryFrequency: 'Monthly',
    probationMonths,
    noticePeriodDays,
    signeeName,
    signeeTitle,
    signDate: new Date().toISOString().split('T')[0],
    customTerms,
  };

  let renderedText = '';
  if (docType === 'offer_letter') {
    renderedText = getOfferLetterContent(docData);
  } else if (docType === 'appointment_letter') {
    renderedText = getAppointmentLetterContent(docData);
  } else {
    renderedText = getNDAPaperContent(docData);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([renderedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${docType.toUpperCase()}_${recipientName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-indigo-600" />
            Legal Document &amp; Paperwork Generator
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Produce legally binding Offer Letters, Appointment Contracts, and Non-Disclosure Agreements (NDAs).
          </p>
        </div>

        {/* Document Type Selector Segment */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          {[
            { id: 'offer_letter', label: 'Offer Letter' },
            { id: 'appointment_letter', label: 'Appointment Contract' },
            { id: 'nda_paper', label: 'NDA Paper' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDocType(tab.id as DocumentType)}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                docType === tab.id ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Inputs & Live Paper Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              Recipient &amp; Terms Autofill
            </span>

            {employees.length > 0 && (
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white"
              >
                <option value="">-- Autofill from Staff --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.firstName} {emp.lastName} ({emp.employeeCode})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient / Candidate Name *</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Position Title *</label>
                <input
                  type="text"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Joining Date *</label>
                <input
                  type="date"
                  value={joiningDate}
                  onChange={(e) => setJoiningDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Base Monthly Salary ($)</label>
                <input
                  type="number"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Probation (Months)</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  value={probationMonths}
                  onChange={(e) => setProbationMonths(parseInt(e.target.value) || 3)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notice Period (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={noticePeriodDays}
                  onChange={(e) => setNoticePeriodDays(parseInt(e.target.value) || 30)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authorized Signatory Name &amp; Title</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={signeeName}
                  onChange={(e) => setSigneeName(e.target.value)}
                  placeholder="Signee Name"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
                <input
                  type="text"
                  value={signeeTitle}
                  onChange={(e) => setSigneeTitle(e.target.value)}
                  placeholder="Signee Title"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Clauses / Special Covenants</label>
              <textarea
                rows={3}
                value={customTerms}
                onChange={(e) => setCustomTerms(e.target.value)}
                placeholder="Optional custom terms (e.g. signing bonus vesting, relocation stipend)..."
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 font-mono text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Stylized Live Paper Letterhead Preview */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Toolbar */}
          <div className="flex items-center justify-between bg-white rounded-xl border border-slate-200 px-4 py-2.5 shadow-xs">
            <span className="text-xs font-bold text-slate-700 uppercase">Document Paperhead Preview</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Text</span>
              </button>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Paper Canvas */}
          <div className="bg-white rounded-2xl border border-slate-300/80 shadow-lg p-8 sm:p-10 font-serif text-slate-900 leading-relaxed text-xs sm:text-sm min-h-[500px] select-text">
            {/* Letterhead Header */}
            <div className="border-b-2 border-indigo-900/80 pb-4 mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-sans tracking-tight text-indigo-950 uppercase">
                  {company.name}
                </h2>
                <p className="text-[11px] font-sans text-slate-500">{company.address}</p>
                <p className="text-[11px] font-sans text-slate-500 font-mono">
                  {company.phone} • {company.email}
                </p>
              </div>
              <div className="text-right">
                <span className="font-mono text-[10px] text-slate-400 block">OFFICIAL HR RECORD</span>
                <span className="text-[11px] font-mono text-indigo-900 font-bold uppercase">
                  {docType.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Document Body formatted */}
            <div className="whitespace-pre-line text-slate-800 space-y-4 font-sans text-xs sm:text-sm leading-relaxed">
              {renderedText}
            </div>

            {/* Confidential footer watermark */}
            <div className="mt-12 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-sans flex items-center justify-between">
              <span>Apex Global HR Automated Document Services</span>
              <span>Verified Statutory Compliance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

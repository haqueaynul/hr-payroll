import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  JobPosition, 
  WorkHourLog, 
  PaySlip, 
  CompanyProfile,
  DocumentType 
} from './types';
import { 
  COMPANY_PROFILE, 
  INITIAL_POSITIONS, 
  INITIAL_EMPLOYEES, 
  INITIAL_HOUR_LOGS, 
  INITIAL_PAYSLIPS 
} from './data/initialData';
import { generatePaySlipForEmployee } from './utils/taxCalculator';

// UI Components
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { EmployeesView } from './components/EmployeesView';
import { EmployeeModal } from './components/EmployeeModal';
import { PositionsView } from './components/PositionsView';
import { PositionModal } from './components/PositionModal';
import { HoursTrackerView } from './components/HoursTrackerView';
import { TaxWithholdingsView } from './components/TaxWithholdingsView';
import { PaySlipsView } from './components/PaySlipsView';
import { PaySlipModal } from './components/PaySlipModal';
import { DocumentsView } from './components/DocumentsView';
import { MobileAppsView } from './components/MobileAppsView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Persistence State
  const [company] = useState<CompanyProfile>(COMPANY_PROFILE);

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('hr_payroll_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [positions, setPositions] = useState<JobPosition[]>(() => {
    const saved = localStorage.getItem('hr_payroll_positions');
    return saved ? JSON.parse(saved) : INITIAL_POSITIONS;
  });

  const [hourLogs, setHourLogs] = useState<WorkHourLog[]>(() => {
    const saved = localStorage.getItem('hr_payroll_hours');
    return saved ? JSON.parse(saved) : INITIAL_HOUR_LOGS;
  });

  const [payslips, setPayslips] = useState<PaySlip[]>(() => {
    const saved = localStorage.getItem('hr_payroll_slips');
    return saved ? JSON.parse(saved) : INITIAL_PAYSLIPS;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('hr_payroll_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('hr_payroll_positions', JSON.stringify(positions));
  }, [positions]);

  useEffect(() => {
    localStorage.setItem('hr_payroll_hours', JSON.stringify(hourLogs));
  }, [hourLogs]);

  useEffect(() => {
    localStorage.setItem('hr_payroll_slips', JSON.stringify(payslips));
  }, [payslips]);

  // Modal States
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false);
  const [positionToEdit, setPositionToEdit] = useState<JobPosition | null>(null);

  const [isPaySlipModalOpen, setIsPaySlipModalOpen] = useState(false);
  const [selectedPaySlip, setSelectedPaySlip] = useState<PaySlip | null>(null);

  const [docEmployeeId, setDocEmployeeId] = useState<string | null>(null);

  // Employee Handlers
  const handleSaveEmployee = (empData: Employee) => {
    if (employeeToEdit) {
      setEmployees((prev) => prev.map((e) => (e.id === empData.id ? empData : e)));
    } else {
      setEmployees((prev) => [empData, ...prev]);
    }
    setEmployeeToEdit(null);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    setHourLogs((prev) => prev.filter((h) => h.employeeId !== id));
  };

  // Position Handlers
  const handleSavePosition = (posData: JobPosition) => {
    if (positionToEdit) {
      setPositions((prev) => prev.map((p) => (p.id === posData.id ? posData : p)));
    } else {
      setPositions((prev) => [posData, ...prev]);
    }
    setPositionToEdit(null);
  };

  const handleDeletePosition = (id: string) => {
    setPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // Work Hours Handlers
  const handleAddHourLog = (log: WorkHourLog) => {
    setHourLogs((prev) => [log, ...prev]);
  };

  const handleUpdateHourLog = (updated: WorkHourLog) => {
    setHourLogs((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDeleteHourLog = (id: string) => {
    setHourLogs((prev) => prev.filter((l) => l.id !== id));
  };

  // Automated Payroll Run
  const handleRunAutomatedPayroll = () => {
    const today = new Date().toISOString().split('T')[0];
    const newSlips: PaySlip[] = [];

    employees.forEach((emp) => {
      // Find employee's approved logs
      const logs = hourLogs.filter((l) => l.employeeId === emp.id && l.status === 'approved');
      const regularHours = logs.length > 0 ? logs.reduce((a, b) => a + b.regularHours, 0) : 160;
      const overtimeHours = logs.reduce((a, b) => a + b.overtimeHours, 0);
      const holidayHours = logs.reduce((a, b) => a + b.holidayHours, 0);

      const slip = generatePaySlipForEmployee(
        emp,
        'September 2026',
        today,
        regularHours,
        overtimeHours,
        holidayHours
      );
      newSlips.push(slip);
    });

    setPayslips((prev) => [...newSlips, ...prev]);
    setActiveTab('payroll');
    alert(`Successfully generated ${newSlips.length} automated employee pay slips!`);
  };

  // Quick Action: View or generate single payslip
  const handleViewPaySlipForEmployee = (employeeId: string) => {
    const emp = employees.find((e) => e.id === employeeId);
    if (!emp) return;

    // Check if slip exists
    const existing = payslips.find((s) => s.employeeId === employeeId);
    if (existing) {
      setSelectedPaySlip(existing);
      setIsPaySlipModalOpen(true);
    } else {
      // Generate one
      const logs = hourLogs.filter((l) => l.employeeId === emp.id && l.status === 'approved');
      const regularHours = logs.length > 0 ? logs.reduce((a, b) => a + b.regularHours, 0) : 160;
      const overtimeHours = logs.reduce((a, b) => a + b.overtimeHours, 0);
      const holidayHours = logs.reduce((a, b) => a + b.holidayHours, 0);

      const generated = generatePaySlipForEmployee(
        emp,
        'September 2026',
        new Date().toISOString().split('T')[0],
        regularHours,
        overtimeHours,
        holidayHours
      );
      setPayslips((prev) => [generated, ...prev]);
      setSelectedPaySlip(generated);
      setIsPaySlipModalOpen(true);
    }
  };

  // Quick Action: Open Document Generator
  const handleGenerateDocForEmployee = (
    employeeId: string,
    docType: 'offer_letter' | 'appointment_letter' | 'nda_paper'
  ) => {
    setDocEmployeeId(employeeId);
    setActiveTab('documents');
  };

  const handleMarkSlipPaid = (slipId: string) => {
    setPayslips((prev) =>
      prev.map((s) =>
        s.id === slipId ? { ...s, status: s.status === 'paid' ? 'pending' : 'paid' } : s
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex flex-col">
      {/* Top Application Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        employeeCount={employees.length}
        positionCount={positions.length}
        companyName={company.name}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            employees={employees}
            positions={positions}
            hourLogs={hourLogs}
            payslips={payslips}
            onNavigate={setActiveTab}
            onAddEmployee={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
            onRunPayroll={handleRunAutomatedPayroll}
            onViewSlip={(slip) => {
              setSelectedPaySlip(slip);
              setIsPaySlipModalOpen(true);
            }}
          />
        )}

        {activeTab === 'employees' && (
          <EmployeesView
            employees={employees}
            positions={positions}
            onAddEmployee={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEmployeeToEdit(emp);
              setIsEmployeeModalOpen(true);
            }}
            onDeleteEmployee={handleDeleteEmployee}
            onGenerateDoc={handleGenerateDocForEmployee}
            onViewPaySlip={handleViewPaySlipForEmployee}
          />
        )}

        {activeTab === 'positions' && (
          <PositionsView
            positions={positions}
            employees={employees}
            onAddPosition={() => {
              setPositionToEdit(null);
              setIsPositionModalOpen(true);
            }}
            onEditPosition={(pos) => {
              setPositionToEdit(pos);
              setIsPositionModalOpen(true);
            }}
            onDeletePosition={handleDeletePosition}
          />
        )}

        {activeTab === 'hours' && (
          <HoursTrackerView
            employees={employees}
            hourLogs={hourLogs}
            onAddHourLog={handleAddHourLog}
            onUpdateHourLog={handleUpdateHourLog}
            onDeleteHourLog={handleDeleteHourLog}
          />
        )}

        {activeTab === 'taxes' && <TaxWithholdingsView />}

        {activeTab === 'payroll' && (
          <PaySlipsView
            payslips={payslips}
            employees={employees}
            onRunPayroll={handleRunAutomatedPayroll}
            onViewPaySlip={(slip) => {
              setSelectedPaySlip(slip);
              setIsPaySlipModalOpen(true);
            }}
            onMarkPaid={handleMarkSlipPaid}
          />
        )}

        {activeTab === 'documents' && (
          <DocumentsView
            employees={employees}
            company={company}
            preSelectedEmployeeId={docEmployeeId}
          />
        )}

        {activeTab === 'mobile_apps' && <MobileAppsView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">{company.name}</span>
          <span>• HR, Payroll &amp; Legal Compliance Platform</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Xcode 15/16 Ready (SwiftUI)</span>
          <span>•</span>
          <span>Android Studio Hedgehog+ Ready (Compose)</span>
          <span>•</span>
          <span className="text-indigo-600 font-medium cursor-pointer" onClick={() => setActiveTab('mobile_apps')}>
            Download Native Projects
          </span>
        </div>
      </footer>

      {/* Modals */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => {
          setIsEmployeeModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
        positions={positions}
      />

      <PositionModal
        isOpen={isPositionModalOpen}
        onClose={() => {
          setIsPositionModalOpen(false);
          setPositionToEdit(null);
        }}
        onSave={handleSavePosition}
        positionToEdit={positionToEdit}
      />

      <PaySlipModal
        isOpen={isPaySlipModalOpen}
        onClose={() => {
          setIsPaySlipModalOpen(false);
          setSelectedPaySlip(null);
        }}
        payslip={selectedPaySlip}
        company={company}
      />
    </div>
  );
}

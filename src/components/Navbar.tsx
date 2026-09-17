import React from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  Clock, 
  Receipt, 
  FileText, 
  Smartphone, 
  Calculator, 
  Plus, 
  PlayCircle
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'employees' 
  | 'positions' 
  | 'hours' 
  | 'taxes' 
  | 'payroll' 
  | 'documents' 
  | 'mobile_apps'
  | string;

export interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  employeeCount?: number;
  positionCount?: number;
  companyName?: string;
  onOpenAddEmployee?: () => void;
  onOpenAddPosition?: () => void;
  onRunPayroll?: () => void;
}

interface TabItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  employeeCount = 5,
  positionCount = 6,
  companyName = 'Apex Global Technologies Inc.',
  onOpenAddEmployee,
  onOpenAddPosition,
  onRunPayroll,
}) => {
  const tabs: TabItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Building2 },
    { id: 'employees', label: 'Employees & Photos', icon: Users },
    { id: 'positions', label: 'Job Positions', icon: Briefcase },
    { id: 'hours', label: 'Hours & Overtime', icon: Clock },
    { id: 'taxes', label: 'Tax Withholdings', icon: Calculator },
    { id: 'payroll', label: 'Automated Pay Slips', icon: Receipt },
    { id: 'documents', label: 'Offer / NDA / Docs', icon: FileText },
    { id: 'mobile_apps', label: 'iOS & Android Native', icon: Smartphone, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner with Company Info and Action Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 tracking-tight text-base sm:text-lg">
                  ApexHR
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  Payroll &amp; Native Suite
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {companyName} • {employeeCount} Staff • {positionCount} Positions
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {onOpenAddEmployee && (
              <button
                onClick={onOpenAddEmployee}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Employee</span>
              </button>
            )}

            {onRunPayroll && (
              <button
                onClick={onRunPayroll}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5" />
                <span>Run Payroll</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('mobile_apps')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Native Projects</span>
              <span className="md:hidden">Apps</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-slate-50/80 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  } ${tab.highlight ? 'ring-1 ring-indigo-200 bg-indigo-50/40 text-indigo-900' : ''}`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.highlight && (
                    <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-full">
                      Native Apps
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

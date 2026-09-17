export interface ProjectFile {
  path: string;
  content: string;
  language: 'swift' | 'kotlin' | 'xml' | 'groovy' | 'json' | 'properties';
}

export const IOS_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'HRPayrollApp/HRPayrollApp.swift',
    language: 'swift',
    content: `//
//  HRPayrollApp.swift
//  HRPayrollApp
//
//  Complete runnable native iOS application for Xcode
//

import SwiftUI

@main
struct HRPayrollApp: App {
    @StateObject private var viewModel = HRPayrollViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(viewModel)
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Models/HRModels.swift',
    language: 'swift',
    content: `//
//  HRModels.swift
//  HRPayrollApp
//

import Foundation

public enum Department: String, CaseIterable, Codable, Identifiable {
    case engineering = "Engineering"
    case product = "Product"
    case design = "Design"
    case hr = "Human Resources"
    case finance = "Finance"
    case marketing = "Marketing"
    case operations = "Operations"
    
    public var id: String { rawValue }
}

public enum EmploymentType: String, CaseIterable, Codable {
    case fullTime = "Full-time"
    case partTime = "Part-time"
    case contract = "Contract"
    case intern = "Intern"
}

public struct JobPosition: Identifiable, Codable {
    public var id: UUID = UUID()
    public var code: String
    public var title: String
    public var department: Department
    public var minSalary: Double
    public var maxSalary: Double
    public var description: String
    public var status: String = "active"
}

public struct TaxInfo: Codable {
    public var taxId: String
    public var filingStatus: String // "Single", "Married"
    public var stateWithholdingRate: Double // e.g. 5.0
    public var federalAllowances: Int
    public var preTax401kPercent: Double
    public var monthlyHealthInsurance: Double
}

public struct Employee: Identifiable, Codable {
    public var id: UUID = UUID()
    public var employeeCode: String
    public var firstName: String
    public var lastName: String
    public var email: String
    public var phone: String
    public var photoBase64: String? = nil
    public var positionTitle: String
    public var department: Department
    public var joiningDate: Date
    public var probationMonths: Int = 3
    public var baseSalary: Double
    public var hourlyRate: Double
    public var isHourly: Bool = false
    public var taxInfo: TaxInfo
    public var bankAccount: String
    
    public var fullName: String {
        "\\(firstName) \\(lastName)"
    }
    
    public var tenureFormatted: String {
        let diff = Calendar.current.dateComponents([.year, .month], from: joiningDate, to: Date())
        let years = diff.year ?? 0
        let months = diff.month ?? 0
        if years > 0 {
            return "\\(years)y \\(months)m"
        }
        return "\\(months) months"
    }
}

public struct WorkHourLog: Identifiable, Codable {
    public var id: UUID = UUID()
    public var employeeId: UUID
    public var date: Date
    public var regularHours: Double
    public var overtimeHours: Double
    public var holidayHours: Double
    public var isApproved: Bool
}

public struct PaySlip: Identifiable, Codable {
    public var id: UUID = UUID()
    public var slipNumber: String
    public var employeeName: String
    public var employeeCode: String
    public var positionTitle: String
    public var department: String
    public var payDate: Date
    public var grossPay: Double
    public var regularPay: Double
    public var overtimePay: Double
    public var federalTax: Double
    public var stateTax: Double
    public var socialSecurity: Double
    public var medicare: Double
    public var netPay: Double
}
`,
  },
  {
    path: 'HRPayrollApp/ViewModels/HRPayrollViewModel.swift',
    language: 'swift',
    content: `//
//  HRPayrollViewModel.swift
//  HRPayrollApp
//

import SwiftUI
import Combine

class HRPayrollViewModel: ObservableObject {
    @Published var employees: [Employee] = []
    @Published var positions: [JobPosition] = []
    @Published var hourLogs: [WorkHourLog] = []
    @Published var payslips: [PaySlip] = []
    
    init() {
        loadSampleData()
    }
    
    func loadSampleData() {
        let pos1 = JobPosition(code: "ENG-01", title: "Senior iOS Engineer", department: .engineering, minSalary: 130000, maxSalary: 175000, description: "Lead mobile client engineering.")
        let pos2 = JobPosition(code: "HR-01", title: "HR Business Partner", department: .hr, minSalary: 85000, maxSalary: 115000, description: "Manage talent and employee operations.")
        positions = [pos1, pos2]
        
        let joinDate1 = Calendar.current.date(byAdding: .year, value: -2, to: Date()) ?? Date()
        let joinDate2 = Calendar.current.date(byAdding: .month, value: -2, to: Date()) ?? Date()
        
        let emp1 = Employee(
            employeeCode: "EMP-101",
            firstName: "Sarah",
            lastName: "Connor",
            email: "sarah.connor@enterprise.io",
            phone: "+1 415-555-0199",
            photoBase64: nil,
            positionTitle: "Senior iOS Engineer",
            department: .engineering,
            joiningDate: joinDate1,
            probationMonths: 3,
            baseSalary: 11500.0,
            hourlyRate: 72.0,
            isHourly: false,
            taxInfo: TaxInfo(taxId: "SSN-***-4921", filingStatus: "Single", stateWithholdingRate: 5.0, federalAllowances: 1, preTax401kPercent: 5.0, monthlyHealthInsurance: 160.0),
            bankAccount: "Chase (••••8912)"
        )
        
        let emp2 = Employee(
            employeeCode: "EMP-102",
            firstName: "Marcus",
            lastName: "Vance",
            email: "m.vance@enterprise.io",
            phone: "+1 415-555-0144",
            photoBase64: nil,
            positionTitle: "HR Business Partner",
            department: .hr,
            joiningDate: joinDate2,
            probationMonths: 3,
            baseSalary: 7800.0,
            hourlyRate: 48.0,
            isHourly: false,
            taxInfo: TaxInfo(taxId: "SSN-***-9022", filingStatus: "Married", stateWithholdingRate: 4.5, federalAllowances: 2, preTax401kPercent: 4.0, monthlyHealthInsurance: 120.0),
            bankAccount: "BoA (••••3411)"
        )
        
        employees = [emp1, emp2]
        
        // Sample hour logs
        hourLogs = [
            WorkHourLog(employeeId: emp1.id, date: Date(), regularHours: 40, overtimeHours: 5, holidayHours: 0, isApproved: true),
            WorkHourLog(employeeId: emp2.id, date: Date(), regularHours: 40, overtimeHours: 0, holidayHours: 0, isApproved: true)
        ]
        
        generateAutomatedPaySlips()
    }
    
    func addEmployee(_ emp: Employee) {
        employees.append(emp)
    }
    
    func addPosition(_ pos: JobPosition) {
        positions.append(pos)
    }
    
    func logHours(employeeId: UUID, regular: Double, overtime: Double, holiday: Double) {
        let log = WorkHourLog(employeeId: employeeId, date: Date(), regularHours: regular, overtimeHours: overtime, holidayHours: holiday, isApproved: true)
        hourLogs.append(log)
    }
    
    func generateAutomatedPaySlips() {
        var generated: [PaySlip] = []
        for (idx, emp) in employees.enumerated() {
            let logs = hourLogs.filter { $0.employeeId == emp.id && $0.isApproved }
            let regHours = logs.reduce(0.0) { $0 + $1.regularHours }
            let otHours = logs.reduce(0.0) { $0 + $1.overtimeHours }
            
            let regPay = emp.baseSalary
            let hourlyBase = emp.baseSalary / 160.0
            let otPay = otHours * (hourlyBase * 1.5)
            let gross = regPay + otPay
            
            let ss = gross * 0.062
            let med = gross * 0.0145
            let stateTax = gross * (emp.taxInfo.stateWithholdingRate / 100.0)
            let fedTax = gross * 0.12
            let deductions = ss + med + stateTax + fedTax + emp.taxInfo.monthlyHealthInsurance
            let net = max(0, gross - deductions)
            
            let slip = PaySlip(
                slipNumber: String(format: "PSL-2026-%04d", idx + 1),
                employeeName: emp.fullName,
                employeeCode: emp.employeeCode,
                positionTitle: emp.positionTitle,
                department: emp.department.rawValue,
                payDate: Date(),
                grossPay: gross,
                regularPay: regPay,
                overtimePay: otPay,
                federalTax: fedTax,
                stateTax: stateTax,
                socialSecurity: ss,
                medicare: med,
                netPay: net
            )
            generated.append(slip)
        }
        self.payslips = generated
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/ContentView.swift',
    language: 'swift',
    content: `//
//  ContentView.swift
//  HRPayrollApp
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    
    var body: some View {
        TabView {
            DashboardView()
                .tabItem {
                    Label("Dashboard", systemImage: "chart.bar.xaxis")
                }
            
            EmployeesView()
                .tabItem {
                    Label("Employees", systemImage: "person.3.fill")
                }
            
            PositionsView()
                .tabItem {
                    Label("Positions", systemImage: "briefcase.fill")
                }
            
            HoursView()
                .tabItem {
                    Label("Hours", systemImage: "clock.fill")
                }
            
            PayrollView()
                .tabItem {
                    Label("Payroll", systemImage: "dollarsign.circle.fill")
                }
            
            DocumentsView()
                .tabItem {
                    Label("Documents", systemImage: "doc.text.fill")
                }
        }
    }
}

struct DashboardView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    
    var body: some View {
        NavigationView {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    // Summary Cards
                    HStack(spacing: 12) {
                        MetricCard(title: "Active Staff", value: "\\(vm.employees.count)", icon: "person.2", color: .blue)
                        MetricCard(title: "Open Roles", value: "\\(vm.positions.count)", icon: "briefcase", color: .purple)
                    }
                    
                    HStack(spacing: 12) {
                        let totalGross = vm.payslips.reduce(0) { $0 + $1.grossPay }
                        MetricCard(title: "Total Payroll", value: String(format: "$%.0f", totalGross), icon: "dollarsign.arrow.circlepath", color: .green)
                        let totalNet = vm.payslips.reduce(0) { $0 + $1.netPay }
                        MetricCard(title: "Total Net Pay", value: String(format: "$%.0f", totalNet), icon: "banknote", color: .indigo)
                    }
                    
                    Text("Tenure & Anniversaries")
                        .font(.headline)
                        .padding(.top, 8)
                    
                    ForEach(vm.employees) { emp in
                        HStack {
                            Circle()
                                .fill(Color.blue.opacity(0.15))
                                .frame(width: 44, height: 44)
                                .overlay(Text(String(emp.firstName.prefix(1))).bold().foregroundColor(.blue))
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text(emp.fullName).bold()
                                Text(emp.positionTitle).font(.caption).foregroundColor(.secondary)
                            }
                            Spacer()
                            VStack(alignment: .trailing, spacing: 3) {
                                Text(emp.tenureFormatted)
                                    .font(.subheadline)
                                    .bold()
                                    .foregroundColor(.blue)
                                Text("Joined \\(emp.joiningDate.formatted(date: .abbreviated, time: .omitted))")
                                    .font(.caption2)
                                    .foregroundColor(.secondary)
                            }
                        }
                        .padding()
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(12)
                    }
                }
                .padding()
            }
            .navigationTitle("HR & Payroll Dashboard")
        }
    }
}

struct MetricCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
                .foregroundColor(color)
            Text(value)
                .font(.title).bold()
            Text(title)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(.secondarySystemBackground))
        .cornerRadius(12)
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/EmployeesView.swift',
    language: 'swift',
    content: `//
//  EmployeesView.swift
//  HRPayrollApp
//

import SwiftUI
import PhotosUI

struct EmployeesView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    @State private var showingAddSheet = false
    @State private var searchText = ""
    
    var filteredEmployees: [Employee] {
        if searchText.isEmpty { return vm.employees }
        return vm.employees.filter {
            $0.fullName.localizedCaseInsensitiveContains(searchText) ||
            $0.positionTitle.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    var body: some View {
        NavigationView {
            List {
                ForEach(filteredEmployees) { emp in
                    NavigationLink(destination: EmployeeDetailView(employee: emp)) {
                        HStack(spacing: 14) {
                            Circle()
                                .fill(Color.blue.opacity(0.2))
                                .frame(width: 48, height: 48)
                                .overlay(
                                    Text(String(emp.firstName.prefix(1)) + String(emp.lastName.prefix(1)))
                                        .font(.subheadline).bold()
                                        .foregroundColor(.blue)
                                )
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(emp.fullName)
                                    .font(.headline)
                                Text(emp.positionTitle)
                                    .font(.subheadline)
                                    .foregroundColor(.secondary)
                                HStack {
                                    Text(emp.department.rawValue)
                                        .font(.caption2)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(Color.blue.opacity(0.1))
                                        .cornerRadius(4)
                                    Text("Tenure: \\(emp.tenureFormatted)")
                                        .font(.caption2)
                                        .foregroundColor(.secondary)
                                }
                            }
                        }
                        .padding(.vertical, 4)
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Search employees...")
            .navigationTitle("Employees (\\(vm.employees.count))")
            .toolbar {
                Button {
                    showingAddSheet = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                        .font(.title3)
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                AddEmployeeView()
            }
        }
    }
}

struct EmployeeDetailView: View {
    let employee: Employee
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 18) {
                // Header
                HStack(spacing: 16) {
                    Circle()
                        .fill(Color.blue.opacity(0.2))
                        .frame(width: 72, height: 72)
                        .overlay(
                            Text(String(employee.firstName.prefix(1)) + String(employee.lastName.prefix(1)))
                                .font(.title).bold()
                                .foregroundColor(.blue)
                        )
                    VStack(alignment: .leading, spacing: 4) {
                        Text(employee.fullName)
                            .font(.title2).bold()
                        Text(employee.positionTitle)
                            .foregroundColor(.secondary)
                        Text(employee.employeeCode)
                            .font(.caption)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Color.gray.opacity(0.15))
                            .cornerRadius(4)
                    }
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
                
                // Joining Date & Tenure
                VStack(alignment: .leading, spacing: 8) {
                    Text("Employment & Tenure").font(.headline)
                    HStack {
                        VStack(alignment: .leading) {
                            Text("Joining Date").font(.caption).foregroundColor(.secondary)
                            Text(employee.joiningDate.formatted(date: .long, time: .omitted)).bold()
                        }
                        Spacer()
                        VStack(alignment: .trailing) {
                            Text("Current Tenure").font(.caption).foregroundColor(.secondary)
                            Text(employee.tenureFormatted).bold().foregroundColor(.blue)
                        }
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
                
                // Compensation
                VStack(alignment: .leading, spacing: 8) {
                    Text("Salary & Bank Information").font(.headline)
                    HStack {
                        Text("Base Monthly Salary:")
                        Spacer()
                        Text(String(format: "$%.2f", employee.baseSalary)).bold()
                    }
                    HStack {
                        Text("Hourly Rate:")
                        Spacer()
                        Text(String(format: "$%.2f/hr", employee.hourlyRate)).bold()
                    }
                    HStack {
                        Text("Bank Account:")
                        Spacer()
                        Text(employee.bankAccount).foregroundColor(.secondary)
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
                
                // Tax Withholding
                VStack(alignment: .leading, spacing: 8) {
                    Text("Tax Withholdings").font(.headline)
                    HStack {
                        Text("Tax ID / SSN:")
                        Spacer()
                        Text(employee.taxInfo.taxId)
                    }
                    HStack {
                        Text("Filing Status:")
                        Spacer()
                        Text(employee.taxInfo.filingStatus)
                    }
                    HStack {
                        Text("State Withholding Rate:")
                        Spacer()
                        Text(String(format: "%.1f%%", employee.taxInfo.stateWithholdingRate))
                    }
                    HStack {
                        Text("401(k) Pre-tax:")
                        Spacer()
                        Text(String(format: "%.1f%%", employee.taxInfo.preTax401kPercent))
                    }
                }
                .padding()
                .background(Color(.secondarySystemBackground))
                .cornerRadius(12)
            }
            .padding()
        }
        .navigationTitle(employee.fullName)
    }
}

struct AddEmployeeView: View {
    @Environment(\\.dismiss) var dismiss
    @EnvironmentObject var vm: HRPayrollViewModel
    
    @State private var firstName = ""
    @State private var lastName = ""
    @State private var email = ""
    @State private var phone = ""
    @State private var positionTitle = "Software Engineer"
    @State private var department = Department.engineering
    @State private var baseSalary = 8000.0
    @State private var hourlyRate = 50.0
    @State private var joiningDate = Date()
    @State private var taxId = "SSN-***-1234"
    @State private var stateTax = 5.0
    @State private var bankAccount = "Chase (••••1234)"
    
    var body: some View {
        NavigationView {
            Form {
                Section("Personal Details") {
                    TextField("First Name", text: $firstName)
                    TextField("Last Name", text: $lastName)
                    TextField("Email", text: $email)
                    TextField("Phone", text: $phone)
                }
                
                Section("Position & Joining Date") {
                    TextField("Position Title", text: $positionTitle)
                    Picker("Department", selection: $department) {
                        ForEach(Department.allCases) { dept in
                            Text(dept.rawValue).tag(dept)
                        }
                    }
                    DatePicker("Joining Date", selection: $joiningDate, displayedComponents: .date)
                }
                
                Section("Salary & Tax") {
                    HStack {
                        Text("Base Monthly Salary ($)")
                        Spacer()
                        TextField("Salary", value: $baseSalary, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    HStack {
                        Text("State Tax Rate (%)")
                        Spacer()
                        TextField("Rate", value: $stateTax, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
            }
            .navigationTitle("Add New Employee")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let newEmp = Employee(
                            employeeCode: "EMP-\\(vm.employees.count + 101)",
                            firstName: firstName.isEmpty ? "New" : firstName,
                            lastName: lastName.isEmpty ? "Employee" : lastName,
                            email: email,
                            phone: phone,
                            photoBase64: nil,
                            positionTitle: positionTitle,
                            department: department,
                            joiningDate: joiningDate,
                            probationMonths: 3,
                            baseSalary: baseSalary,
                            hourlyRate: hourlyRate,
                            isHourly: false,
                            taxInfo: TaxInfo(taxId: taxId, filingStatus: "Single", stateWithholdingRate: stateTax, federalAllowances: 1, preTax401kPercent: 5.0, monthlyHealthInsurance: 150.0),
                            bankAccount: bankAccount
                        )
                        vm.addEmployee(newEmp)
                        dismiss()
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/PositionsView.swift',
    language: 'swift',
    content: `//
//  PositionsView.swift
//  HRPayrollApp
//

import SwiftUI

struct PositionsView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    @State private var showingAddSheet = false
    
    var body: some View {
        NavigationView {
            List {
                ForEach(vm.positions) { pos in
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text(pos.title)
                                .font(.headline)
                            Spacer()
                            Text(pos.code)
                                .font(.caption).bold()
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.purple.opacity(0.15))
                                .cornerRadius(4)
                        }
                        Text(pos.department.rawValue)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                        Text(String(format: "Salary Band: $%.0fk - $%.0fk", pos.minSalary/1000, pos.maxSalary/1000))
                            .font(.caption)
                            .foregroundColor(.blue)
                        Text(pos.description)
                            .font(.caption)
                            .foregroundColor(.secondary)
                            .lineLimit(2)
                    }
                    .padding(.vertical, 4)
                }
            }
            .navigationTitle("Job Positions (\\(vm.positions.count))")
            .toolbar {
                Button {
                    showingAddSheet = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                }
            }
            .sheet(isPresented: $showingAddSheet) {
                AddPositionView()
            }
        }
    }
}

struct AddPositionView: View {
    @Environment(\\.dismiss) var dismiss
    @EnvironmentObject var vm: HRPayrollViewModel
    
    @State private var title = ""
    @State private var code = ""
    @State private var department = Department.engineering
    @State private var minSalary: Double = 90000
    @State private var maxSalary: Double = 130000
    @State private var description = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section("Position Info") {
                    TextField("Position Title (e.g. Lead Architect)", text: $title)
                    TextField("Code (e.g. ENG-04)", text: $code)
                    Picker("Department", selection: $department) {
                        ForEach(Department.allCases) { dept in
                            Text(dept.rawValue).tag(dept)
                        }
                    }
                }
                Section("Salary Band") {
                    HStack {
                        Text("Min Annual ($)")
                        Spacer()
                        TextField("Min", value: $minSalary, format: .number)
                            .keyboardType(.numberPad)
                    }
                    HStack {
                        Text("Max Annual ($)")
                        Spacer()
                        TextField("Max", value: $maxSalary, format: .number)
                            .keyboardType(.numberPad)
                    }
                }
                Section("Job Description") {
                    TextField("Responsibilities & scope", text: $description)
                }
            }
            .navigationTitle("Create Position")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let newPos = JobPosition(
                            code: code.isEmpty ? "POS-\\(vm.positions.count + 1)" : code,
                            title: title.isEmpty ? "New Position" : title,
                            department: department,
                            minSalary: minSalary,
                            maxSalary: maxSalary,
                            description: description
                        )
                        vm.addPosition(newPos)
                        dismiss()
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/HoursView.swift',
    language: 'swift',
    content: `//
//  HoursView.swift
//  HRPayrollApp
//

import SwiftUI

struct HoursView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    @State private var showingLogSheet = false
    
    var body: some View {
        NavigationView {
            List {
                Section("Logged Timesheets") {
                    ForEach(vm.hourLogs) { log in
                        if let emp = vm.employees.first(where: { $0.id == log.employeeId }) {
                            VStack(alignment: .leading, spacing: 6) {
                                HStack {
                                    Text(emp.fullName).bold()
                                    Spacer()
                                    Text(log.date.formatted(date: .abbreviated, time: .omitted))
                                        .font(.caption)
                                        .foregroundColor(.secondary)
                                }
                                HStack(spacing: 16) {
                                    Label(String(format: "Regular: %.1fh", log.regularHours), systemImage: "clock")
                                        .font(.caption)
                                    Label(String(format: "Overtime: %.1fh", log.overtimeHours), systemImage: "bolt.fill")
                                        .font(.caption)
                                        .foregroundColor(.orange)
                                    Spacer()
                                    Text(log.isApproved ? "Approved" : "Pending")
                                        .font(.caption2).bold()
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(log.isApproved ? Color.green.opacity(0.15) : Color.orange.opacity(0.15))
                                        .foregroundColor(log.isApproved ? .green : .orange)
                                        .cornerRadius(4)
                                }
                            }
                            .padding(.vertical, 4)
                        }
                    }
                }
            }
            .navigationTitle("Hours Tracker")
            .toolbar {
                Button {
                    showingLogSheet = true
                } label: {
                    Image(systemName: "plus.circle.fill")
                }
            }
            .sheet(isPresented: $showingLogSheet) {
                LogHoursView()
            }
        }
    }
}

struct LogHoursView: View {
    @Environment(\\.dismiss) var dismiss
    @EnvironmentObject var vm: HRPayrollViewModel
    
    @State private var selectedEmpIndex = 0
    @State private var regularHours: Double = 40.0
    @State private var overtimeHours: Double = 4.0
    @State private var holidayHours: Double = 0.0
    
    var body: some View {
        NavigationView {
            Form {
                if !vm.employees.isEmpty {
                    Picker("Select Employee", selection: $selectedEmpIndex) {
                        ForEach(0..<vm.employees.count, id: \\.self) { idx in
                            Text(vm.employees[idx].fullName).tag(idx)
                        }
                    }
                }
                Section("Work Hours") {
                    HStack {
                        Text("Regular Hours")
                        Spacer()
                        TextField("Regular", value: $regularHours, format: .number)
                            .keyboardType(.decimalPad)
                    }
                    HStack {
                        Text("Overtime Hours (1.5x)")
                        Spacer()
                        TextField("Overtime", value: $overtimeHours, format: .number)
                            .keyboardType(.decimalPad)
                    }
                    HStack {
                        Text("Holiday Hours (2.0x)")
                        Spacer()
                        TextField("Holiday", value: $holidayHours, format: .number)
                            .keyboardType(.decimalPad)
                    }
                }
            }
            .navigationTitle("Log Employee Hours")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        if !vm.employees.isEmpty {
                            let emp = vm.employees[selectedEmpIndex]
                            vm.logHours(employeeId: emp.id, regular: regularHours, overtime: overtimeHours, holiday: holidayHours)
                            vm.generateAutomatedPaySlips()
                        }
                        dismiss()
                    }
                }
            }
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/PayrollView.swift',
    language: 'swift',
    content: `//
//  PayrollView.swift
//  HRPayrollApp
//

import SwiftUI

struct PayrollView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    
    var body: some View {
        NavigationView {
            List {
                Section("Automated Pay Slips (Current Cycle)") {
                    ForEach(vm.payslips) { slip in
                        VStack(alignment: .leading, spacing: 8) {
                            HStack {
                                Text(slip.employeeName).font(.headline)
                                Spacer()
                                Text(slip.slipNumber)
                                    .font(.caption).bold()
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color.blue.opacity(0.1))
                                    .cornerRadius(4)
                            }
                            Text(slip.positionTitle)
                                .font(.subheadline)
                                .foregroundColor(.secondary)
                            
                            Divider()
                            
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("Gross Pay").font(.caption).foregroundColor(.secondary)
                                    Text(String(format: "$%.2f", slip.grossPay)).bold()
                                }
                                Spacer()
                                VStack(alignment: .center) {
                                    let taxTotal = slip.federalTax + slip.stateTax + slip.socialSecurity + slip.medicare
                                    Text("Tax Withholdings").font(.caption).foregroundColor(.secondary)
                                    Text(String(format: "-$%.2f", taxTotal)).foregroundColor(.red)
                                }
                                Spacer()
                                VStack(alignment: .trailing) {
                                    Text("Net Take-Home").font(.caption).foregroundColor(.secondary)
                                    Text(String(format: "$%.2f", slip.netPay)).bold().foregroundColor(.green)
                                }
                            }
                        }
                        .padding(.vertical, 6)
                    }
                }
            }
            .navigationTitle("Payroll & Pay Slips")
            .toolbar {
                Button {
                    vm.generateAutomatedPaySlips()
                } label: {
                    Label("Recalculate", systemImage: "arrow.clockwise")
                }
            }
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Views/DocumentsView.swift',
    language: 'swift',
    content: `//
//  DocumentsView.swift
//  HRPayrollApp
//

import SwiftUI

struct DocumentsView: View {
    @EnvironmentObject var vm: HRPayrollViewModel
    @State private var selectedDocType = 0
    @State private var selectedEmpIndex = 0
    
    let docTypes = ["Offer Letter", "Appointment Letter", "NDA Agreement"]
    
    var currentText: String {
        guard !vm.employees.isEmpty else { return "No employees available." }
        let emp = vm.employees[selectedEmpIndex]
        
        switch selectedDocType {
        case 0:
            return """
            OFFER OF EMPLOYMENT
            Date: \\(Date().formatted(date: .long, time: .omitted))
            
            Dear \\(emp.fullName),
            
            We are pleased to offer you the position of \\(emp.positionTitle) with our \\(emp.department.rawValue) team.
            
            Joining Date: \\(emp.joiningDate.formatted(date: .long, time: .omitted))
            Base Salary: $\\(String(format: "%.2f", emp.baseSalary)) per month
            Probation Period: \\(emp.probationMonths) months
            
            Sincerely,
            Human Resources Management
            """
        case 1:
            return """
            APPOINTMENT LETTER & EMPLOYMENT CONTRACT
            Date: \\(Date().formatted(date: .long, time: .omitted))
            
            Dear \\(emp.fullName),
            
            Management is pleased to formally appoint you as \\(emp.positionTitle).
            
            Effective Date of Joining: \\(emp.joiningDate.formatted(date: .long, time: .omitted))
            Probation Terms: \\(emp.probationMonths) months
            Remuneration: $\\(String(format: "%.2f", emp.baseSalary)) monthly
            
            Authorized Signatory
            Enterprise HR Services
            """
        default:
            return """
            EMPLOYEE NON-DISCLOSURE AGREEMENT (NDA)
            Date: \\(Date().formatted(date: .long, time: .omitted))
            
            Between Enterprise Inc. ("Company") and \\(emp.fullName) ("Employee").
            
            1. Employee agrees to safeguard all proprietary software, algorithms, records, and trade secrets.
            2. Non-solicitation shall remain in effect for 12 months post-employment.
            3. All intellectual property developed belongs solely to Company.
            
            Employee Signature: \\(emp.fullName)
            """
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 14) {
                Picker("Document Type", selection: $selectedDocType) {
                    ForEach(0..<docTypes.count, id: \\.self) { idx in
                        Text(docTypes[idx]).tag(idx)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                
                if !vm.employees.isEmpty {
                    Picker("Select Employee", selection: $selectedEmpIndex) {
                        ForEach(0..<vm.employees.count, id: \\.self) { idx in
                            Text(vm.employees[idx].fullName).tag(idx)
                        }
                    }
                    .padding(.horizontal)
                }
                
                ScrollView {
                    Text(currentText)
                        .font(.system(.body, design: .monospaced))
                        .padding()
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(.secondarySystemBackground))
                        .cornerRadius(12)
                }
                .padding(.horizontal)
                
                ShareLink(item: currentText) {
                    Label("Export / Share Document", systemImage: "square.and.arrow.up")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.blue)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                }
                .padding(.horizontal)
            }
            .navigationTitle("Document Generator")
        }
    }
}
`,
  },
  {
    path: 'HRPayrollApp/Info.plist',
    language: 'xml',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDevelopmentRegion</key>
    <string>en</string>
    <key>CFBundleExecutable</key>
    <string>$(EXECUTABLE_NAME)</string>
    <key>CFBundleIdentifier</key>
    <string>com.hrpayroll.app</string>
    <key>CFBundleInfoDictionaryVersion</key>
    <string>6.0</string>
    <key>CFBundleName</key>
    <string>HRPayrollApp</string>
    <key>CFBundlePackageType</key>
    <string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
    <key>LSRequiresIPhoneOS</key>
    <true/>
    <key>NSCameraUsageDescription</key>
    <string>HRPayroll requires camera access to take employee profile photos.</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>HRPayroll requires photo library access to upload employee photos.</string>
</dict>
</plist>
`,
  },
  {
    path: 'HRPayrollApp.xcodeproj/project.pbxproj',
    language: 'properties',
    content: `// !$*UTF8*$!
{
	archiveVersion = 1;
	classes = {
	};
	objectVersion = 56;
	objects = {
/* Begin PBXBuildFile section */
		1D60589B0D05DD56006BFB54 /* HRPayrollApp.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D60589A0D05DD56006BFB54 /* HRPayrollApp.swift */; };
		1D60589D0D05DD56006BFB54 /* HRModels.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D60589C0D05DD56006BFB54 /* HRModels.swift */; };
		1D60589F0D05DD56006BFB54 /* HRPayrollViewModel.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D60589E0D05DD56006BFB54 /* HRPayrollViewModel.swift */; };
		1D6058A10D05DD56006BFB54 /* ContentView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058A00D05DD56006BFB54 /* ContentView.swift */; };
		1D6058A30D05DD56006BFB54 /* EmployeesView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058A20D05DD56006BFB54 /* EmployeesView.swift */; };
		1D6058A50D05DD56006BFB54 /* PositionsView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058A40D05DD56006BFB54 /* PositionsView.swift */; };
		1D6058A70D05DD56006BFB54 /* HoursView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058A60D05DD56006BFB54 /* HoursView.swift */; };
		1D6058A90D05DD56006BFB54 /* PayrollView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058A80D05DD56006BFB54 /* PayrollView.swift */; };
		1D6058AB0D05DD56006BFB54 /* DocumentsView.swift in Sources */ = {isa = PBXBuildFile; fileRef = 1D6058AA0D05DD56006BFB54 /* DocumentsView.swift */; };
/* End PBXBuildFile section */

/* Begin PBXFileReference section */
		1D6058960D05DD56006BFB54 /* HRPayrollApp.app */ = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = HRPayrollApp.app; sourceTree = BUILT_PRODUCTS_DIR; };
		1D60589A0D05DD56006BFB54 /* HRPayrollApp.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = HRPayrollApp.swift; sourceTree = "<group>"; };
		1D60589C0D05DD56006BFB54 /* HRModels.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Models/HRModels.swift"; sourceTree = "<group>"; };
		1D60589E0D05DD56006BFB54 /* HRPayrollViewModel.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "ViewModels/HRPayrollViewModel.swift"; sourceTree = "<group>"; };
		1D6058A00D05DD56006BFB54 /* ContentView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/ContentView.swift"; sourceTree = "<group>"; };
		1D6058A20D05DD56006BFB54 /* EmployeesView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/EmployeesView.swift"; sourceTree = "<group>"; };
		1D6058A40D05DD56006BFB54 /* PositionsView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/PositionsView.swift"; sourceTree = "<group>"; };
		1D6058A60D05DD56006BFB54 /* HoursView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/HoursView.swift"; sourceTree = "<group>"; };
		1D6058A80D05DD56006BFB54 /* PayrollView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/PayrollView.swift"; sourceTree = "<group>"; };
		1D6058AA0D05DD56006BFB54 /* DocumentsView.swift */ = {isa = PBXFileReference; lastKnownFileType = sourcecode.swift; path = "Views/DocumentsView.swift"; sourceTree = "<group>"; };
		1D6058AC0D05DD56006BFB54 /* Info.plist */ = {isa = PBXFileReference; lastKnownFileType = text.plist.xml; path = Info.plist; sourceTree = "<group>"; };
/* End PBXFileReference section */

/* Begin PBXGroup section */
		29B97314FDCFA39411CA2CEA /* MainGroup */ = {
			isa = PBXGroup;
			children = (
				1D60589A0D05DD56006BFB54 /* HRPayrollApp.swift */,
				1D60589C0D05DD56006BFB54 /* HRModels.swift */,
				1D60589E0D05DD56006BFB54 /* HRPayrollViewModel.swift */,
				1D6058A00D05DD56006BFB54 /* ContentView.swift */,
				1D6058A20D05DD56006BFB54 /* EmployeesView.swift */,
				1D6058A40D05DD56006BFB54 /* PositionsView.swift */,
				1D6058A60D05DD56006BFB54 /* HoursView.swift */,
				1D6058A80D05DD56006BFB54 /* PayrollView.swift */,
				1D6058AA0D05DD56006BFB54 /* DocumentsView.swift */,
				1D6058AC0D05DD56006BFB54 /* Info.plist */,
				1D6058960D05DD56006BFB54 /* HRPayrollApp.app */,
			);
			sourceTree = "<group>";
		};
/* End PBXGroup section */

/* Begin PBXNativeTarget section */
		1D6058950D05DD56006BFB54 /* HRPayrollApp */ = {
			isa = PBXNativeTarget;
			buildConfigurationList = 1D6058B00D05DD56006BFB54 /* Build configuration list for PBXNativeTarget "HRPayrollApp" */;
			buildPhases = (
				1D6058920D05DD56006BFB54 /* Sources */,
			);
			buildRules = (
			);
			dependencies = (
			);
			name = HRPayrollApp;
			productName = HRPayrollApp;
			productReference = 1D6058960D05DD56006BFB54 /* HRPayrollApp.app */;
			productType = "com.apple.product-type.application";
		};
/* End PBXNativeTarget section */

/* Begin PBXProject section */
		29B97313FDCFA39411CA2CEA /* Project object */ = {
			isa = PBXProject;
			attributes = {
				BuildIndependentTargetsInParallel = YES;
				LastSwiftUpdateCheck = 1500;
				LastUpgradeCheck = 1500;
			};
			buildConfigurationList = C01FCF4E08A9545400542C1A /* Build configuration list for PBXProject "HRPayrollApp" */;
			compatibilityVersion = "Xcode 14.0";
			developmentRegion = en;
			hasScannedForEncodings = 0;
			knownRegions = (
				en,
				Base,
			);
			mainGroup = 29B97314FDCFA39411CA2CEA /* MainGroup */;
			productRefGroup = 29B97314FDCFA39411CA2CEA /* MainGroup */;
			projectDirPath = "";
			projectRoot = "";
			targets = (
				1D6058950D05DD56006BFB54 /* HRPayrollApp */,
			);
		};
/* End PBXProject section */

/* Begin PBXSourcesBuildPhase section */
		1D6058920D05DD56006BFB54 /* Sources */ = {
			isa = PBXSourcesBuildPhase;
			buildActionMask = 2147483647;
			files = (
				1D60589B0D05DD56006BFB54 /* HRPayrollApp.swift in Sources */,
				1D60589D0D05DD56006BFB54 /* HRModels.swift in Sources */,
				1D60589F0D05DD56006BFB54 /* HRPayrollViewModel.swift in Sources */,
				1D6058A10D05DD56006BFB54 /* ContentView.swift in Sources */,
				1D6058A30D05DD56006BFB54 /* EmployeesView.swift in Sources */,
				1D6058A50D05DD56006BFB54 /* PositionsView.swift in Sources */,
				1D6058A70D05DD56006BFB54 /* HoursView.swift in Sources */,
				1D6058A90D05DD56006BFB54 /* PayrollView.swift in Sources */,
				1D6058AB0D05DD56006BFB54 /* DocumentsView.swift in Sources */,
			);
			runOnlyForDeploymentPostprocessing = 0;
		};
/* End PBXSourcesBuildPhase section */

/* Begin XCBuildConfiguration section */
		C01FCF4F08A9545400542C1A /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				IPHONEOS_DEPLOYMENT_TARGET = 17.0;
				SDKROOT = iphoneos;
				SWIFT_VERSION = 5.0;
			};
			name = Debug;
		};
		C01FCF5008A9545400542C1A /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ALWAYS_SEARCH_USER_PATHS = NO;
				IPHONEOS_DEPLOYMENT_TARGET = 17.0;
				SDKROOT = iphoneos;
				SWIFT_VERSION = 5.0;
			};
			name = Release;
		};
		1D6058B10D05DD56006BFB54 /* Debug */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CODE_SIGN_STYLE = Automatic;
				INFOPLIST_FILE = HRPayrollApp/Info.plist;
				PRODUCT_BUNDLE_IDENTIFIER = com.hrpayroll.app;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Debug;
		};
		1D6058B20D05DD56006BFB54 /* Release */ = {
			isa = XCBuildConfiguration;
			buildSettings = {
				ASSETCATALOG_COMPILER_APPICON_NAME = AppIcon;
				CODE_SIGN_STYLE = Automatic;
				INFOPLIST_FILE = HRPayrollApp/Info.plist;
				PRODUCT_BUNDLE_IDENTIFIER = com.hrpayroll.app;
				PRODUCT_NAME = "$(TARGET_NAME)";
				SWIFT_VERSION = 5.0;
				TARGETED_DEVICE_FAMILY = "1,2";
			};
			name = Release;
		};
/* End XCBuildConfiguration section */

/* Begin XCConfigurationList section */
		C01FCF4E08A9545400542C1A /* Build configuration list for PBXProject "HRPayrollApp" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				C01FCF4F08A9545400542C1A /* Debug */,
				C01FCF5008A9545400542C1A /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
		1D6058B00D05DD56006BFB54 /* Build configuration list for PBXNativeTarget "HRPayrollApp" */ = {
			isa = XCConfigurationList;
			buildConfigurations = (
				1D6058B10D05DD56006BFB54 /* Debug */,
				1D6058B20D05DD56006BFB54 /* Release */,
			);
			defaultConfigurationIsVisible = 0;
			defaultConfigurationName = Release;
		};
/* End XCConfigurationList section */
	};
	rootObject = 29B97313FDCFA39411CA2CEA /* Project object */;
}
`,
  },
];

export const ANDROID_PROJECT_FILES: ProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    language: 'groovy',
    content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "HRPayrollApp"
include(":app")
`,
  },
  {
    path: 'gradle/libs.versions.toml',
    language: 'properties',
    content: `[versions]
agp = "8.2.2"
kotlin = "1.9.22"
coreKtx = "1.12.0"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.00"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
`,
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    language: 'properties',
    content: `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,
  },
  {
    path: 'build.gradle.kts',
    language: 'groovy',
    content: `// Top-level build file for Android Studio
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`,
  },
  {
    path: 'app/build.gradle.kts',
    language: 'groovy',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.hrpayroll.app"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.hrpayroll.app"
        minSdk = 26
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.8"
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
}
`,
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />

    <application
        android:allowBackup="true"
        android:icon="@android:drawable/sym_def_app_icon"
        android:label="HR Payroll"
        android:roundIcon="@android:drawable/sym_def_app_icon"
        android:supportsRtl="true"
        android:theme="@style/Theme.HRPayroll">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.HRPayroll">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
  },
  {
    path: 'app/src/main/java/com/hrpayroll/app/model/HRModels.kt',
    language: 'kotlin',
    content: `package com.hrpayroll.app.model

import java.util.UUID

enum class Department(val displayName: String) {
    ENGINEERING("Engineering"),
    PRODUCT("Product"),
    DESIGN("Design"),
    HR("Human Resources"),
    FINANCE("Finance"),
    MARKETING("Marketing"),
    OPERATIONS("Operations")
}

data class JobPosition(
    val id: String = UUID.randomUUID().toString(),
    val code: String,
    val title: String,
    val department: Department,
    val minSalary: Double,
    val maxSalary: Double,
    val description: String
)

data class TaxInfo(
    val taxId: String,
    val filingStatus: String,
    val stateWithholdingRate: Double,
    val federalAllowances: Int,
    val preTax401kPercent: Double,
    val monthlyHealthInsurance: Double
)

data class Employee(
    val id: String = UUID.randomUUID().toString(),
    val employeeCode: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val positionTitle: String,
    val department: Department,
    val joiningDate: String, // YYYY-MM-DD
    val probationMonths: Int = 3,
    val baseSalary: Double,
    val hourlyRate: Double,
    val isHourly: Boolean = false,
    val taxInfo: TaxInfo,
    val bankAccount: String
) {
    val fullName: String get() = "$firstName $lastName"
}

data class WorkHourLog(
    val id: String = UUID.randomUUID().toString(),
    val employeeId: String,
    val date: String,
    val regularHours: Double,
    val overtimeHours: Double,
    val holidayHours: Double,
    val isApproved: Boolean = true
)

data class PaySlip(
    val id: String = UUID.randomUUID().toString(),
    val slipNumber: String,
    val employeeName: String,
    val employeeCode: String,
    val positionTitle: String,
    val department: String,
    val grossPay: Double,
    val regularPay: Double,
    val overtimePay: Double,
    val federalTax: Double,
    val stateTax: Double,
    val socialSecurity: Double,
    val medicare: Double,
    val netPay: Double
)
`,
  },
  {
    path: 'app/src/main/java/com/hrpayroll/app/viewmodel/HRViewModel.kt',
    language: 'kotlin',
    content: `package com.hrpayroll.app.viewmodel

import androidx.lifecycle.ViewModel
import com.hrpayroll.app.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.util.UUID

class HRViewModel : ViewModel() {

    private val _employees = MutableStateFlow<List<Employee>>(emptyList())
    val employees: StateFlow<List<Employee>> = _employees.asStateFlow()

    private val _positions = MutableStateFlow<List<JobPosition>>(emptyList())
    val positions: StateFlow<List<JobPosition>> = _positions.asStateFlow()

    private val _hours = MutableStateFlow<List<WorkHourLog>>(emptyList())
    val hours: StateFlow<List<WorkHourLog>> = _hours.asStateFlow()

    private val _payslips = MutableStateFlow<List<PaySlip>>(emptyList())
    val payslips: StateFlow<List<PaySlip>> = _payslips.asStateFlow()

    init {
        loadSeedData()
    }

    private fun loadSeedData() {
        val pos1 = JobPosition(
            code = "ENG-01",
            title = "Android Lead Engineer",
            department = Department.ENGINEERING,
            minSalary = 135000.0,
            maxSalary = 180000.0,
            description = "Lead Jetpack Compose mobile architecture."
        )
        val pos2 = JobPosition(
            code = "HR-01",
            title = "People & Culture Lead",
            department = Department.HR,
            minSalary = 90000.0,
            maxSalary = 120000.0,
            description = "Talent acquisition and benefits management."
        )
        _positions.value = listOf(pos1, pos2)

        val emp1 = Employee(
            employeeCode = "EMP-101",
            firstName = "Elena",
            lastName = "Rostova",
            email = "elena.rostova@enterprise.io",
            phone = "+1 415-555-0182",
            positionTitle = "Android Lead Engineer",
            department = Department.ENGINEERING,
            joiningDate = "2024-03-15",
            probationMonths = 3,
            baseSalary = 11800.0,
            hourlyRate = 74.0,
            isHourly = false,
            taxInfo = TaxInfo(
                taxId = "SSN-***-9921",
                filingStatus = "Single",
                stateWithholdingRate = 5.0,
                federalAllowances = 1,
                preTax401kPercent = 5.0,
                monthlyHealthInsurance = 150.0
            ),
            bankAccount = "Chase Bank (••••4412)"
        )

        val emp2 = Employee(
            employeeCode = "EMP-102",
            firstName = "David",
            lastName = "Kim",
            email = "david.kim@enterprise.io",
            phone = "+1 415-555-0144",
            positionTitle = "People & Culture Lead",
            department = Department.HR,
            joiningDate = "2025-08-01",
            probationMonths = 3,
            baseSalary = 8200.0,
            hourlyRate = 51.0,
            isHourly = false,
            taxInfo = TaxInfo(
                taxId = "SSN-***-3341",
                filingStatus = "Married",
                stateWithholdingRate = 4.5,
                federalAllowances = 2,
                preTax401kPercent = 4.0,
                monthlyHealthInsurance = 120.0
            ),
            bankAccount = "Wells Fargo (••••7823)"
        )

        _employees.value = listOf(emp1, emp2)

        _hours.value = listOf(
            WorkHourLog(employeeId = emp1.id, date = "2026-09-15", regularHours = 40.0, overtimeHours = 6.0, holidayHours = 0.0),
            WorkHourLog(employeeId = emp2.id, date = "2026-09-15", regularHours = 40.0, overtimeHours = 0.0, holidayHours = 0.0)
        )

        recalculatePayroll()
    }

    fun addEmployee(employee: Employee) {
        _employees.value = _employees.value + employee
        recalculatePayroll()
    }

    fun addPosition(position: JobPosition) {
        _positions.value = _positions.value + position
    }

    fun logHours(employeeId: String, reg: Double, ot: Double, hol: Double) {
        val newLog = WorkHourLog(
            employeeId = employeeId,
            date = "2026-09-17",
            regularHours = reg,
            overtimeHours = ot,
            holidayHours = hol,
            isApproved = true
        )
        _hours.value = _hours.value + newLog
        recalculatePayroll()
    }

    fun recalculatePayroll() {
        val slips = _employees.value.mapIndexed { idx, emp ->
            val empLogs = _hours.value.filter { it.employeeId == emp.id && it.isApproved }
            val otHours = empLogs.sumOf { it.overtimeHours }
            val hourlyBase = emp.baseSalary / 160.0
            val otPay = otHours * (hourlyBase * 1.5)
            val gross = emp.baseSalary + otPay

            val ss = gross * 0.062
            val med = gross * 0.0145
            val stateTax = gross * (emp.taxInfo.stateWithholdingRate / 100.0)
            val fedTax = gross * 0.12
            val deductions = ss + med + stateTax + fedTax + emp.taxInfo.monthlyHealthInsurance
            val net = maxOf(0.0, gross - deductions)

            PaySlip(
                slipNumber = "PSL-2026-%04d".format(idx + 1),
                employeeName = emp.fullName,
                employeeCode = emp.employeeCode,
                positionTitle = emp.positionTitle,
                department = emp.department.displayName,
                grossPay = gross,
                regularPay = emp.baseSalary,
                overtimePay = otPay,
                federalTax = fedTax,
                stateTax = stateTax,
                socialSecurity = ss,
                medicare = med,
                netPay = net
            )
        }
        _payslips.value = slips
    }
}
`,
  },
  {
    path: 'app/src/main/java/com/hrpayroll/app/MainActivity.kt',
    language: 'kotlin',
    content: `package com.hrpayroll.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.hrpayroll.app.model.Department
import com.hrpayroll.app.model.Employee
import com.hrpayroll.app.viewmodel.HRViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HRPayrollMainScreen()
                }
            }
        }
    }
}

enum class Screen(val title: String, val icon: ImageVector) {
    DASHBOARD("Dashboard", Icons.Default.Dashboard),
    EMPLOYEES("Staff", Icons.Default.People),
    POSITIONS("Positions", Icons.Default.Work),
    HOURS("Hours", Icons.Default.Schedule),
    PAYROLL("Payroll", Icons.Default.AttachMoney),
    DOCS("Docs", Icons.Default.Description)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HRPayrollMainScreen(vm: HRViewModel = viewModel()) {
    var selectedScreen by remember { mutableStateOf(Screen.DASHBOARD) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("HR Payroll Suite") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                )
            )
        },
        bottomBar = {
            NavigationBar {
                Screen.values().forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = selectedScreen == screen,
                        onClick = { selectedScreen = screen }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding)) {
            when (selectedScreen) {
                Screen.DASHBOARD -> DashboardContent(vm)
                Screen.EMPLOYEES -> EmployeesContent(vm)
                Screen.POSITIONS -> PositionsContent(vm)
                Screen.HOURS -> HoursContent(vm)
                Screen.PAYROLL -> PayrollContent(vm)
                Screen.DOCS -> DocumentsContent(vm)
            }
        }
    }
}

@Composable
fun DashboardContent(vm: HRViewModel) {
    val employees by vm.employees.collectAsState()
    val payslips by vm.payslips.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text("Overview Metrics", style = MaterialTheme.typography.titleLarge)
        }
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Card(modifier = Modifier.weight(1f)) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Active Staff", style = MaterialTheme.typography.labelMedium)
                        Text("\${employees.size}", style = MaterialTheme.typography.headlineMedium)
                    }
                }
                Card(modifier = Modifier.weight(1f)) {
                    Column(Modifier.padding(16.dp)) {
                        val totalPayroll = payslips.sumOf { it.grossPay }
                        Text("Total Payroll", style = MaterialTheme.typography.labelMedium)
                        Text("$%.0f".format(totalPayroll), style = MaterialTheme.typography.headlineMedium)
                    }
                }
            }
        }
        item {
            Spacer(modifier = Modifier.height(8.dp))
            Text("Staff Joining Dates & Tenure", style = MaterialTheme.typography.titleMedium)
        }
        items(employees) { emp ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(emp.fullName, style = MaterialTheme.typography.titleMedium)
                        Text(emp.positionTitle, style = MaterialTheme.typography.bodyMedium)
                        Text("Joined: \${emp.joiningDate}", style = MaterialTheme.typography.bodySmall)
                    }
                    Text(
                        "$%.0f/mo".format(emp.baseSalary),
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

@Composable
fun EmployeesContent(vm: HRViewModel) {
    val employees by vm.employees.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Text("Employee Directory (\${employees.size})", style = MaterialTheme.typography.titleLarge)
        }
        items(employees) { emp ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(emp.fullName, style = MaterialTheme.typography.titleMedium)
                            Text("\${emp.positionTitle} • \${emp.department.displayName}", style = MaterialTheme.typography.bodyMedium)
                            Text("Joining Date: \${emp.joiningDate}", style = MaterialTheme.typography.bodySmall)
                        }
                        Text(emp.employeeCode, style = MaterialTheme.typography.labelSmall)
                    }
                    Spacer(Modifier.height(8.dp))
                    Text("Bank: \${emp.bankAccount}", style = MaterialTheme.typography.bodySmall)
                    Text("Tax ID: \${emp.taxInfo.taxId} (\${emp.taxInfo.filingStatus})", style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}

@Composable
fun PositionsContent(vm: HRViewModel) {
    val positions by vm.positions.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Text("Job Positions", style = MaterialTheme.typography.titleLarge)
        }
        items(positions) { pos ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text(pos.title, style = MaterialTheme.typography.titleMedium)
                    Text("\${pos.department.displayName} (\${pos.code})", style = MaterialTheme.typography.bodyMedium)
                    Text("Band: $%.0fk - $%.0fk".format(pos.minSalary/1000, pos.maxSalary/1000), color = MaterialTheme.colorScheme.primary)
                    Text(pos.description, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}

@Composable
fun HoursContent(vm: HRViewModel) {
    val hours by vm.hours.collectAsState()
    val employees by vm.employees.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Text("Logged Hours & Overtime", style = MaterialTheme.typography.titleLarge)
        }
        items(hours) { log ->
            val emp = employees.find { it.id == log.employeeId }
            Card(modifier = Modifier.fillMaxWidth()) {
                Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(emp?.fullName ?: "Staff", style = MaterialTheme.typography.titleMedium)
                        Text("Regular: \${log.regularHours}h  |  Overtime: \${log.overtimeHours}h", style = MaterialTheme.typography.bodyMedium)
                    }
                    Text(if (log.isApproved) "Approved" else "Pending", color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

@Composable
fun PayrollContent(vm: HRViewModel) {
    val payslips by vm.payslips.collectAsState()

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        item {
            Text("Automated Pay Slips", style = MaterialTheme.typography.titleLarge)
        }
        items(payslips) { slip ->
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Row {
                        Text(slip.employeeName, style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                        Text(slip.slipNumber, style = MaterialTheme.typography.labelSmall)
                    }
                    Text("\${slip.positionTitle} • \${slip.department}", style = MaterialTheme.typography.bodySmall)
                    Spacer(Modifier.height(8.dp))
                    Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                        Text("Gross: $%.2f".format(slip.grossPay))
                        val taxes = slip.federalTax + slip.stateTax + slip.socialSecurity + slip.medicare
                        Text("Tax: -$%.2f".format(taxes), color = MaterialTheme.colorScheme.error)
                        Text("Net: $%.2f".format(slip.netPay), color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }
    }
}

@Composable
fun DocumentsContent(vm: HRViewModel) {
    val employees by vm.employees.collectAsState()
    var selectedIndex by remember { mutableStateOf(0) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Document Generator", style = MaterialTheme.typography.titleLarge)
        Spacer(Modifier.height(8.dp))
        Text("Generates Offer Letters, Appointment Letters, and NDA Papers.")
        Spacer(Modifier.height(12.dp))
        if (employees.isNotEmpty()) {
            val emp = employees.getOrNull(selectedIndex) ?: employees.first()
            Card(modifier = Modifier.fillMaxWidth()) {
                Column(Modifier.padding(16.dp)) {
                    Text("Selected: \${emp.fullName} (\${emp.positionTitle})", style = MaterialTheme.typography.titleMedium)
                    Spacer(Modifier.height(8.dp))
                    Text("• Offer Letter: Ready for joining \${emp.joiningDate}")
                    Text("• Appointment Contract: Ready with probation \${emp.probationMonths} mos")
                    Text("• Non-Disclosure Agreement: Confidentiality & IP ready")
                }
            }
        }
    }
}
`,
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    content: `<resources>
    <string name="app_name">HR Payroll</string>
</resources>
`,
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    language: 'xml',
    content: `<resources>
    <style name="Theme.HRPayroll" parent="android:Theme.Material.Light.NoActionBar">
    </style>
</resources>
`,
  },
];

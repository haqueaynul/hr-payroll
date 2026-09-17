//
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
                                    Text("Tenure: \(emp.tenureFormatted)")
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
            .navigationTitle("Employees (\(vm.employees.count))")
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
    @Environment(\.dismiss) var dismiss
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
                            employeeCode: "EMP-\(vm.employees.count + 101)",
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

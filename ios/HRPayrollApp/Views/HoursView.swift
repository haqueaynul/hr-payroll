//
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
    @Environment(\.dismiss) var dismiss
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
                        ForEach(0..<vm.employees.count, id: \.self) { idx in
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

//
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
            .navigationTitle("Job Positions (\(vm.positions.count))")
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
    @Environment(\.dismiss) var dismiss
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
                            code: code.isEmpty ? "POS-\(vm.positions.count + 1)" : code,
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

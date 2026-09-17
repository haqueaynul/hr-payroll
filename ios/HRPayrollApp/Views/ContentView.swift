//
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
                        MetricCard(title: "Active Staff", value: "\(vm.employees.count)", icon: "person.2", color: .blue)
                        MetricCard(title: "Open Roles", value: "\(vm.positions.count)", icon: "briefcase", color: .purple)
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
                                Text("Joined \(emp.joiningDate.formatted(date: .abbreviated, time: .omitted))")
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

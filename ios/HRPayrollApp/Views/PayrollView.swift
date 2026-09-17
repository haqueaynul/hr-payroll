//
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

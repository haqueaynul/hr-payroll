//
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
            Date: \(Date().formatted(date: .long, time: .omitted))
            
            Dear \(emp.fullName),
            
            We are pleased to offer you the position of \(emp.positionTitle) with our \(emp.department.rawValue) team.
            
            Joining Date: \(emp.joiningDate.formatted(date: .long, time: .omitted))
            Base Salary: $\(String(format: "%.2f", emp.baseSalary)) per month
            Probation Period: \(emp.probationMonths) months
            
            Sincerely,
            Human Resources Management
            """
        case 1:
            return """
            APPOINTMENT LETTER & EMPLOYMENT CONTRACT
            Date: \(Date().formatted(date: .long, time: .omitted))
            
            Dear \(emp.fullName),
            
            Management is pleased to formally appoint you as \(emp.positionTitle).
            
            Effective Date of Joining: \(emp.joiningDate.formatted(date: .long, time: .omitted))
            Probation Terms: \(emp.probationMonths) months
            Remuneration: $\(String(format: "%.2f", emp.baseSalary)) monthly
            
            Authorized Signatory
            Enterprise HR Services
            """
        default:
            return """
            EMPLOYEE NON-DISCLOSURE AGREEMENT (NDA)
            Date: \(Date().formatted(date: .long, time: .omitted))
            
            Between Enterprise Inc. ("Company") and \(emp.fullName) ("Employee").
            
            1. Employee agrees to safeguard all proprietary software, algorithms, records, and trade secrets.
            2. Non-solicitation shall remain in effect for 12 months post-employment.
            3. All intellectual property developed belongs solely to Company.
            
            Employee Signature: \(emp.fullName)
            """
        }
    }
    
    var body: some View {
        NavigationView {
            VStack(spacing: 14) {
                Picker("Document Type", selection: $selectedDocType) {
                    ForEach(0..<docTypes.count, id: \.self) { idx in
                        Text(docTypes[idx]).tag(idx)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                
                if !vm.employees.isEmpty {
                    Picker("Select Employee", selection: $selectedEmpIndex) {
                        ForEach(0..<vm.employees.count, id: \.self) { idx in
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

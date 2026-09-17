//
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

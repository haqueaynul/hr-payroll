//
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
        "\(firstName) \(lastName)"
    }
    
    public var tenureFormatted: String {
        let diff = Calendar.current.dateComponents([.year, .month], from: joiningDate, to: Date())
        let years = diff.year ?? 0
        let months = diff.month ?? 0
        if years > 0 {
            return "\(years)y \(months)m"
        }
        return "\(months) months"
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

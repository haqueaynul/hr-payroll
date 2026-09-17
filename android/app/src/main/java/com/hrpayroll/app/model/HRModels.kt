package com.hrpayroll.app.model

import java.time.LocalDate
import java.time.Period
import java.time.temporal.ChronoUnit
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
    val level: String = "Senior",
    val employmentType: String = "Full-time",
    val minSalary: Double,
    val maxSalary: Double,
    val description: String,
    val status: String = "active"
)

data class TaxInfo(
    val taxId: String,
    val filingStatus: String, // "Single", "Married"
    val stateWithholdingRate: Double, // percentage, e.g. 5.0
    val federalAllowances: Int = 1,
    val preTax401kPercent: Double = 4.0,
    val monthlyHealthInsurance: Double = 150.0
)

data class Employee(
    val id: String = UUID.randomUUID().toString(),
    val employeeCode: String,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val photoUrl: String? = null, // Photo avatar or image URI
    val positionTitle: String,
    val department: Department,
    val joiningDate: String, // YYYY-MM-DD
    val probationMonths: Int = 3,
    val baseSalary: Double,
    val hourlyRate: Double = 0.0,
    val isHourly: Boolean = false,
    val taxInfo: TaxInfo,
    val bankAccount: String
) {
    val fullName: String get() = "$firstName $lastName"

    // Calculates tenure from joining date
    fun getTenureDisplay(): String {
        return try {
            val join = LocalDate.parse(joiningDate)
            val now = LocalDate.now()
            val period = Period.between(join, now)
            when {
                period.years > 0 -> "${period.years}y ${period.months}m"
                period.months > 0 -> "${period.months}m ${period.days}d"
                else -> "${period.days} days"
            }
        } catch (e: Exception) {
            "Active"
        }
    }

    // Calculates probation status
    fun getProbationStatus(): String {
        return try {
            val join = LocalDate.parse(joiningDate)
            val probationEnd = join.plusMonths(probationMonths.toLong())
            val now = LocalDate.now()
            if (now.isBefore(probationEnd)) {
                val daysLeft = ChronoUnit.DAYS.between(now, probationEnd)
                "Probation ($daysLeft d left)"
            } else {
                "Confirmed Staff"
            }
        } catch (e: Exception) {
            "Confirmed"
        }
    }
}

data class WorkHourLog(
    val id: String = UUID.randomUUID().toString(),
    val employeeId: String,
    val employeeName: String,
    val date: String,
    val regularHours: Double,
    val overtimeHours: Double = 0.0,
    val holidayHours: Double = 0.0,
    val isApproved: Boolean = true,
    val notes: String = ""
)

data class PaySlip(
    val id: String = UUID.randomUUID().toString(),
    val slipNumber: String,
    val employeeId: String,
    val employeeName: String,
    val employeeCode: String,
    val positionTitle: String,
    val department: String,
    val payDate: String,
    val basePay: Double,
    val regularHoursWorked: Double,
    val regularPay: Double,
    val overtimeHoursWorked: Double,
    val overtimePay: Double,
    val holidayHoursWorked: Double,
    val holidayPay: Double,
    val allowances: Double,
    val grossPay: Double,
    val federalTax: Double,
    val stateTax: Double,
    val socialSecurity: Double,
    val medicare: Double,
    val preTax401k: Double,
    val healthInsurance: Double,
    val totalDeductions: Double,
    val netPay: Double,
    val bankSummary: String
)

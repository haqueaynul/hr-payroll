package com.hrpayroll.app.viewmodel

import androidx.lifecycle.ViewModel
import com.hrpayroll.app.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.time.LocalDate
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
        loadInitialData()
    }

    private fun loadInitialData() {
        // Seed Positions
        val p1 = JobPosition(
            code = "ENG-SR-01",
            title = "Senior Full-Stack Engineer",
            department = Department.ENGINEERING,
            level = "Senior",
            employmentType = "Full-time",
            minSalary = 140000.0,
            maxSalary = 185000.0,
            description = "Lead high-scale distributed web and mobile application architectures."
        )
        val p2 = JobPosition(
            code = "PROD-LD-02",
            title = "Principal Product Manager",
            department = Department.PRODUCT,
            level = "Lead",
            employmentType = "Full-time",
            minSalary = 155000.0,
            maxSalary = 195000.0,
            description = "Own enterprise product vision, user analytics, and sprint roadmaps."
        )
        val p3 = JobPosition(
            code = "DES-STF-03",
            title = "Staff Product Designer",
            department = Department.DESIGN,
            level = "Lead",
            employmentType = "Full-time",
            minSalary = 130000.0,
            maxSalary = 165000.0,
            description = "Lead multi-platform design systems for mobile and web."
        )
        val p4 = JobPosition(
            code = "HR-DIR-04",
            title = "People Operations Manager",
            department = Department.HR,
            level = "Director",
            employmentType = "Full-time",
            minSalary = 110000.0,
            maxSalary = 145000.0,
            description = "Oversee benefits, payroll execution, and employee engagement."
        )
        _positions.value = listOf(p1, p2, p3, p4)

        // Seed Employees with photos, joining dates, salary, and bank/tax info
        val emp1 = Employee(
            employeeCode = "EMP-1001",
            firstName = "Marcus",
            lastName = "Vance",
            email = "marcus.vance@apexglobal.tech",
            phone = "+1 (415) 555-0192",
            photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            positionTitle = "Senior Full-Stack Engineer",
            department = Department.ENGINEERING,
            joiningDate = "2023-03-15",
            probationMonths = 3,
            baseSalary = 14500.0, // Monthly
            hourlyRate = 90.0,
            isHourly = false,
            taxInfo = TaxInfo(
                taxId = "***-**-4829",
                filingStatus = "Single",
                stateWithholdingRate = 5.0,
                federalAllowances = 1,
                preTax401kPercent = 6.0,
                monthlyHealthInsurance = 150.0
            ),
            bankAccount = "Silicon Valley Bank (••••4829)"
        )

        val emp2 = Employee(
            employeeCode = "EMP-1002",
            firstName = "Elena",
            lastName = "Rostova",
            email = "elena.rostova@apexglobal.tech",
            phone = "+1 (415) 555-0144",
            photoUrl = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
            positionTitle = "Principal Product Manager",
            department = Department.PRODUCT,
            joiningDate = "2022-08-01",
            probationMonths = 3,
            baseSalary = 15000.0,
            hourlyRate = 94.0,
            isHourly = false,
            taxInfo = TaxInfo(
                taxId = "***-**-1092",
                filingStatus = "Married",
                stateWithholdingRate = 4.5,
                federalAllowances = 2,
                preTax401kPercent = 8.0,
                monthlyHealthInsurance = 180.0
            ),
            bankAccount = "JPMorgan Chase (••••1092)"
        )

        val emp3 = Employee(
            employeeCode = "EMP-1003",
            firstName = "Aria",
            lastName = "Thorne",
            email = "aria.thorne@apexglobal.tech",
            phone = "+1 (415) 555-0188",
            photoUrl = "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
            positionTitle = "Staff Product Designer",
            department = Department.DESIGN,
            joiningDate = "2024-05-20",
            probationMonths = 3,
            baseSalary = 11500.0,
            hourlyRate = 72.0,
            isHourly = false,
            taxInfo = TaxInfo(
                taxId = "***-**-7821",
                filingStatus = "Single",
                stateWithholdingRate = 4.8,
                federalAllowances = 1,
                preTax401kPercent = 5.0,
                monthlyHealthInsurance = 140.0
            ),
            bankAccount = "Wells Fargo (••••7821)"
        )

        _employees.value = listOf(emp1, emp2, emp3)

        // Seed Work Hours
        _hours.value = listOf(
            WorkHourLog(
                employeeId = emp1.id,
                employeeName = emp1.fullName,
                date = "2026-09-15",
                regularHours = 80.0,
                overtimeHours = 6.5,
                holidayHours = 0.0,
                notes = "Sprint 42 release & production monitoring"
            ),
            WorkHourLog(
                employeeId = emp2.id,
                employeeName = emp2.fullName,
                date = "2026-09-15",
                regularHours = 80.0,
                overtimeHours = 0.0,
                holidayHours = 0.0,
                notes = "Roadmap grooming"
            ),
            WorkHourLog(
                employeeId = emp3.id,
                employeeName = emp3.fullName,
                date = "2026-09-15",
                regularHours = 80.0,
                overtimeHours = 0.0,
                holidayHours = 8.0,
                notes = "Holiday coverage for design sprints"
            )
        )

        generateAutomatedPaySlips()
    }

    // --- EMPLOYEE MANIPULATION ---
    fun addEmployee(employee: Employee) {
        _employees.value = _employees.value + employee
        generateAutomatedPaySlips()
    }

    fun updateEmployee(updated: Employee) {
        _employees.value = _employees.value.map { if (it.id == updated.id) updated else it }
        generateAutomatedPaySlips()
    }

    fun deleteEmployee(employeeId: String) {
        _employees.value = _employees.value.filter { it.id != employeeId }
        _hours.value = _hours.value.filter { it.employeeId != employeeId }
        _payslips.value = _payslips.value.filter { it.employeeId != employeeId }
    }

    fun updateEmployeePhoto(employeeId: String, newPhotoUrl: String) {
        _employees.value = _employees.value.map {
            if (it.id == employeeId) it.copy(photoUrl = newPhotoUrl) else it
        }
    }

    // --- JOB POSITION MANIPULATION ---
    fun addPosition(position: JobPosition) {
        _positions.value = _positions.value + position
    }

    fun updatePosition(updated: JobPosition) {
        _positions.value = _positions.value.map { if (it.id == updated.id) updated else it }
    }

    fun deletePosition(positionId: String) {
        _positions.value = _positions.value.filter { it.id != positionId }
    }

    // --- HOURS TRACKING ---
    fun logHours(employeeId: String, regHours: Double, otHours: Double, holHours: Double, notes: String) {
        val emp = _employees.value.find { it.id == employeeId } ?: return
        val log = WorkHourLog(
            employeeId = employeeId,
            employeeName = emp.fullName,
            date = LocalDate.now().toString(),
            regularHours = regHours,
            overtimeHours = otHours,
            holidayHours = holHours,
            isApproved = true,
            notes = notes
        )
        _hours.value = _hours.value + log
        generateAutomatedPaySlips()
    }

    // --- AUTOMATED PAY SLIP GENERATION WITH TAX WITHHOLDINGS ---
    fun generateAutomatedPaySlips() {
        val slips = _employees.value.mapIndexed { idx, emp ->
            val empLogs = _hours.value.filter { it.employeeId == emp.id && it.isApproved }
            val regHours = if (empLogs.isNotEmpty()) empLogs.sumOf { it.regularHours } else 160.0
            val otHours = empLogs.sumOf { it.overtimeHours }
            val holHours = empLogs.sumOf { it.holidayHours }

            val hourlyBase = if (emp.isHourly) emp.hourlyRate else (emp.baseSalary / 160.0)
            val regPay = if (emp.isHourly) regHours * emp.hourlyRate else emp.baseSalary
            val otPay = otHours * (hourlyBase * 1.5)
            val holPay = holHours * (hourlyBase * 2.0)
            val allowances = 150.0 // Standard monthly allowance
            val grossPay = regPay + otPay + holPay + allowances

            // Pre-tax deductions
            val preTax401k = grossPay * (emp.taxInfo.preTax401kPercent / 100.0)
            val healthInsurance = emp.taxInfo.monthlyHealthInsurance
            val taxableGross = maxOf(0.0, grossPay - preTax401k - healthInsurance)

            // Tax Withholdings
            // Progressive Federal Income Tax approximation
            val federalTax = when {
                taxableGross > 15000 -> taxableGross * 0.22
                taxableGross > 8000 -> taxableGross * 0.16
                taxableGross > 4000 -> taxableGross * 0.12
                else -> taxableGross * 0.10
            }

            val stateTax = taxableGross * (emp.taxInfo.stateWithholdingRate / 100.0)
            val socialSecurity = grossPay * 0.062 // 6.2%
            val medicare = grossPay * 0.0145 // 1.45%
            val totalDeductions = federalTax + stateTax + socialSecurity + medicare + preTax401k + healthInsurance
            val netPay = maxOf(0.0, grossPay - totalDeductions)

            val slipNumber = "PSL-202609-%04d".format(idx + 1)

            PaySlip(
                slipNumber = slipNumber,
                employeeId = emp.id,
                employeeName = emp.fullName,
                employeeCode = emp.employeeCode,
                positionTitle = emp.positionTitle,
                department = emp.department.displayName,
                payDate = LocalDate.now().toString(),
                basePay = emp.baseSalary,
                regularHoursWorked = regHours,
                regularPay = regPay,
                overtimeHoursWorked = otHours,
                overtimePay = otPay,
                holidayHoursWorked = holHours,
                holidayPay = holPay,
                allowances = allowances,
                grossPay = grossPay,
                federalTax = federalTax,
                stateTax = stateTax,
                socialSecurity = socialSecurity,
                medicare = medicare,
                preTax401k = preTax401k,
                healthInsurance = healthInsurance,
                totalDeductions = totalDeductions,
                netPay = netPay,
                bankSummary = emp.bankAccount
            )
        }
        _payslips.value = slips
    }

    // --- DOCUMENT GENERATORS ---
    fun generateOfferLetter(employee: Employee): String {
        return """
        APEX GLOBAL TECHNOLOGIES INC.
        500 Howard Street, Suite 800, San Francisco, CA 94105
        
        CONFIDENTIAL OFFER OF EMPLOYMENT
        Date: ${LocalDate.now()}
        
        Dear ${employee.fullName},
        
        We are thrilled to extend an official offer of employment for the position of ${employee.positionTitle} with our ${employee.department.displayName} department.
        
        1. POSITION & COMMENCEMENT
        Your joining date will be effective on ${employee.joiningDate}. You will report directly to the Head of ${employee.department.displayName}.
        
        2. COMPENSATION & PAYROLL
        Your monthly base salary will be $${String.format("%,.2f", employee.baseSalary)} ($${String.format("%,.0f", employee.baseSalary * 12)} annualized). Payroll is disbursed monthly via Direct Deposit.
        
        3. PROBATION PERIOD
        This engagement includes a standard ${employee.probationMonths}-month probation period, concluding with a comprehensive performance evaluation.
        
        4. BENEFITS & WITHHOLDING
        You are eligible for comprehensive medical, dental, vision coverage, and 401(k) pre-tax retirement plan contributions. Statutory federal and state tax withholdings will be deducted in accordance with applicable tax regulations.
        
        Please sign and return this offer prior to your start date.
        
        Warm regards,
        Victoria Sterling, Chief People Officer
        Apex Global Technologies Inc.
        """.trimIndent()
    }

    fun generateAppointmentLetter(employee: Employee): String {
        return """
        APEX GLOBAL TECHNOLOGIES INC.
        500 Howard Street, Suite 800, San Francisco, CA 94105
        
        FORMAL APPOINTMENT LETTER & EMPLOYMENT CONTRACT
        Date: ${LocalDate.now()}
        
        To: ${employee.fullName} (${employee.employeeCode})
        Address on Record: San Francisco, CA
        
        Dear ${employee.fullName},
        
        Following the mutual acceptance of our offer, Apex Global Technologies Inc. is pleased to formally appoint you as ${employee.positionTitle} within the ${employee.department.displayName} team, effective ${employee.joiningDate}.
        
        TERMS OF APPOINTMENT:
        - Employee Identification: ${employee.employeeCode}
        - Job Title: ${employee.positionTitle}
        - Base Remuneration: $${String.format("%,.2f", employee.baseSalary)} per month
        - Standard Working Hours: 40 hours per week (Overtime compensated at 1.5x)
        - Direct Deposit Account: ${employee.bankAccount}
        
        STATUTORY COMPLIANCE:
        All compensation is subject to statutory payroll tax withholdings including Federal Income Tax, California State Tax, Social Security (6.2%), and Medicare (1.45%).
        
        We welcome you aboard and look forward to your impactful contributions.
        
        Authorized Signatory:
        Executive Committee, Apex Global Technologies Inc.
        """.trimIndent()
    }

    fun generateNDAPaper(employee: Employee): String {
        return """
        MUTUAL EMPLOYEE NON-DISCLOSURE & PROPRIETARY RIGHTS AGREEMENT
        
        This Non-Disclosure Agreement ("Agreement") is entered into as of ${employee.joiningDate} by and between Apex Global Technologies Inc. ("Company") and ${employee.fullName} ("Employee", ID: ${employee.employeeCode}).
        
        1. PROPRIETARY & CONFIDENTIAL INFORMATION
        Employee acknowledges that during employment as ${employee.positionTitle}, they will have access to confidential source code, customer accounts, business roadmaps, financial balances, and employee records.
        
        2. NON-DISCLOSURE COVENANTS
        Employee agrees to maintain strict confidentiality of all Proprietary Information and shall not copy, disclose, or distribute such data outside Company authorization.
        
        3. INTELLECTUAL PROPERTY ASSIGNMENT
        All inventions, codebases, designs, algorithms, and documentation authored by Employee during employment belong exclusively to the Company.
        
        4. SURVIVAL
        The obligations of confidentiality herein shall survive the termination or expiration of Employee's employment for a period of five (5) years.
        
        IN WITNESS WHEREOF, the parties execute this Agreement:
        
        Company Representative: Victoria Sterling, CPO
        Employee: ${employee.fullName}
        Date: ${LocalDate.now()}
        """.trimIndent()
    }
}

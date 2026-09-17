package com.hrpayroll.app

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.lifecycle.viewmodel.compose.viewModel
import com.hrpayroll.app.model.*
import com.hrpayroll.app.viewmodel.HRViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF4F46E5),
                    primaryContainer = Color(0xFFEEF2FF),
                    onPrimaryContainer = Color(0xFF312E81),
                    secondary = Color(0xFF0284C7),
                    surface = Color(0xFFFFFFFF),
                    background = Color(0xFFF8FAFC)
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    HRPayrollMainScreen()
                }
            }
        }
    }
}

enum class Screen(val title: String, val icon: ImageVector) {
    DASHBOARD("Dashboard", Icons.Default.Dashboard),
    EMPLOYEES("Staff", Icons.Default.People),
    POSITIONS("Positions", Icons.Default.Work),
    HOURS("Hours", Icons.Default.Schedule),
    PAYROLL("Pay Slips", Icons.Default.ReceiptLong),
    DOCS("Documents", Icons.Default.Description)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HRPayrollMainScreen(vm: HRViewModel = viewModel()) {
    var selectedScreen by remember { mutableStateOf(Screen.DASHBOARD) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("ApexHR Enterprise", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Text("Payroll & Native Android Suite", fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primaryContainer,
                    titleContentColor = MaterialTheme.colorScheme.onPrimaryContainer
                ),
                actions = {
                    IconButton(onClick = { vm.generateAutomatedPaySlips() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Recalculate Payroll")
                    }
                }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Color.White,
                tonalElevation = 8.dp
            ) {
                Screen.values().forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title, fontSize = 11.sp) },
                        selected = selectedScreen == screen,
                        onClick = { selectedScreen = screen }
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(modifier = Modifier.padding(innerPadding).fillMaxSize()) {
            when (selectedScreen) {
                Screen.DASHBOARD -> DashboardContent(vm, onNavigate = { selectedScreen = it })
                Screen.EMPLOYEES -> EmployeesContent(vm)
                Screen.POSITIONS -> PositionsContent(vm)
                Screen.HOURS -> HoursContent(vm)
                Screen.PAYROLL -> PayrollContent(vm)
                Screen.DOCS -> DocumentsContent(vm)
            }
        }
    }
}

// --- 1. DASHBOARD CONTENT ---
@Composable
fun DashboardContent(vm: HRViewModel, onNavigate: (Screen) -> Unit) {
    val employees by vm.employees.collectAsState()
    val positions by vm.positions.collectAsState()
    val payslips by vm.payslips.collectAsState()
    val totalPayroll = payslips.sumOf { it.grossPay }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Text("Executive Summary", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        }

        item {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Active Staff", style = MaterialTheme.typography.labelMedium, color = Color.Gray)
                        Spacer(Modifier.height(4.dp))
                        Text("${employees.size}", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)
                        Text("${positions.size} Open/Active Positions", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("Monthly Payroll", style = MaterialTheme.typography.labelMedium, color = Color.Gray)
                        Spacer(Modifier.height(4.dp))
                        Text("$${String.format("%,.0f", totalPayroll)}", style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold, color = Color(0xFF059669))
                        Text("Automated Pay Slips Ready", fontSize = 11.sp, color = Color.Gray)
                    }
                }
            }
        }

        item {
            Text("Staff Joining Dates & Seniority", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
        }

        items(employees) { emp ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Employee Avatar Badge
                    Box(
                        modifier = Modifier.size(44.dp).clip(CircleShape).background(Color(0xFFE0E7FF)),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "${emp.firstName.take(1)}${emp.lastName.take(1)}",
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4338CA)
                        )
                    }

                    Spacer(Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(emp.fullName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("${emp.positionTitle} • ${emp.department.displayName}", fontSize = 12.sp, color = Color.Gray)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("Joined ${emp.joiningDate}", fontSize = 11.sp, color = Color.DarkGray)
                            Text(" • Tenure: ${emp.getTenureDisplay()}", fontSize = 11.sp, color = Color(0xFF4F46E5), fontWeight = FontWeight.SemiBold)
                        }
                    }

                    SuggestionChip(
                        onClick = {},
                        label = { Text(emp.getProbationStatus(), fontSize = 10.sp) }
                    )
                }
            }
        }
    }
}

// --- 2. EMPLOYEES & PHOTO SAVING CONTENT ---
@Composable
fun EmployeesContent(vm: HRViewModel) {
    val employees by vm.employees.collectAsState()
    val positions by vm.positions.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }
    var editingEmployee by remember { mutableStateOf<Employee?>(null) }
    var photoEmployee by remember { mutableStateOf<Employee?>(null) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Employee")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Employee Directory (${employees.size})", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                }
            }

            items(employees) { emp ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            // Photo / Avatar with click to change photo
                            Box(
                                modifier = Modifier
                                    .size(50.dp)
                                    .clip(CircleShape)
                                    .background(Color(0xFFE0E7FF))
                                    .clickable { photoEmployee = emp },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    "${emp.firstName.take(1)}${emp.lastName.take(1)}",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF3730A3)
                                )
                            }

                            Spacer(Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(emp.fullName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                    Spacer(Modifier.width(6.dp))
                                    Text("(${emp.employeeCode})", fontSize = 12.sp, color = Color.Gray)
                                }
                                Text("${emp.positionTitle} • ${emp.department.displayName}", fontSize = 12.sp, color = Color.Gray)
                                Text("Joined: ${emp.joiningDate} • Tenure: ${emp.getTenureDisplay()}", fontSize = 11.sp, color = Color(0xFF4F46E5))
                            }

                            IconButton(onClick = { editingEmployee = emp }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit", tint = Color.Gray)
                            }
                            IconButton(onClick = { vm.deleteEmployee(emp.id) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444))
                            }
                        }

                        Divider(Modifier.padding(vertical = 10.dp), color = Color(0xFFF1F5F9))

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text("Monthly Salary", fontSize = 11.sp, color = Color.Gray)
                                Text("$${String.format("%,.2f", emp.baseSalary)}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }
                            Column {
                                Text("Tax Withholding", fontSize = 11.sp, color = Color.Gray)
                                Text("State ${emp.taxInfo.stateWithholdingRate}% • ${emp.taxInfo.filingStatus}", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                            }
                            Column {
                                Text("Probation Status", fontSize = 11.sp, color = Color.Gray)
                                Text(emp.getProbationStatus(), fontSize = 12.sp, color = Color(0xFF059669), fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(Modifier.height(8.dp))
                        Text("Direct Deposit: ${emp.bankAccount}", fontSize = 11.sp, color = Color.DarkGray)
                    }
                }
            }
        }
    }

    // Add / Edit Dialog
    if (showAddDialog || editingEmployee != null) {
        EmployeeFormDialog(
            existing = editingEmployee,
            positions = positions,
            onDismiss = {
                showAddDialog = false
                editingEmployee = null
            },
            onSave = { emp ->
                if (editingEmployee != null) {
                    vm.updateEmployee(emp)
                } else {
                    vm.addEmployee(emp)
                }
                showAddDialog = false
                editingEmployee = null
            }
        )
    }

    // Photo selection dialog
    if (photoEmployee != null) {
        PhotoSelectionDialog(
            employee = photoEmployee!!,
            onDismiss = { photoEmployee = null },
            onSelectPhoto = { url ->
                vm.updateEmployeePhoto(photoEmployee!!.id, url)
                photoEmployee = null
            }
        )
    }
}

// --- 3. JOB POSITION MANIPULATION CONTENT ---
@Composable
fun PositionsContent(vm: HRViewModel) {
    val positions by vm.positions.collectAsState()
    val employees by vm.employees.collectAsState()
    var showAddDialog by remember { mutableStateOf(false) }
    var editingPosition by remember { mutableStateOf<JobPosition?>(null) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showAddDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Position")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text("Job Positions & Salary Bands (${positions.size})", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
            }

            items(positions) { pos ->
                val count = employees.count { it.positionTitle.equals(pos.title, ignoreCase = true) }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(pos.title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                                Text("${pos.department.displayName} • ${pos.code} • ${pos.level}", fontSize = 12.sp, color = Color.Gray)
                            }
                            IconButton(onClick = { editingPosition = pos }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit", tint = Color.Gray)
                            }
                            IconButton(onClick = { vm.deletePosition(pos.id) }) {
                                Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color(0xFFEF4444))
                            }
                        }

                        Spacer(Modifier.height(6.dp))
                        Text(pos.description, fontSize = 12.sp, color = Color.DarkGray)

                        Spacer(Modifier.height(10.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                "Salary Band: $${String.format("%,.0f", pos.minSalary)} - $${String.format("%,.0f", pos.maxSalary)}/yr",
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold,
                                fontSize = 13.sp
                            )
                            SuggestionChip(onClick = {}, label = { Text("$count Staff Assigned", fontSize = 11.sp) })
                        }
                    }
                }
            }
        }
    }

    if (showAddDialog || editingPosition != null) {
        PositionFormDialog(
            existing = editingPosition,
            onDismiss = {
                showAddDialog = false
                editingPosition = null
            },
            onSave = { pos ->
                if (editingPosition != null) {
                    vm.updatePosition(pos)
                } else {
                    vm.addPosition(pos)
                }
                showAddDialog = false
                editingPosition = null
            }
        )
    }
}

// --- 4. HOURS & OVERTIME TRACKER CONTENT ---
@Composable
fun HoursContent(vm: HRViewModel) {
    val hours by vm.hours.collectAsState()
    val employees by vm.employees.collectAsState()
    var showLogDialog by remember { mutableStateOf(false) }

    Scaffold(
        floatingActionButton = {
            FloatingActionButton(
                onClick = { showLogDialog = true },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.White
            ) {
                Icon(Icons.Default.Add, contentDescription = "Log Work Hours")
            }
        }
    ) { padding ->
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Text("Employee Timesheets & Overtime", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                Text("Overtime paid at 1.5x, holiday work at 2.0x base rate.", fontSize = 12.sp, color = Color.Gray)
            }

            items(hours) { log ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                ) {
                    Column(Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(log.employeeName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                Text("Date logged: ${log.date}", fontSize = 11.sp, color = Color.Gray)
                            }
                            SuggestionChip(
                                onClick = {},
                                label = { Text(if (log.isApproved) "Approved" else "Pending Review", fontSize = 10.sp) }
                            )
                        }

                        Spacer(Modifier.height(8.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Regular: ${log.regularHours}h", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            Text("Overtime (1.5x): ${log.overtimeHours}h", color = Color(0xFFD97706), fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                            Text("Holiday (2.0x): ${log.holidayHours}h", color = Color(0xFFDC2626), fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        }

                        if (log.notes.isNotEmpty()) {
                            Spacer(Modifier.height(6.dp))
                            Text("Notes: ${log.notes}", fontSize = 11.sp, color = Color.DarkGray)
                        }
                    }
                }
            }
        }
    }

    if (showLogDialog) {
        LogHoursDialog(
            employees = employees,
            onDismiss = { showLogDialog = false },
            onSave = { empId, reg, ot, hol, notes ->
                vm.logHours(empId, reg, ot, hol, notes)
                showLogDialog = false
            }
        )
    }
}

// --- 5. AUTOMATED PAY SLIPS & TAX WITHHOLDINGS CONTENT ---
@Composable
fun PayrollContent(vm: HRViewModel) {
    val payslips by vm.payslips.collectAsState()
    var selectedSlip by remember { mutableStateOf<PaySlip?>(null) }

    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Automated Pay Slips", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                    Text("Calculates statutory tax withholdings and net pay.", fontSize = 12.sp, color = Color.Gray)
                }
                Button(onClick = { vm.generateAutomatedPaySlips() }) {
                    Text("Re-Run Batch", fontSize = 12.sp)
                }
            }
        }

        items(payslips) { slip ->
            Card(
                modifier = Modifier.fillMaxWidth().clickable { selectedSlip = slip },
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(slip.employeeName, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text("${slip.positionTitle} • ${slip.department}", fontSize = 12.sp, color = Color.Gray)
                        }
                        Text(slip.slipNumber, fontWeight = FontWeight.SemiBold, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                    }

                    Spacer(Modifier.height(10.dp))
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Column {
                            Text("Total Gross", fontSize = 11.sp, color = Color.Gray)
                            Text("$${String.format("%,.2f", slip.grossPay)}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                        Column {
                            Text("Taxes & Deductions", fontSize = 11.sp, color = Color.Gray)
                            Text("-$${String.format("%,.2f", slip.totalDeductions)}", color = Color(0xFFDC2626), fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        }
                        Column {
                            Text("Net Take-Home", fontSize = 11.sp, color = Color.Gray)
                            Text("$${String.format("%,.2f", slip.netPay)}", color = Color(0xFF059669), fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }

                    Spacer(Modifier.height(8.dp))
                    Text("Tap to view full itemized breakdown statement", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }

    if (selectedSlip != null) {
        PaySlipDetailDialog(slip = selectedSlip!!, onDismiss = { selectedSlip = null })
    }
}

// --- 6. DOCUMENT GENERATOR CONTENT (Offer, Appointment, NDA) ---
@Composable
fun DocumentsContent(vm: HRViewModel) {
    val employees by vm.employees.collectAsState()
    var selectedEmpIndex by remember { mutableStateOf(0) }
    var selectedDocType by remember { mutableStateOf(0) } // 0 = Offer, 1 = Appointment, 2 = NDA
    val clipboardManager = LocalClipboardManager.current
    val context = LocalContext.current

    val currentEmployee = employees.getOrNull(selectedEmpIndex)
    val docText = remember(selectedEmpIndex, selectedDocType, currentEmployee) {
        if (currentEmployee == null) "No employee selected."
        else when (selectedDocType) {
            0 -> vm.generateOfferLetter(currentEmployee)
            1 -> vm.generateAppointmentLetter(currentEmployee)
            else -> vm.generateNDAPaper(currentEmployee)
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Document Generator", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        Text("Generates official Offer Letters, Appointment Letters, and NDA Papers.", fontSize = 12.sp, color = Color.Gray)

        Spacer(Modifier.height(12.dp))

        // Document Type Selector Chips
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            FilterChip(
                selected = selectedDocType == 0,
                onClick = { selectedDocType = 0 },
                label = { Text("Offer Letter") }
            )
            FilterChip(
                selected = selectedDocType == 1,
                onClick = { selectedDocType = 1 },
                label = { Text("Appointment") }
            )
            FilterChip(
                selected = selectedDocType == 2,
                onClick = { selectedDocType = 2 },
                label = { Text("NDA Agreement") }
            )
        }

        Spacer(Modifier.height(10.dp))

        // Employee Selection Dropdown / Horizontal list
        Text("Select Employee for Document Generation:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
        Spacer(Modifier.height(6.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            employees.forEachIndexed { index, emp ->
                FilterChip(
                    selected = selectedEmpIndex == index,
                    onClick = { selectedEmpIndex = index },
                    label = { Text(emp.firstName) }
                )
            }
        }

        Spacer(Modifier.height(12.dp))

        // Document Preview Area
        Card(
            modifier = Modifier.weight(1f).fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            LazyColumn(modifier = Modifier.padding(16.dp)) {
                item {
                    Text(
                        text = docText,
                        fontFamily = FontFamily.Monospace,
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
            OutlinedButton(
                modifier = Modifier.weight(1f),
                onClick = {
                    clipboardManager.setText(AnnotatedString(docText))
                    Toast.makeText(context, "Document copied to clipboard!", Toast.LENGTH_SHORT).show()
                }
            ) {
                Icon(Icons.Default.ContentCopy, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("Copy Text")
            }

            Button(
                modifier = Modifier.weight(1f),
                onClick = {
                    val sendIntent = Intent().apply {
                        action = Intent.ACTION_SEND
                        putExtra(Intent.EXTRA_TEXT, docText)
                        type = "text/plain"
                    }
                    context.startActivity(Intent.createChooser(sendIntent, "Share HR Document"))
                }
            ) {
                Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(Modifier.width(6.dp))
                Text("Share / Export")
            }
        }
    }
}

// --- DIALOGS ---

@Composable
fun PaySlipDetailDialog(slip: PaySlip, onDismiss: () -> Unit) {
    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(10.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            LazyColumn(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    Text("Automated Pay Statement", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text("Apex Global Technologies Inc. • ${slip.slipNumber}", fontSize = 11.sp, color = Color.Gray)
                    Spacer(Modifier.height(6.dp))
                    Text("Employee: ${slip.employeeName} (${slip.employeeCode})", fontWeight = FontWeight.SemiBold)
                    Text("Designation: ${slip.positionTitle} • ${slip.department}", fontSize = 12.sp, color = Color.DarkGray)
                    Text("Payment Method: ${slip.bankSummary}", fontSize = 12.sp, color = Color.DarkGray)
                    Divider(Modifier.padding(vertical = 8.dp))
                }

                item {
                    Text("ITEMIZED EARNINGS", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Base Salary", fontSize = 13.sp)
                        Text("$${String.format("%,.2f", slip.basePay)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Overtime (${slip.overtimeHoursWorked} hrs @ 1.5x)", fontSize = 13.sp)
                        Text("$${String.format("%,.2f", slip.overtimePay)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Holiday Work (${slip.holidayHoursWorked} hrs @ 2.0x)", fontSize = 13.sp)
                        Text("$${String.format("%,.2f", slip.holidayPay)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Standard Allowances", fontSize = 13.sp)
                        Text("$${String.format("%,.2f", slip.allowances)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Total Gross Pay", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("$${String.format("%,.2f", slip.grossPay)}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    }
                    Divider(Modifier.padding(vertical = 8.dp))
                }

                item {
                    Text("STATUTORY TAX WITHHOLDINGS", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Color(0xFFDC2626))
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Federal Income Tax", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.federalTax)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("State Withholding Tax", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.stateTax)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Social Security (6.2%)", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.socialSecurity)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Medicare (1.45%)", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.medicare)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Pre-tax 401(k) Contribution", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.preTax401k)}", fontSize = 13.sp)
                    }
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("Medical & Health Coverage", fontSize = 13.sp)
                        Text("-$${String.format("%,.2f", slip.healthInsurance)}", fontSize = 13.sp)
                    }
                    Divider(Modifier.padding(vertical = 8.dp))
                }

                item {
                    Row(Modifier.fillMaxWidth(), Arrangement.SpaceBetween) {
                        Text("NET TAKE-HOME PAY", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Color(0xFF059669))
                        Text("$${String.format("%,.2f", slip.netPay)}", fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF059669))
                    }
                    Spacer(Modifier.height(14.dp))
                    Button(onClick = onDismiss, modifier = Modifier.fillMaxWidth()) {
                        Text("Close")
                    }
                }
            }
        }
    }
}

@Composable
fun EmployeeFormDialog(
    existing: Employee?,
    positions: List<JobPosition>,
    onDismiss: () -> Unit,
    onSave: (Employee) -> Unit
) {
    var firstName by remember { mutableStateOf(existing?.firstName ?: "") }
    var lastName by remember { mutableStateOf(existing?.lastName ?: "") }
    var email by remember { mutableStateOf(existing?.email ?: "") }
    var phone by remember { mutableStateOf(existing?.phone ?: "+1 (415) 555-0100") }
    var positionTitle by remember { mutableStateOf(existing?.positionTitle ?: (positions.firstOrNull()?.title ?: "Senior Full-Stack Engineer")) }
    var baseSalaryStr by remember { mutableStateOf(existing?.baseSalary?.toInt()?.toString() ?: "12000") }
    var joiningDate by remember { mutableStateOf(existing?.joiningDate ?: "2024-06-01") }
    var bankAccount by remember { mutableStateOf(existing?.bankAccount ?: "Silicon Valley Bank (••••1234)") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            LazyColumn(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                item {
                    Text(if (existing != null) "Edit Employee Info" else "Add New Employee", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                }
                item {
                    OutlinedTextField(value = firstName, onValueChange = { firstName = it }, label = { Text("First Name") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = lastName, onValueChange = { lastName = it }, label = { Text("Last Name") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Work Email") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = phone, onValueChange = { phone = it }, label = { Text("Phone") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = positionTitle, onValueChange = { positionTitle = it }, label = { Text("Job Position Title") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = baseSalaryStr, onValueChange = { baseSalaryStr = it }, label = { Text("Monthly Base Salary ($)") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = joiningDate, onValueChange = { joiningDate = it }, label = { Text("Joining Date (YYYY-MM-DD)") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    OutlinedTextField(value = bankAccount, onValueChange = { bankAccount = it }, label = { Text("Direct Deposit Bank Info") }, modifier = Modifier.fillMaxWidth())
                }
                item {
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                        OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancel") }
                        Button(
                            modifier = Modifier.weight(1f),
                            onClick = {
                                val emp = existing?.copy(
                                    firstName = firstName,
                                    lastName = lastName,
                                    email = email,
                                    phone = phone,
                                    positionTitle = positionTitle,
                                    baseSalary = baseSalaryStr.toDoubleOrNull() ?: 10000.0,
                                    joiningDate = joiningDate,
                                    bankAccount = bankAccount
                                ) ?: Employee(
                                    employeeCode = "EMP-${(1000..9999).random()}",
                                    firstName = firstName,
                                    lastName = lastName,
                                    email = email,
                                    phone = phone,
                                    positionTitle = positionTitle,
                                    department = Department.ENGINEERING,
                                    joiningDate = joiningDate,
                                    baseSalary = baseSalaryStr.toDoubleOrNull() ?: 10000.0,
                                    taxInfo = TaxInfo(
                                        taxId = "***-**-1234",
                                        filingStatus = "Single",
                                        stateWithholdingRate = 5.0
                                    ),
                                    bankAccount = bankAccount
                                )
                                onSave(emp)
                            }
                        ) {
                            Text("Save")
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PositionFormDialog(
    existing: JobPosition?,
    onDismiss: () -> Unit,
    onSave: (JobPosition) -> Unit
) {
    var title by remember { mutableStateOf(existing?.title ?: "") }
    var code by remember { mutableStateOf(existing?.code ?: "POS-${(10..99).random()}") }
    var minSalaryStr by remember { mutableStateOf(existing?.minSalary?.toInt()?.toString() ?: "120000") }
    var maxSalaryStr by remember { mutableStateOf(existing?.maxSalary?.toInt()?.toString() ?: "160000") }
    var description by remember { mutableStateOf(existing?.description ?: "") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text(if (existing != null) "Edit Position" else "New Job Position", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                OutlinedTextField(value = title, onValueChange = { title = it }, label = { Text("Position Title") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = code, onValueChange = { code = it }, label = { Text("Position Code") }, modifier = Modifier.fillMaxWidth())
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(value = minSalaryStr, onValueChange = { minSalaryStr = it }, label = { Text("Min Salary ($)") }, modifier = Modifier.weight(1f))
                    OutlinedTextField(value = maxSalaryStr, onValueChange = { maxSalaryStr = it }, label = { Text("Max Salary ($)") }, modifier = Modifier.weight(1f))
                }
                OutlinedTextField(value = description, onValueChange = { description = it }, label = { Text("Role Description") }, modifier = Modifier.fillMaxWidth())

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancel") }
                    Button(
                        modifier = Modifier.weight(1f),
                        onClick = {
                            val pos = existing?.copy(
                                title = title,
                                code = code,
                                minSalary = minSalaryStr.toDoubleOrNull() ?: 100000.0,
                                maxSalary = maxSalaryStr.toDoubleOrNull() ?: 150000.0,
                                description = description
                            ) ?: JobPosition(
                                title = title,
                                code = code,
                                department = Department.ENGINEERING,
                                minSalary = minSalaryStr.toDoubleOrNull() ?: 100000.0,
                                maxSalary = maxSalaryStr.toDoubleOrNull() ?: 150000.0,
                                description = description
                            )
                            onSave(pos)
                        }
                    ) {
                        Text("Save")
                    }
                }
            }
        }
    }
}

@Composable
fun LogHoursDialog(
    employees: List<Employee>,
    onDismiss: () -> Unit,
    onSave: (String, Double, Double, Double, String) -> Unit
) {
    var selectedEmployeeId by remember { mutableStateOf(employees.firstOrNull()?.id ?: "") }
    var regHoursStr by remember { mutableStateOf("80") }
    var otHoursStr by remember { mutableStateOf("0") }
    var holHoursStr by remember { mutableStateOf("0") }
    var notes by remember { mutableStateOf("") }

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("Log Employee Hours", fontWeight = FontWeight.Bold, fontSize = 18.sp)

                Text("Select Staff Member:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    employees.take(3).forEach { emp ->
                        FilterChip(
                            selected = selectedEmployeeId == emp.id,
                            onClick = { selectedEmployeeId = emp.id },
                            label = { Text(emp.firstName, fontSize = 11.sp) }
                        )
                    }
                }

                OutlinedTextField(value = regHoursStr, onValueChange = { regHoursStr = it }, label = { Text("Regular Hours") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = otHoursStr, onValueChange = { otHoursStr = it }, label = { Text("Overtime Hours (1.5x pay)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = holHoursStr, onValueChange = { holHoursStr = it }, label = { Text("Holiday Hours (2.0x pay)") }, modifier = Modifier.fillMaxWidth())
                OutlinedTextField(value = notes, onValueChange = { notes = it }, label = { Text("Work Notes") }, modifier = Modifier.fillMaxWidth())

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.fillMaxWidth()) {
                    OutlinedButton(onClick = onDismiss, modifier = Modifier.weight(1f)) { Text("Cancel") }
                    Button(
                        modifier = Modifier.weight(1f),
                        onClick = {
                            val reg = regHoursStr.toDoubleOrNull() ?: 80.0
                            val ot = otHoursStr.toDoubleOrNull() ?: 0.0
                            val hol = holHoursStr.toDoubleOrNull() ?: 0.0
                            onSave(selectedEmployeeId, reg, ot, hol, notes)
                        }
                    ) {
                        Text("Record")
                    }
                }
            }
        }
    }
}

@Composable
fun PhotoSelectionDialog(
    employee: Employee,
    onDismiss: () -> Unit,
    onSelectPhoto: (String) -> Unit
) {
    val presets = listOf(
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
    )

    Dialog(onDismissRequest = onDismiss) {
        Card(
            modifier = Modifier.fillMaxWidth().padding(8.dp),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White)
        ) {
            Column(modifier = Modifier.padding(18.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Update Photo for ${employee.fullName}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("Select employee profile picture or corporate photo:", fontSize = 12.sp, color = Color.Gray)

                presets.forEachIndexed { idx, url ->
                    Button(
                        onClick = { onSelectPhoto(url) },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primaryContainer, contentColor = MaterialTheme.colorScheme.onPrimaryContainer)
                    ) {
                        Text("Select Corporate Avatar Preset #${idx + 1}")
                    }
                }

                OutlinedButton(onClick = onDismiss, modifier = Modifier.fillMaxWidth()) {
                    Text("Close")
                }
            }
        }
    }
}

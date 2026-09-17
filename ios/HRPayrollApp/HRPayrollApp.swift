//
//  HRPayrollApp.swift
//  HRPayrollApp
//
//  Complete runnable native iOS application for Xcode
//

import SwiftUI

@main
struct HRPayrollApp: App {
    @StateObject private var viewModel = HRPayrollViewModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(viewModel)
        }
    }
}

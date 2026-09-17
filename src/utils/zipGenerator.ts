import JSZip from 'jszip';
import { IOS_PROJECT_FILES, ANDROID_PROJECT_FILES } from './nativeProjectsCode';

export async function downloadIosXcodeZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('HRPayrollApp-iOS');

  if (!rootFolder) return;

  IOS_PROJECT_FILES.forEach((file) => {
    rootFolder.file(file.path, file.content);
  });

  // Add a handy README.md inside the zip
  rootFolder.file(
    'README.md',
    `# HRPayrollApp for iOS (Xcode)

## How to run:
1. Open this unzipped folder on a Mac with Xcode 15 or 16 installed.
2. Double-click \`HRPayrollApp.xcodeproj\` to open in Xcode.
3. Select an iOS Simulator (e.g. iPhone 16 Pro) or your connected physical device.
4. Press \`Cmd + R\` (or click the Run arrow button) to build and run the native SwiftUI application!

## Features included:
- Native SwiftUI layout with TabView (Dashboard, Employees, Positions, Hours, Payroll, Documents)
- Employee Directory with photos, positions, salary, joining date & tenure tracking
- Work hours tracker with regular, overtime, and holiday hours
- Automated Pay Slip generator with tax withholdings calculation
- Legal document generator (Offer Letter, Appointment Letter, NDA)
- Camera & photo library permissions in Info.plist
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = 'HRPayrollApp-iOS-Xcode.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

export async function downloadAndroidStudioZip(): Promise<void> {
  const zip = new JSZip();
  const rootFolder = zip.folder('HRPayrollApp-Android');

  if (!rootFolder) return;

  ANDROID_PROJECT_FILES.forEach((file) => {
    rootFolder.file(file.path, file.content);
  });

  // Add root README.md
  rootFolder.file(
    'README.md',
    `# HRPayrollApp for Android (Android Studio)

## How to run:
1. Open Android Studio (Hedgehog, Iguana, Jellyfish, or newer).
2. Choose "Open" and select this \`HRPayrollApp-Android\` folder.
3. Allow Gradle to sync dependencies automatically.
4. Choose an Android Emulator (API 26+) or your physical Android device.
5. Click the green "Run" icon (Shift + F10).

## Features included:
- 100% Jetpack Compose Material 3 UI architecture
- StateFlow ViewModel pattern
- Employee directory, positions, photo saving & joining date tracking
- Work hours & overtime calculation
- Automated payroll & itemized tax deductions
- Offer Letter, Appointment Letter, and NDA contracts
`
  );

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = 'HRPayrollApp-Android-Studio.zip';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

// Aliases
export const downloadIOSProjectZip = downloadIosXcodeZip;
export const downloadAndroidProjectZip = downloadAndroidStudioZip;

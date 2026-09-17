import React, { useState } from 'react';
import { 
  Smartphone, 
  Apple, 
  Download, 
  FileCode2, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  Terminal, 
  Cpu,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { downloadIOSProjectZip, downloadAndroidProjectZip } from '../utils/zipGenerator';
import { IOS_PROJECT_FILES, ANDROID_PROJECT_FILES } from '../utils/nativeProjectsCode';

export const MobileAppsView: React.FC = () => {
  const [activePlatform, setActivePlatform] = useState<'ios' | 'android'>('ios');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const files = activePlatform === 'ios' ? IOS_PROJECT_FILES : ANDROID_PROJECT_FILES;
  const currentFile = files[selectedFileIndex] || files[0];

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      if (activePlatform === 'ios') {
        downloadIOSProjectZip();
      } else {
        downloadAndroidProjectZip();
      }
      setDownloading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Smartphone className="w-5 h-5" />
              </span>
              <h1 className="text-xl font-bold text-slate-900">
                Native iOS &amp; Android Companion Projects
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Fully runnable, complete Xcode and Android Studio projects matching all HR Payroll, position tracking, employee photo, and payslip capabilities.
            </p>
          </div>

          {/* Quick Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition cursor-pointer ${
              activePlatform === 'ios'
                ? 'bg-slate-900 hover:bg-black shadow-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading
                ? 'Generating Project ZIP...'
                : activePlatform === 'ios'
                ? 'Download Native iOS Project (Xcode)'
                : 'Download Native Android Project (Studio)'}
            </span>
          </button>
        </div>

        {/* Platform Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setActivePlatform('ios');
              setSelectedFileIndex(0);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activePlatform === 'ios'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Apple className="w-4 h-4" />
            <span>Apple Xcode Project (SwiftUI 5.9+)</span>
          </button>

          <button
            onClick={() => {
              setActivePlatform('android');
              setSelectedFileIndex(0);
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activePlatform === 'android'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Android Studio Project (Jetpack Compose)</span>
          </button>
        </div>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
            <Cpu className="w-4 h-4 text-indigo-600" />
            <span>Target Environment</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            {activePlatform === 'ios'
              ? 'iOS 16.0+, macOS with Xcode 15/16. Native Swift 5.9 with modern declarative SwiftUI architecture.'
              : 'Android 8.0+ (API 26 to API 34), Android Studio Hedgehog+. Modern Kotlin & Material 3 Jetpack Compose.'}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Native Feature Parity</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            Employee photo cards, position tracking, tenure counters, work hours logging, statutory tax withholding calculations, and itemized pay slips.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900 mb-1">
            <Terminal className="w-4 h-4 text-indigo-600" />
            <span>Instant Execution</span>
          </div>
          <p className="text-slate-500 leading-relaxed">
            {activePlatform === 'ios'
              ? 'Unzip the downloaded folder and double-click HRPayrollApp.xcodeproj to launch directly in Xcode.'
              : 'Unzip and select "Open..." in Android Studio pointing to the root folder. Gradle syncs automatically.'}
          </p>
        </div>
      </div>

      {/* Code Inspector & File Tree Explorer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden text-slate-300">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono">
            <FileCode2 className="w-4 h-4 text-indigo-400" />
            <span className="text-white font-semibold">
              {activePlatform === 'ios' ? 'iOS Project File Tree' : 'Android Project File Tree'}
            </span>
            <span className="text-slate-500">• {files.length} Project Files</span>
          </div>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download ZIP Package</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* File Explorer Sidebar */}
          <div className="md:col-span-4 bg-slate-950/60 border-r border-slate-800/80 p-3 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold px-2 py-1 block">
              Project Manifest
            </span>
            {files.map((file, idx) => {
              const isSelected = selectedFileIndex === idx;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFileIndex(idx)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-8 p-4 bg-slate-900 overflow-x-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="text-indigo-400 font-semibold">{currentFile.path}</span>
                <span>{currentFile.content.split('\n').length} lines</span>
              </div>
              <pre className="font-mono text-xs text-slate-200 py-4 leading-relaxed overflow-x-auto whitespace-pre">
                {currentFile.content}
              </pre>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Ready for compilation in IDE</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(currentFile.content);
                  alert(`Copied ${currentFile.path} to clipboard!`);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono underline"
              >
                Copy File Contents
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

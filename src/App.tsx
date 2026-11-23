import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NavigationSection, RealtimeMetrics, SystemOverview } from './types';
import { NexoraApi } from './services/api';

// Feature Views
import { OverviewView } from './features/overview/OverviewView';
import { SmartCleanerView } from './features/cleaner/SmartCleanerView';
import { DeepCleanerView } from './features/deep-cleaner/DeepCleanerView';
import { PrivacyCenterView } from './features/privacy/PrivacyCenterView';
import { SystemMonitorView } from './features/monitor/SystemMonitorView';
import { StartupManagerView } from './features/startup/StartupManagerView';
import { DiskAnalyzerView } from './features/disk-analyzer/DiskAnalyzerView';
import { DuplicateFinderView } from './features/duplicates/DuplicateFinderView';
import { ApplicationManagerView } from './features/applications/ApplicationManagerView';
import { SystemDiagnosticsView } from './features/diagnostics/SystemDiagnosticsView';
import { MaintenanceCenterView } from './features/maintenance/MaintenanceCenterView';
import { ActivityHistoryView } from './features/history/ActivityHistoryView';
import { SettingsView } from './features/settings/SettingsView';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('overview');
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSystemData = async () => {
    setIsRefreshing(true);
    try {
      const [sysOverview, liveMetrics] = await Promise.all([
        NexoraApi.getSystemOverview(),
        NexoraApi.getRealtimeMetrics(),
      ]);
      setOverview(sysOverview);
      setMetrics(liveMetrics);
    } catch (err) {
      console.error('Failed to fetch system data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(() => {
      NexoraApi.getRealtimeMetrics().then(setMetrics).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#08090D] text-[#F5F7FA] overflow-hidden select-none font-sans">
      {/* Sidebar Navigation */}
      <Sidebar currentSection={currentSection} onSelectSection={setCurrentSection} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#08090D]">
        <Header
          currentSection={currentSection}
          metrics={metrics}
          onQuickRefresh={fetchSystemData}
          isRefreshing={isRefreshing}
        />

        <main className="flex-1 overflow-hidden relative">
          {currentSection === 'overview' && (
            <OverviewView
              overview={overview}
              metrics={metrics}
              onNavigateToCleaner={() => setCurrentSection('cleaner')}
              onNavigateToSection={setCurrentSection}
            />
          )}

          {currentSection === 'cleaner' && <SmartCleanerView />}

          {currentSection === 'deep-cleaner' && <DeepCleanerView />}

          {currentSection === 'privacy' && <PrivacyCenterView />}

          {currentSection === 'monitor' && <SystemMonitorView />}

          {currentSection === 'startup' && <StartupManagerView />}

          {currentSection === 'disk-analyzer' && <DiskAnalyzerView />}

          {currentSection === 'duplicates' && <DuplicateFinderView />}

          {currentSection === 'applications' && <ApplicationManagerView />}

          {currentSection === 'diagnostics' && <SystemDiagnosticsView overview={overview} />}

          {currentSection === 'maintenance' && <MaintenanceCenterView />}

          {currentSection === 'history' && <ActivityHistoryView />}

          {currentSection === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
export default App;

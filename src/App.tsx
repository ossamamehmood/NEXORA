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
import { GamingModeView } from './features/gaming/GamingModeView';
import { StartupManagerView } from './features/startup/StartupManagerView';
import { DiskAnalyzerView } from './features/disk-analyzer/DiskAnalyzerView';
import { DuplicateFinderView } from './features/duplicates/DuplicateFinderView';
import { ApplicationManagerView } from './features/applications/ApplicationManagerView';
import { SystemDiagnosticsView } from './features/diagnostics/SystemDiagnosticsView';
import { MaintenanceCenterView } from './features/maintenance/MaintenanceCenterView';
import { ActivityHistoryView } from './features/history/ActivityHistoryView';
import { BetaFeedbackView } from './features/feedback/BetaFeedbackView';
import { SettingsView } from './features/settings/SettingsView';

export const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('overview');
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [overview, setOverview] = useState<SystemOverview | null>(null);
  const [metrics, setMetrics] = useState<RealtimeMetrics | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSelectSection = (section: NavigationSection) => {
    setIsAssistantActive(false);
    setCurrentSection(section);
  };

  const handleToggleAssistant = () => {
    setIsAssistantActive((prev) => !prev);
    setCurrentSection('overview');
  };

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
    NexoraApi.getAppSettings().then((cfg) => {
      if (cfg && cfg.theme === 'light') {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
    }).catch(() => {});
    const interval = setInterval(() => {
      NexoraApi.getRealtimeMetrics().then(setMetrics).catch(() => {});
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-screen cleanmymac-bg text-white overflow-hidden select-none font-sans relative">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#F502FD]/10 via-[#6E56FF]/15 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-to-t from-[#02FEDC]/10 via-[#6E56FF]/10 to-transparent blur-[100px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <Sidebar
        currentSection={currentSection}
        onSelectSection={handleSelectSection}
        isAssistantActive={isAssistantActive}
        onToggleAssistant={handleToggleAssistant}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-transparent z-10">
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
              onNavigateToCleaner={() => handleSelectSection('cleaner')}
              onNavigateToSection={handleSelectSection}
              isAssistantActive={isAssistantActive}
            />
          )}

          {currentSection === 'cleaner' && <SmartCleanerView />}

          {currentSection === 'deep-cleaner' && <DeepCleanerView />}

          {currentSection === 'privacy' && <PrivacyCenterView />}

          {currentSection === 'monitor' && <SystemMonitorView />}

          {currentSection === 'gaming' && <GamingModeView />}

          {currentSection === 'startup' && <StartupManagerView />}

          {currentSection === 'disk-analyzer' && <DiskAnalyzerView />}

          {currentSection === 'duplicates' && <DuplicateFinderView />}

          {currentSection === 'applications' && <ApplicationManagerView />}

          {currentSection === 'diagnostics' && <SystemDiagnosticsView overview={overview} />}

          {currentSection === 'maintenance' && <MaintenanceCenterView />}

          {currentSection === 'history' && <ActivityHistoryView />}

          {currentSection === 'feedback' && <BetaFeedbackView />}

          {currentSection === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
};
export default App;

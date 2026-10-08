import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MapPage } from './pages/MapPage';
import { AreasPage } from './pages/AreasPage';
import { AreaDetailPage } from './pages/AreaDetailPage';
import { FactorAnalysisPage } from './pages/FactorAnalysisPage';
import { RiversPage } from './pages/RiversPage';
import { EvacuationPage } from './pages/EvacuationPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { PopulationPage } from './pages/PopulationPage';
import { ReportsHistoryPage } from './pages/ReportsHistoryPage';
import { NewReportPage } from './pages/NewReportPage';
import { EducationPage } from './pages/EducationPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { LoginPage } from './pages/LoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminReportsVerificationPage } from './pages/AdminReportsVerificationPage';
import { UserProfilePage } from './pages/UserProfilePage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Standalone Splash & Onboarding */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Main App Routes with AppLayout (Header, Sidebar, BottomNav, Modals) */}
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/map" element={<AppLayout><MapPage /></AppLayout>} />
          <Route path="/areas" element={<AppLayout><AreasPage /></AppLayout>} />
          <Route path="/areas/:id" element={<AppLayout><AreaDetailPage /></AppLayout>} />
          <Route path="/analysis" element={<AppLayout><FactorAnalysisPage /></AppLayout>} />
          <Route path="/rivers" element={<AppLayout><RiversPage /></AppLayout>} />
          <Route path="/evacuation" element={<AppLayout><EvacuationPage /></AppLayout>} />
          <Route path="/facilities" element={<AppLayout><FacilitiesPage /></AppLayout>} />
          <Route path="/population" element={<AppLayout><PopulationPage /></AppLayout>} />
          <Route path="/reports" element={<AppLayout><ReportsHistoryPage /></AppLayout>} />
          <Route path="/reports/new" element={<AppLayout><NewReportPage /></AppLayout>} />
          <Route path="/education" element={<AppLayout><EducationPage /></AppLayout>} />
          <Route path="/data-sources" element={<AppLayout><DataSourcesPage /></AppLayout>} />
          <Route path="/admin" element={<AppLayout><AdminDashboardPage /></AppLayout>} />
          <Route path="/admin/reports" element={<AppLayout><AdminReportsVerificationPage /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><UserProfilePage /></AppLayout>} />

          {/* Fallback to Dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { initGlobalBackButton } from './lib/native/back-button';
import { PageFallback } from './components/common/Skeleton';

// Instant Entry Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';

// Lazy-Loaded Routes with dynamic chunking
const OnboardingPage = lazy(() => import('./pages/OnboardingPage').then(m => ({ default: m.OnboardingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const MapPage = lazy(() => import('./pages/MapPage').then(m => ({ default: m.MapPage })));
const AreasPage = lazy(() => import('./pages/AreasPage').then(m => ({ default: m.AreasPage })));
const AreaDetailPage = lazy(() => import('./pages/AreaDetailPage').then(m => ({ default: m.AreaDetailPage })));
const FactorAnalysisPage = lazy(() => import('./pages/FactorAnalysisPage').then(m => ({ default: m.FactorAnalysisPage })));
const RiversPage = lazy(() => import('./pages/RiversPage').then(m => ({ default: m.RiversPage })));
const EvacuationPage = lazy(() => import('./pages/EvacuationPage').then(m => ({ default: m.EvacuationPage })));
const FacilitiesPage = lazy(() => import('./pages/FacilitiesPage').then(m => ({ default: m.FacilitiesPage })));
const PopulationPage = lazy(() => import('./pages/PopulationPage').then(m => ({ default: m.PopulationPage })));
const ReportsHistoryPage = lazy(() => import('./pages/ReportsHistoryPage').then(m => ({ default: m.ReportsHistoryPage })));
const NewReportPage = lazy(() => import('./pages/NewReportPage').then(m => ({ default: m.NewReportPage })));
const EducationPage = lazy(() => import('./pages/EducationPage').then(m => ({ default: m.EducationPage })));
const DataSourcesPage = lazy(() => import('./pages/DataSourcesPage').then(m => ({ default: m.DataSourcesPage })));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })));
const AdminReportsVerificationPage = lazy(() => import('./pages/AdminReportsVerificationPage').then(m => ({ default: m.AdminReportsVerificationPage })));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage').then(m => ({ default: m.UserProfilePage })));

const BackButtonManager: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    return initGlobalBackButton({
      getCurrentPath: () => location.pathname,
      goBack: () => navigate(-1),
      goToDashboard: () => navigate('/dashboard'),
    });
  }, [navigate, location]);

  return null;
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <BackButtonManager />
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

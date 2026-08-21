import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MainLayout } from './layouts/MainLayout';
import { ErrorBoundary } from './app/ErrorBoundary';
import { NotFound } from './app/NotFound';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { PageTransition } from './components/animations/PageTransition';
import { Landing } from './pages/Landing';

// Lazy loaded feature routes
const Login = lazy(() => import('./features/auth/pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('./features/auth/pages/Register').then((m) => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })));
const DashboardHome = lazy(() => import('./features/dashboard/pages/DashboardHome'));
const CropsPage = lazy(() => import('./features/crops/pages/CropsPage'));
const DiseasesPage = lazy(() => import('./features/diseases/pages/DiseasesPage'));
const TreatmentsPage = lazy(() => import('./features/treatments/pages/TreatmentsPage'));
const DetectPage = lazy(() => import('./features/scans/pages/DetectPage'));
const ScanHistoryPage = lazy(() => import('./features/scans/pages/ScanHistoryPage'));
const AssistantPage = lazy(() => import('./features/chatbot/pages/AssistantPage'));
const ProfilePage = lazy(() => import('./features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('./features/settings/pages/SettingsPage'));
const AdminPage = lazy(() => import('./features/admin/pages/AdminPage'));

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<LoadingOverlay isLoading={true} message="Loading AgriLens..." />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
                <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
                <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
                <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

                {/* Protected Routes inside App Shell */}
                <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<PageTransition><DashboardHome /></PageTransition>} />
                  <Route path="/detect" element={<PageTransition><DetectPage /></PageTransition>} />
                  <Route path="/history" element={<PageTransition><ScanHistoryPage /></PageTransition>} />
                  <Route path="/crops" element={<PageTransition><CropsPage /></PageTransition>} />
                  <Route path="/library" element={<PageTransition><CropsPage /></PageTransition>} />
                  <Route path="/diseases" element={<PageTransition><DiseasesPage /></PageTransition>} />
                  <Route path="/treatments" element={<PageTransition><TreatmentsPage /></PageTransition>} />
                  <Route path="/assistant" element={<PageTransition><AssistantPage /></PageTransition>} />
                  <Route path="/profile" element={<PageTransition><ProfilePage /></PageTransition>} />
                  <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />

                  {/* Admin Only Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <PageTransition><AdminPage /></PageTransition>
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-all */}
                  <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                </Route>
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;

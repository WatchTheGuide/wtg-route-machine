import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ToursPage } from '@/pages/ToursPage';
import { PoisPage } from '@/pages/PoisPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected admin dashboard routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
          <Route index element={<DashboardPage />} />
          <Route path="tours" element={<ToursPage />} />
          <Route path="pois" element={<PoisPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

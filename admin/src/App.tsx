import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { ToursPage } from '@/pages/ToursPage';
import { PoisPage } from '@/pages/PoisPage';
import { SettingsPage } from '@/pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin dashboard routes */}
        <Route path="/admin" element={<DashboardLayout />}>
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

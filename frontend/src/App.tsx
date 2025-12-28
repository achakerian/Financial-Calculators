import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { PayTaxPage } from './pages/PayTaxPage';
import { InvestmentsPage } from './pages/InvestmentsPage';
import { LoginPage } from './pages/LoginPage';
import { InformationPage } from './pages/InformationPage';

export const App: React.FC = () => {
  const basename = import.meta.env.BASE_URL;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="pay-tax" element={<PayTaxPage />} />
          <Route path="investments" element={<InvestmentsPage />} />
          <Route path="information" element={<InformationPage />} />
          <Route path="login" element={<LoginPage />} />
          {/* Legacy routes for backwards compatibility */}
          <Route path="loans" element={<Navigate to="/home" replace />} />
          <Route path="super" element={<Navigate to="/investments" replace />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

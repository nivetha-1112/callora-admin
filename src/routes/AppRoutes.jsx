import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import ManagerList from '../pages/Manager/ManagerList';
import TelecallerList from '../pages/Telecaller/TelecallerList';
import TelecallerDetails from '../pages/Telecaller/TelecallerDetails';
import AuthMonitoring from '../pages/Authentication/AuthMonitoring';
import Reports from '../pages/Reports/Reports';
import Settings from '../pages/Settings/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="managers" element={<ManagerList />} />
        <Route path="telecallers" element={<TelecallerList />} />
        <Route path="telecallers/:id" element={<TelecallerDetails />} />
        <Route path="logout-report" element={<AuthMonitoring />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

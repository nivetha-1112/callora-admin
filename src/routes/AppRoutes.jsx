import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import RolesPermissions from '../pages/RolesPermissions/RolesPermissions';
import UserList from '../pages/Users/UserList';
import AssignClient from '../pages/Users/AssignClient';
import EmployeeDetail from '../pages/Users/EmployeeDetail';
import TeamTarget from '../pages/TeamTarget/TeamTarget';
import Activities from '../pages/Activities/Activities';
import Reports from '../pages/Reports/Reports';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="roles-permissions" element={<RolesPermissions />} />
        <Route path="users" element={<UserList />} />
        <Route path="assign-client" element={<AssignClient />} />
        <Route path="users/employee-detail/:id" element={<EmployeeDetail />} />
        <Route path="team-target" element={<TeamTarget />} />
        <Route path="activities" element={<Activities />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, TextField,
  InputAdornment, Tab, Tabs
} from '@mui/material';

import StatCard from '../../components/StatCard/StatCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import { authStats, loginHistory } from '../../data/authData';
import { telecallers } from '../../data/telecallerData';
import useDebounce from '../../hooks/useDebounce';

const formatLoginDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatLoginTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '—';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  return strTime;
};

export default function AuthMonitoring() {
  const [activeTab, setActiveTab] = useState(0); // 0 for Web Login, 1 for Mobile Login
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search);

  const filteredHistory = useMemo(() => {
    return loginHistory.filter((h) => {
      // Search matching
      const matchSearch = h.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        h.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      if (!matchSearch) return false;

      // Device / Tab matching
      const isMobileDevice = h.device?.toLowerCase().includes('mobile') || 
                             h.device?.toLowerCase().includes('iphone') || 
                             h.device?.toLowerCase().includes('android') || 
                             h.device?.toLowerCase().includes('ipad') || 
                             h.device?.toLowerCase().includes('tablet');
                             
      if (activeTab === 0) {
        // Web Login
        return !isMobileDevice;
      } else {
        // Mobile Login
        return isMobileDevice;
      }
    });
  }, [debouncedSearch, activeTab]);

  return (
    <Box>
      <PageHeader
        title="Logout Report"
        subtitle="Monitor web and mobile login/logout activity and details"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Logout Report' }]}
      />

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {authStats.map((stat, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.id}>
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              iconClass={stat.iconClass}
              color={stat.color}
              delay={i}
            />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(e, newValue) => { setActiveTab(newValue); setPage(0); }}
        sx={{
          mb: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'text.secondary',
          },
          '& .Mui-selected': {
            color: '#0343a8 !important',
          },
          '& .MuiTabs-indicator': {
            backgroundColor: '#0343a8',
            height: 3,
          }
        }}
      >
        <Tab label="Web Login" />
        <Tab label="Mobile Login" />
      </Tabs>

      <Grid container spacing={2.5}>
        {/* Login History Table */}
        <Grid size={12}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {activeTab === 0 ? 'Web Login History' : 'Mobile Login History'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <TextField
                    size="small"
                    placeholder="Search by Employee..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 240 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <i className="bi bi-search" style={{ fontSize: '0.9rem', color: '#9ca3af', marginRight: '6px' }}></i>
                        </InputAdornment>
                      )
                    }}
                  />
                </Box>
              </Box>

              <TableContainer>
                <Table size="small" sx={{ minWidth: 900 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>User Name</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Phone Number</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Location</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Device Name</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Login Date</TableCell>
                      <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Login Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const tc = telecallers.find((t) => t.id === row.employeeId);
                      const phoneNumber = tc ? tc.mobile : '+91 99887 76601';
                      const location = [
                        'Chennai, Tamil Nadu, India',
                        'Coimbatore, Tamil Nadu, India',
                        'Mumbai, Maharashtra, India',
                        'Delhi, India',
                        'Bangalore, Karnataka, India'
                      ][row.id % 5];

                      return (
                        <TableRow key={row.id} hover>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>
                              {row.employeeId}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                              {row.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                              {phoneNumber}
                            </Typography>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                              {location}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                              {row.device}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                              {formatLoginDate(row.loginTime)}
                            </Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                              {formatLoginTime(row.loginTime)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredHistory.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(e, p) => setPage(p)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, TextField, MenuItem,
  Select, FormControl, InputLabel, InputAdornment, Chip, Button, Divider,
  Alert, AlertTitle
} from '@mui/material';

import StatCard from '../../components/StatCard/StatCard';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { authStats, loginHistory, activityTimeline, securityAlerts } from '../../data/authData';
import { getInitials, formatDateTime, formatTime, timeAgo } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';

const getDeviceIcon = (device) => {
  if (device?.toLowerCase().includes('mobile') || device?.toLowerCase().includes('iphone') || device?.toLowerCase().includes('android mobile')) {
    return <i className="bi bi-phone" style={{ fontSize: '0.95rem', color: '#475569' }}></i>;
  }
  if (device?.toLowerCase().includes('tablet') || device?.toLowerCase().includes('ipad')) {
    return <i className="bi bi-tablet" style={{ fontSize: '0.95rem', color: '#475569' }}></i>;
  }
  return <i className="bi bi-laptop" style={{ fontSize: '0.95rem', color: '#475569' }}></i>;
};

const getActivityColor = (type) => {
  switch (type) {
    case 'login': return '#10b981';
    case 'logout': return '#6b7280';
    case 'expired': return '#f59e0b';
    case 'failed': return '#ef4444';
    default: return '#034cae';
  }
};

export default function AuthMonitoring() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const debouncedSearch = useDebounce(search);

  const filteredHistory = useMemo(() => {
    return loginHistory.filter((h) => {
      const matchSearch = h.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        h.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'All' || h.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [debouncedSearch, statusFilter]);

  return (
    <Box>
      <PageHeader
        title="Authentication Monitoring"
        subtitle="Monitor telecaller login/logout activity and security"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Authentication' }]}
        actions={<ExportMenu onExport={(f) => alert(`Exporting as ${f}...`)} />}
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

      <Grid container spacing={2.5}>
        {/* Login History Table */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Login History</Typography>
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <TextField size="small" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
                    sx={{ minWidth: 200 }}
                    InputProps={{ startAdornment: <InputAdornment position="start"><i className="bi bi-search" style={{ fontSize: '0.9rem', color: '#9ca3af', marginRight: '6px' }}></i></InputAdornment> }}
                  />
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                      <MenuItem value="All">All Status</MenuItem>
                      <MenuItem value="Logged In">Logged In</MenuItem>
                      <MenuItem value="Logged Out">Logged Out</MenuItem>
                      <MenuItem value="Session Expired">Session Expired</MenuItem>
                      <MenuItem value="Failed Login">Failed Login</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TableContainer>
                <Table size="small" sx={{ minWidth: 850 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Login Time</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Logout Time</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Duration</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Device / Browser</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>IP Address</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHistory.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                      <TableRow key={row.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#034cae', whiteSpace: 'nowrap' }}>{row.employeeId}</Typography></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.65rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                              {getInitials(row.name)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{row.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{formatTime(row.loginTime)}</Typography></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{row.logoutTime ? formatTime(row.logoutTime) : '—'}</Typography></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{row.sessionDuration}</Typography></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, whiteSpace: 'nowrap' }}>
                            {getDeviceIcon(row.device)}
                            <Box sx={{ whiteSpace: 'nowrap' }}>
                              <Typography variant="body2" sx={{ fontSize: '0.75rem', lineHeight: 1.2, whiteSpace: 'nowrap' }}>{row.device}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{row.browser}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{row.ip}</Typography></TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}><StatusChip status={row.status} /></TableCell>
                      </TableRow>
                    ))}
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

        {/* Right Column */}
        <Grid size={{ xs: 12, lg: 4 }}>
          {/* Security Alerts */}
          <Card sx={{ mb: 2.5 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <i className="bi bi-shield-lock" style={{ fontSize: '1.25rem', color: '#034cae', marginRight: '8px' }}></i>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Security Alerts</Typography>
              </Box>
              {securityAlerts.map((alert) => (
                <Box key={alert.id} sx={{
                  p: 1.5, mb: 1.5, borderRadius: 2,
                  backgroundColor: alert.type === 'error' ? '#fee2e2' : alert.type === 'warning' ? '#fef3c7' : '#eaf4ff',
                  border: `1px solid ${alert.type === 'error' ? '#fecaca' : alert.type === 'warning' ? '#fde68a' : '#d6e9ff'}`,
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    {alert.type === 'error' ? <i className="bi bi-exclamation-octagon" style={{ fontSize: '1rem', color: '#ef4444' }}></i> :
                      alert.type === 'warning' ? <i className="bi bi-exclamation-triangle" style={{ fontSize: '1rem', color: '#f59e0b' }}></i> :
                        <i className="bi bi-check-circle" style={{ fontSize: '1rem', color: '#10b981' }}></i>}
                    <Typography sx={{ fontWeight: 600, fontSize: '0.8rem' }}>{alert.title}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', pl: 3 }}>{alert.message}</Typography>
                  <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', pl: 3, mt: 0.5 }}>{timeAgo(alert.time)}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Activity Timeline</Typography>
              {activityTimeline.slice(0, 8).map((activity, idx) => (
                <Box key={activity.id} sx={{ display: 'flex', gap: 1.5, mb: 0 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Box sx={{
                      width: 10, height: 10, borderRadius: '50%',
                      backgroundColor: getActivityColor(activity.type),
                      border: `2px solid ${getActivityColor(activity.type)}30`,
                      mt: 0.8,
                    }} />
                    {idx < activityTimeline.length - 1 && (
                      <Box sx={{ width: 2, flex: 1, backgroundColor: '#e5e7eb', minHeight: 30 }} />
                    )}
                  </Box>
                  <Box sx={{ pb: 2, flex: 1 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{activity.name}</Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                      {activity.action} • {activity.device}
                    </Typography>
                    <Typography sx={{ fontSize: '0.65rem', color: '#9ca3af', mt: 0.3 }}>{timeAgo(activity.time)}</Typography>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

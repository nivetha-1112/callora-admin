import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, TextField, InputAdornment,
  Avatar, Chip, Grid
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { loginHistory, activityTimeline, securityAlerts } from '../../data/authData';
import { getInitials, formatDate, timeAgo } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

// Hardcoded call activity list merged from client histories
const mockCallActivities = [
  { id: 'ACT001', clientName: 'Apex Industries', telecallerName: 'Priya Sharma', date: '2026-06-27', time: '10:30 AM', duration: '01:15', outcome: 'Contacted', notes: 'Client was traveling. Requested callback on Saturday.' },
  { id: 'ACT002', clientName: 'Beacon Tech', telecallerName: 'Priya Sharma', date: '2026-06-27', time: '04:12 PM', duration: '05:12', outcome: 'Interested', notes: 'Explained package features. Client requested pricing details via email.' },
  { id: 'ACT003', clientName: 'Apex Industries', telecallerName: 'Priya Sharma', date: '2026-06-26', time: '02:15 PM', duration: '02:15', outcome: 'Not Interested', notes: 'Not interested in cloud plans. Prefers a local offline setup.' },
  { id: 'ACT004', clientName: 'Crown Ventures', telecallerName: 'Priya Sharma', date: '2026-06-25', time: '11:00 AM', duration: '04:15', outcome: 'Interested', notes: 'Spoke with IT manager. They are interested in a demo.' },
  { id: 'ACT005', clientName: 'Crown Ventures', telecallerName: 'Priya Sharma', date: '2026-06-26', time: '03:30 PM', duration: '06:48', outcome: 'Interested', notes: 'Client confirmed subscription details. Sent payment invoice link.' },
  { id: 'ACT006', clientName: 'Crown Ventures', telecallerName: 'Priya Sharma', date: '2026-06-27', time: '10:00 AM', duration: '01:30', outcome: 'Converted', notes: 'Followed up on payment. Payment verified successfully.' },
  { id: 'ACT007', clientName: 'Dynamic Corp', telecallerName: 'Amit Kumar', date: '2026-06-25', time: '12:10 PM', duration: '02:40', outcome: 'Contacted', notes: 'Initial screening. Client matches target criteria.' },
  { id: 'ACT008', clientName: 'Dynamic Corp', telecallerName: 'Amit Kumar', date: '2026-06-27', time: '03:15 PM', duration: '05:30', outcome: 'Interested', notes: 'Detailed discussion. Client asked for customization options.' },
  { id: 'ACT009', clientName: 'Dynamic Corp', telecallerName: 'Amit Kumar', date: '2026-06-28', time: '10:30 AM', duration: '01:45', outcome: 'Follow Up', notes: 'Shared pricing quote. Client said they will review and respond tomorrow.' },
];

export default function Activities() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleTabChange = (e, newValue) => {
    setActiveTab(newValue);
    setSearch('');
    setPage(0);
  };

  // Filtered Call Logs
  const filteredCalls = useMemo(() => {
    return mockCallActivities.filter(item => 
      item.clientName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.telecallerName.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.outcome.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  // Filtered Logins
  const filteredLogins = useMemo(() => {
    return loginHistory.filter(item => 
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.employeeId.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.status.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.device.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  // Filtered Audits
  const filteredAudits = useMemo(() => {
    return activityTimeline.filter(item => 
      item.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      item.action.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);

  return (
    <Box>
      <PageHeader
        title="Activities"
        subtitle="Track system audit trails, access logs, and call activities"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Activities' }]}
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
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
        <Tab label="Call Activities" />
        <Tab label="Login Sessions" />
        <Tab label="Security & System Audits" />
      </Tabs>

      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField 
              size="small" 
              placeholder={activeTab === 0 ? "Search calls..." : (activeTab === 1 ? "Search users..." : "Search audits...")}
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260, flex: { xs: 1, sm: 'unset' } }}
              slotProps={{
                input: {
                  startAdornment: (
                     <InputAdornment position="start">
                       <i className="bi bi-search" style={{ fontSize: '0.95rem', color: '#9ca3af' }}></i>
                     </InputAdornment>
                  )
                }
              }}
            />
            <Box sx={{ flex: 1 }} />
            <ExportMenu onExport={(f) => showToast(`Exporting activities as ${f}...`, 'info')} />
          </Box>
        </CardContent>
      </Card>

      {/* Tab Contents */}
      {activeTab === 0 && (
        <Card>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Client Name</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Telecaller</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Call Date</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Time</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Duration</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Call Outcome</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCalls.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 600 }}>{row.clientName}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 26, height: 26, fontSize: '0.65rem', background: '#f1f5f9', color: '#475569' }}>
                          {getInitials(row.telecallerName)}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 500 }}>{row.telecallerName}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{formatDate(row.date)}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{row.time}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{row.duration}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <StatusChip status={row.outcome} />
                    </TableCell>
                    <TableCell sx={{ minWidth: 250 }}>
                      <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary' }}>{row.notes}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCalls.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Card>
      )}

      {activeTab === 1 && (
        <Card>
          <TableContainer>
            <Table size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Device Name</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>IP Address</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Login Time</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Session</TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap', fontWeight: 600, color: '#0343a8' }}>{row.employeeId}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', background: '#f1f5f9', color: '#475569' }}>
                          {getInitials(row.name)}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{row.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{row.device}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{row.ip}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{formatDate(row.loginTime.split('T')[0])} {row.loginTime.split('T')[1]}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>{row.sessionDuration}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <StatusChip status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLogins.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, p) => setPage(p)}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          />
        </Card>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {/* Security alerts panel */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <i className="bi bi-shield-fill-exclamation" style={{ color: '#ef4444' }}></i>
                  Security Alerts
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {securityAlerts.map(alert => (
                    <Box 
                      key={alert.id} 
                      sx={{ 
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid',
                        borderColor: alert.type === 'error' ? '#fecaca' : (alert.type === 'warning' ? '#fde047' : '#e2e8f0'),
                        backgroundColor: alert.type === 'error' ? '#fee2e2' : (alert.type === 'warning' ? '#fef9c3' : '#f8fafc'),
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', color: alert.type === 'error' ? '#991b1b' : (alert.type === 'warning' ? '#854d0e' : '#1e293b') }}>
                          {alert.title}
                        </Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                          {timeAgo(alert.time)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: '0.8125rem', color: alert.type === 'error' ? '#b91c1c' : (alert.type === 'warning' ? '#a16207' : '#475569') }}>
                        {alert.message}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Audit trail list */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>System Audit Log</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>User</TableCell>
                        <TableCell>Action performed</TableCell>
                        <TableCell align="center">Timestamp</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAudits.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                        <TableRow key={row.id} hover>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 24, height: 24, fontSize: '0.6rem', background: '#eaf4ff', color: '#0343a8' }}>
                                {getInitials(row.name)}
                              </Avatar>
                              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{row.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ fontSize: '0.8125rem' }}>{row.action}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {timeAgo(row.time)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={filteredAudits.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(e, p) => setPage(p)}
                  onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

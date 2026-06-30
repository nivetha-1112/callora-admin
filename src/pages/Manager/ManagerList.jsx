import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, LinearProgress, TableSortLabel
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { managers, departments, managerTeamPerformance } from '../../data/managerData';
import { telecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';

export default function ManagerList() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    return managers.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchDept = deptFilter === 'All' || m.department === deptFilter;
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    }).sort((a, b) => {
      const val = order === 'asc' ? 1 : -1;
      if (a[orderBy] < b[orderBy]) return -val;
      if (a[orderBy] > b[orderBy]) return val;
      return 0;
    });
  }, [debouncedSearch, deptFilter, statusFilter, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleView = (manager) => {
    setSelectedManager(manager);
    setDetailsOpen(true);
  };

  const assignedTelecallers = selectedManager
    ? telecallers.filter((t) => t.managerId === selectedManager.id)
    : [];

  return (
    <Box>
      <PageHeader
        title="Manager Management"
        subtitle="Manage and monitor all telecalling managers"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Managers' }]}
        actions={
          <Button variant="contained" startIcon={<i className="bi bi-plus-lg"></i>} onClick={() => setAddOpen(true)}
            sx={{ background: 'linear-gradient(135deg, #034cae, #0560d4)', px: 3 }}>
            Add Manager
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search managers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260, flex: { xs: 1, sm: 'unset' } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><i className="bi bi-search" style={{ fontSize: '0.95rem', color: '#9ca3af' }}></i></InputAdornment>,
              }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Department</InputLabel>
              <Select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} label="Department">
                <MenuItem value="All">All Departments</MenuItem>
                {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 130 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="All">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ flex: 1 }} />
            <ExportMenu onExport={(f) => alert(`Exporting as ${f}...`)} />
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>Manager ID</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleSort('name')}>Manager Name</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Email</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'department'} direction={orderBy === 'department' ? order : 'asc'} onClick={() => handleSort('department')}>Department</TableSortLabel></TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Telecallers</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mgr) => (
                <TableRow key={mgr.id} hover>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#034cae', whiteSpace: 'nowrap' }}>{mgr.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
                      <Avatar sx={{ width: 36, height: 36, fontSize: '0.8rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {getInitials(mgr.name)}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{mgr.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{mgr.email}</Typography></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{mgr.mobile}</Typography></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Chip label={mgr.department} size="small" sx={{ backgroundColor: '#eaf4ff', color: '#034cae', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip label={mgr.assignedTelecallers} size="small" sx={{ backgroundColor: '#f0fdf4', color: '#059669', fontWeight: 700, minWidth: 32 }} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><StatusChip status={mgr.status} /></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="View Details">
                        <IconButton size="small" onClick={() => handleView(mgr)} sx={{ color: '#64748b', '&:hover': { color: '#034cae', backgroundColor: '#eaf4ff' } }}>
                          <i className="bi bi-eye" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#d97706', backgroundColor: '#fef3c7' } }}>
                          <i className="bi bi-pencil" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" sx={{ color: '#64748b', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}>
                          <i className="bi bi-trash" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>

      {/* Manager Details Modal */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedManager && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 50, height: 50, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', fontSize: '1.1rem' }}>
                  {getInitials(selectedManager.name)}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{selectedManager.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedManager.id} • {selectedManager.department}</Typography>
                </Box>
              </Box>
              <IconButton onClick={() => setDetailsOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Info Cards */}
                <Grid size={12}>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Email', value: selectedManager.email, iconClass: 'bi bi-envelope' },
                      { label: 'Mobile', value: selectedManager.mobile, iconClass: 'bi bi-telephone' },
                      { label: 'Department', value: selectedManager.department, iconClass: 'bi bi-building' },
                      { label: 'Telecallers', value: selectedManager.assignedTelecallers, iconClass: 'bi bi-people' },
                    ].map((info) => (
                      <Grid size={{ xs: 6, sm: 3 }} key={info.label}>
                        <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f9fafb', textAlign: 'center' }}>
                          <Box sx={{ color: '#475569', mb: 0.5 }}>
                            <i className={info.iconClass} style={{ fontSize: '1.1rem' }}></i>
                          </Box>
                          <Typography variant="caption" color="text.secondary" display="block">{info.label}</Typography>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{info.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                {/* Performance Stats */}
                <Grid size={12}>
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: '#eaf4ff' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#034cae' }}>{selectedManager.totalCallsManaged.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Calls Managed</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: '#d1fae5' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>{selectedManager.leadConversion}%</Typography>
                        <Typography variant="body2" color="text.secondary">Lead Conversion</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: '#fef3c7' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#d97706' }}>{selectedManager.performance}%</Typography>
                        <Typography variant="body2" color="text.secondary">Performance Score</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Team Performance Chart */}
                <Grid size={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Team Performance</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={managerTeamPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="calls" fill="#034cae" radius={[4, 4, 0, 0]} barSize={24} name="Calls" />
                      <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Conversions" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>

                {/* Assigned Telecallers */}
                <Grid size={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Assigned Telecallers ({assignedTelecallers.length})</Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Total Calls</TableCell>
                          <TableCell>Interested</TableCell>
                          <TableCell>Converted</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedTelecallers.map((tc) => (
                          <TableRow key={tc.id} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                  {getInitials(tc.name)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{tc.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{tc.totalCalls}</TableCell>
                            <TableCell sx={{ color: '#10b981', fontWeight: 600 }}>{tc.interested}</TableCell>
                            <TableCell sx={{ color: '#059669', fontWeight: 600 }}>{tc.converted}</TableCell>
                            <TableCell><StatusChip status={tc.status} /></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Add Manager Modal */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Add New Manager</Typography>
          <IconButton onClick={() => setAddOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={6}><TextField fullWidth label="Full Name" size="small" /></Grid>
            <Grid size={6}><TextField fullWidth label="Email" size="small" type="email" /></Grid>
            <Grid size={6}><TextField fullWidth label="Mobile Number" size="small" /></Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select label="Department" defaultValue="">
                  {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddOpen(false)}
            sx={{ background: 'linear-gradient(135deg, #034cae, #0560d4)' }}>
            Add Manager
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

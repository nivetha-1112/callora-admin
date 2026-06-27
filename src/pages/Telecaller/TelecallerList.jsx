import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, TableSortLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { telecallers } from '../../data/telecallerData';
import { managers } from '../../data/managerData';
import { getInitials, formatDuration } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';

export default function TelecallerList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [addOpen, setAddOpen] = useState(false);
  const debouncedSearch = useDebounce(search);

  const filtered = useMemo(() => {
    return telecallers.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        t.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      const val = order === 'asc' ? 1 : -1;
      if (a[orderBy] < b[orderBy]) return -val;
      if (a[orderBy] > b[orderBy]) return val;
      return 0;
    });
  }, [debouncedSearch, statusFilter, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box>
      <PageHeader
        title="Telecaller Management"
        subtitle="Manage and monitor all telecalling agents"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Telecallers' }]}
        actions={
          <Button variant="contained" startIcon={<i className="bi bi-plus-lg"></i>} onClick={() => setAddOpen(true)}
            sx={{ background: 'linear-gradient(135deg, #034cae, #0560d4)', px: 3 }}>
            Add Telecaller
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="small" placeholder="Search telecallers..." value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260, flex: { xs: 1, sm: 'unset' } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><i className="bi bi-search" style={{ fontSize: '0.95rem', color: '#9ca3af' }}></i></InputAdornment> }}
            />
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>Emp ID</TableSortLabel></TableCell>
                <TableCell><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleSort('name')}>Name</TableSortLabel></TableCell>
                <TableCell>Manager</TableCell>
                <TableCell>Mobile</TableCell>
                <TableCell align="center">Clients</TableCell>
                <TableCell align="center">Total Calls</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center" sx={{ color: '#10b981' }}>Interested</TableCell>
                <TableCell align="center" sx={{ color: '#ef4444' }}>Not Int.</TableCell>
                <TableCell align="center" sx={{ color: '#f59e0b' }}>Ringing</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tc) => (
                <TableRow key={tc.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/telecallers/${tc.id}`)}>
                  <TableCell>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#034cae' }}>{tc.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {getInitials(tc.name)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{tc.name}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{tc.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{tc.managerName}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{tc.mobile}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{tc.totalClients}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600 }}>{tc.totalCalls}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2">{formatDuration(tc.totalDuration)}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>{tc.interested}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>{tc.notInterested}</Typography></TableCell>
                  <TableCell align="center"><Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b' }}>{tc.ringing}</Typography></TableCell>
                  <TableCell><StatusChip status={tc.status} /></TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="View">
                        <IconButton size="small" onClick={() => navigate(`/telecallers/${tc.id}`)} sx={{ color: '#034cae', '&:hover': { backgroundColor: '#eaf4ff' } }}>
                          <i className="bi bi-eye" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" sx={{ color: '#f59e0b', '&:hover': { backgroundColor: '#fef3c7' } }}>
                          <i className="bi bi-pencil" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" sx={{ color: '#ef4444', '&:hover': { backgroundColor: '#fee2e2' } }}>
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
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>

      {/* Add Telecaller Modal */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Add New Telecaller</Typography>
          <IconButton onClick={() => setAddOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={6}><TextField fullWidth label="Full Name" size="small" /></Grid>
            <Grid size={6}><TextField fullWidth label="Employee ID" size="small" /></Grid>
            <Grid size={6}><TextField fullWidth label="Email" size="small" type="email" /></Grid>
            <Grid size={6}><TextField fullWidth label="Mobile Number" size="small" /></Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Assign Manager</InputLabel>
                <Select label="Assign Manager" defaultValue="">
                  {managers.map((m) => <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={6}><TextField fullWidth label="Joining Date" size="small" type="date" InputLabelProps={{ shrink: true }} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={() => setAddOpen(false)}
            sx={{ background: 'linear-gradient(135deg, #034cae, #0560d4)' }}>
            Add Telecaller
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

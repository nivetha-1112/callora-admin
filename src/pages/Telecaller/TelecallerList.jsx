import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, TableSortLabel, Autocomplete
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { telecallers } from '../../data/telecallerData';
import { managers } from '../../data/managerData';
import { getInitials, formatDuration } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

export default function TelecallerList() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [telecallerList, setTelecallerList] = useState(telecallers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [addOpen, setAddOpen] = useState(false);
  const debouncedSearch = useDebounce(search);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    employeeId: '',
    managerId: '',
    joinDate: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    mobile: '',
    employeeId: ''
  });

  const handleFieldChange = (field, value) => {
    let finalValue = value;
    if (field === 'mobile') {
      // Keep only digits
      finalValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      if (finalValue.length > 10) {
        finalValue = finalValue.slice(0, 10);
      }
    }

    const newFormData = { ...formData, [field]: finalValue };
    setErrors((prev) => ({ ...prev, [field]: '' }));

    if (field === 'name' || field === 'email' || field === 'mobile') {
      const { name, email, mobile } = newFormData;
      if (name.trim() !== '' && email.trim() !== '' && mobile.trim() !== '') {
        if (!newFormData.employeeId) {
          newFormData.employeeId = `TC${String(telecallerList.length + 1).padStart(3, '0')}`;
        }
      }
    }

    setFormData(newFormData);
  };

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      employeeId: '',
      managerId: '',
      joinDate: ''
    });
    setErrors({
      name: '',
      email: '',
      mobile: '',
      employeeId: ''
    });
    setAddOpen(true);
  };

  const handleAddSubmit = () => {
    let hasError = false;
    const newErrors = { name: '', email: '', mobile: '', employeeId: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required';
      hasError = true;
    }

    if (!formData.employeeId.trim()) {
      newErrors.employeeId = 'Employee ID is required';
      hasError = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      hasError = true;
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Invalid email format';
      hasError = true;
    }

    const mobileDigits = formData.mobile.replace(/\D/g, '');
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
      hasError = true;
    } else if (mobileDigits.length !== 10) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits';
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      showToast('Please fix validation errors.', 'warning');
      return;
    }

    const selectedManager = managers.find((m) => m.id === formData.managerId);

    const newTelecaller = {
      id: formData.employeeId,
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      managerId: formData.managerId,
      managerName: selectedManager ? selectedManager.name : 'Unassigned',
      totalClients: 0,
      totalCalls: 0,
      totalDuration: 0,
      interested: 0,
      notInterested: 0,
      ringing: 0,
      followUp: 0,
      converted: 0,
      status: 'Active',
      joinDate: formData.joinDate || new Date().toISOString().split('T')[0],
      photo: null
    };

    setTelecallerList((prev) => [newTelecaller, ...prev]);
    showToast(`Telecaller ${formData.name} added successfully!`, 'success');
    setAddOpen(false);
  };

  const filtered = useMemo(() => {
    return telecallerList.filter((t) => {
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
  }, [telecallerList, debouncedSearch, statusFilter, orderBy, order]);

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
          <Button variant="contained" startIcon={<i className="bi bi-plus-lg"></i>} onClick={handleOpenAdd}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 3 }}>
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
            <Autocomplete
              size="small"
              value={statusFilter === 'All' ? 'All Status' : statusFilter}
              onChange={(event, newValue) => {
                if (newValue === 'All Status' || !newValue) {
                  setStatusFilter('All');
                } else {
                  setStatusFilter(newValue);
                }
              }}
              options={['All Status', 'Active', 'Inactive']}
              renderInput={(params) => <TextField {...params} label="Status" />}
              sx={{ minWidth: 150 }}
              disableClearable
            />
            <Box sx={{ flex: 1 }} />
            <ExportMenu onExport={(f) => showToast(`Exporting as ${f}...`, 'info')} />
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>Emp ID</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleSort('name')}>Name</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Manager</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Clients</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tc) => (
                <TableRow 
                  key={tc.id} 
                  hover 
                  onClick={() => navigate(`/telecallers/${tc.id}/clients`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>{tc.id}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
                      <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                        {getInitials(tc.name)}
                      </Avatar>
                      <Box sx={{ whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{tc.name}</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', whiteSpace: 'nowrap' }}>{tc.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{tc.managerName}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><StatusChip status={tc.status} /></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outlined" 
                      size="small"
                      startIcon={<i className="bi bi-people" style={{ fontSize: '0.85rem' }}></i>}
                      onClick={() => navigate(`/telecallers/${tc.id}/clients`)}
                      sx={{
                        borderColor: '#0343a8',
                        color: '#0343a8',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '6px',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#022d71',
                          backgroundColor: '#eaf4ff',
                        }
                      }}
                    >
                      Clients
                    </Button>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
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
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>

      {/* Add Telecaller Modal */}
      <Dialog 
        open={addOpen} 
        onClose={() => setAddOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Add New Telecaller</Typography>
          <IconButton onClick={() => setAddOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Full Name" 
                size="small" 
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Employee ID" 
                size="small" 
                value={formData.employeeId}
                onChange={(e) => handleFieldChange('employeeId', e.target.value)}
                error={!!errors.employeeId}
                helperText={errors.employeeId}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Email" 
                size="small" 
                type="email" 
                value={formData.email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Mobile Number" 
                size="small" 
                value={formData.mobile}
                onChange={(e) => handleFieldChange('mobile', e.target.value)}
                error={!!errors.mobile}
                helperText={errors.mobile}
                slotProps={{
                  htmlInput: {
                    maxLength: 10
                  }
                }}
              />
            </Grid>
            <Grid size={6}>
              <Autocomplete
                size="small"
                value={managers.find((m) => m.id === formData.managerId) || null}
                onChange={(event, newValue) => {
                  handleFieldChange('managerId', newValue ? newValue.id : '');
                }}
                options={managers}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => <TextField {...params} label="Assign Manager" />}
                fullWidth
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Joining Date" 
                size="small" 
                type="date"
                value={formData.joinDate}
                onChange={(e) => handleFieldChange('joinDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                slotProps={{
                  inputLabel: {
                    shrink: true
                  }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddSubmit}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)' }}>
            Add Telecaller
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

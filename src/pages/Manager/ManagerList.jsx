import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, TableSortLabel,
  Checkbox, ListItemText
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { managers, departments } from '../../data/managerData';
import { telecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

export default function ManagerList() {
  const { showToast } = useToast();
  const [managerList, setManagerList] = useState(managers);
  const [telecallerList, setTelecallerList] = useState(telecallers);
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

  // States for Add/Edit Form
  const [isEdit, setIsEdit] = useState(false);
  const [editingManagerId, setEditingManagerId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    assignedTelecallers: []
  });

  // States for CSV Bulk Upload
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleAssignClientClick = (tc) => {
    setSelectedFile(null);
    setUploadOpen(true);
  };

  const getAssignedCount = (mgrId) => {
    return telecallerList.filter((t) => t.managerId === mgrId).length;
  };

  const handleEditClick = (manager) => {
    const assignedIds = telecallerList
      .filter((tc) => tc.managerId === manager.id)
      .map((tc) => tc.id);

    setFormData({
      name: manager.name,
      email: manager.email,
      mobile: manager.mobile,
      department: manager.department,
      assignedTelecallers: assignedIds
    });
    setEditingManagerId(manager.id);
    setIsEdit(true);
    setAddOpen(true);
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      department: '',
      assignedTelecallers: []
    });
    setEditingManagerId(null);
    setIsEdit(false);
    setAddOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.department) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    let managerId = editingManagerId;

    if (isEdit) {
      setManagerList((prev) =>
        prev.map((m) =>
          m.id === editingManagerId
            ? { ...m, name: formData.name, email: formData.email, mobile: formData.mobile, department: formData.department }
            : m
        )
      );
    } else {
      const newId = `MGR${String(managerList.length + 1).padStart(3, '0')}`;
      managerId = newId;

      const newManager = {
        id: newId,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        department: formData.department,
        status: 'Active',
        totalCallsManaged: 0,
        leadConversion: 0,
        performance: 0
      };

      setManagerList((prev) => [...prev, newManager]);
    }

    // Update telecaller assignments
    setTelecallerList((prev) =>
      prev.map((tc) => {
        if (formData.assignedTelecallers.includes(tc.id)) {
          return { ...tc, managerId: managerId, managerName: formData.name };
        } else if (tc.managerId === managerId) {
          return { ...tc, managerId: null, managerName: '' };
        }
        return tc;
      })
    );

    setAddOpen(false);
  };

  // CSV Template downloader helper
  const downloadTemplate = () => {
    const csvContent = "Name,Email,Mobile,Department\nJohn Doe,john.doe@example.com,+91 99887 76699,Collections\nJane Smith,jane.smith@example.com,+91 99887 76688,Sales\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "manager_bulk_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      showToast('Please choose a CSV file first', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/);
      if (lines.length < 2) {
        showToast('CSV file is empty or missing headers', 'error');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf('name');
      const emailIdx = headers.indexOf('email');
      const mobileIdx = headers.indexOf('mobile');
      const deptIdx = headers.indexOf('department');

      if (nameIdx === -1 || emailIdx === -1 || mobileIdx === -1 || deptIdx === -1) {
        showToast('Invalid CSV headers. Must contain Name, Email, Mobile, Department', 'error');
        return;
      }

      const newManagers = [];
      let startIndex = managerList.length + 1;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cols = line.split(',').map(c => c.trim());
        if (cols.length < 4) continue;

        const name = cols[nameIdx];
        const email = cols[emailIdx];
        const mobile = cols[mobileIdx];
        const department = cols[deptIdx];

        const newId = `MGR${String(startIndex++).padStart(3, '0')}`;

        newManagers.push({
          id: newId,
          name,
          email,
          mobile,
          department,
          status: 'Active',
          totalCallsManaged: 0,
          leadConversion: 0,
          performance: 0
        });
      }

      if (newManagers.length === 0) {
        showToast('No valid rows found in the CSV file', 'error');
        return;
      }

      setManagerList((prev) => [...prev, ...newManagers]);
      showToast(`Successfully imported ${newManagers.length} managers!`, 'success');
      setUploadOpen(false);
      setSelectedFile(null);
    };
    reader.readAsText(selectedFile);
  };

  const filtered = useMemo(() => {
    return managerList.filter((m) => {
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
  }, [managerList, debouncedSearch, deptFilter, statusFilter, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleView = (manager) => {
    setSelectedManager(manager);
    setDetailsOpen(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setManagerList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    );
  };

  const activeManagerDetails = selectedManager
    ? managerList.find((m) => m.id === selectedManager.id) || selectedManager
    : null;

  const assignedTelecallers = activeManagerDetails
    ? telecallerList.filter((t) => t.managerId === activeManagerDetails.id)
    : [];

  return (
    <Box>
      <PageHeader
        title="Manager Management"
        subtitle="Manage and monitor all telecalling managers"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Managers' }]}
        actions={
          <Button variant="contained" startIcon={<i className="bi bi-plus-lg"></i>} onClick={handleAddClick}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 3 }}>
            Add Manager
          </Button>
        }
      />

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="small" placeholder="Search managers..." value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 260, flex: { xs: 1, sm: 'unset' } }}
              InputProps={{ startAdornment: <InputAdornment position="start"><i className="bi bi-search" style={{ fontSize: '0.95rem', color: '#9ca3af' }}></i></InputAdornment> }}
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
            <ExportMenu onExport={(f) => showToast(`Exporting as ${f}...`, 'info')} />
          </Box>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>Manager ID</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleSort('name')}>Manager Name</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Email</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'department'} direction={orderBy === 'department' ? order : 'asc'} onClick={() => handleSort('department')}>Department</TableSortLabel></TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Telecallers</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((mgr) => (
                <TableRow key={mgr.id} hover>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>{mgr.id}</Typography>
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
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{mgr.mobile}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip label={mgr.department} size="small" sx={{ backgroundColor: '#eaf4ff', color: '#0343a8', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Tooltip title="Click to view assigned telecallers" arrow>
                      <Chip
                        icon={<i className="bi bi-people-fill" style={{ color: '#059669', fontSize: '0.8rem', marginLeft: '6px' }}></i>}
                        label={getAssignedCount(mgr.id)}
                        size="small"
                        onClick={() => handleView(mgr)}
                        sx={{
                          backgroundColor: '#f0fdf4',
                          color: '#059669',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          pr: 0.5,
                          '&:hover': {
                            backgroundColor: '#d1fae5',
                            transform: 'scale(1.05)',
                          }
                        }}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Select
                      value={mgr.status}
                      onChange={(e) => handleStatusChange(mgr.id, e.target.value)}
                      size="small"
                      sx={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: mgr.status === 'Active' ? '#059669' : '#ef4444',
                        backgroundColor: mgr.status === 'Active' ? '#f0fdf4' : '#fee2e2',
                        border: `1px solid ${mgr.status === 'Active' ? '#10b981' : '#fecaca'}`,
                        borderRadius: '8px',
                        height: 24,
                        '& .MuiSelect-select': {
                          py: 0.5,
                          pl: 1.5,
                          pr: '24px !important',
                        },
                        '& .MuiOutlinedInput-notchedOutline': {
                          border: 'none',
                        },
                        '& .MuiSvgIcon-root': {
                          color: mgr.status === 'Active' ? '#059669' : '#ef4444',
                          right: '6px',
                          fontSize: '1rem',
                        }
                      }}
                    >
                      <MenuItem value="Active" sx={{ fontSize: '0.8125rem' }}>Active</MenuItem>
                      <MenuItem value="Inactive" sx={{ fontSize: '0.8125rem' }}>Inactive</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(mgr)} sx={{ color: '#64748b', '&:hover': { color: '#d97706', backgroundColor: '#fef3c7' } }}>
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

      {/* Manager Details Modal */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {activeManagerDetails && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>Manager Info: {activeManagerDetails.name}</Typography>
              <IconButton onClick={() => setDetailsOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                {/* Info Cards */}
                <Grid size={12}>
                  <Grid container spacing={2}>
                    {[
                      { label: 'Email', value: activeManagerDetails.email, iconClass: 'bi bi-envelope' },
                      { label: 'Mobile', value: activeManagerDetails.mobile, iconClass: 'bi bi-telephone' },
                      { label: 'Department', value: activeManagerDetails.department, iconClass: 'bi bi-building' },
                      { label: 'Telecallers', value: getAssignedCount(activeManagerDetails.id), iconClass: 'bi bi-people' },
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
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#0343a8' }}>{activeManagerDetails.totalCallsManaged.toLocaleString()}</Typography>
                        <Typography variant="body2" color="text.secondary">Total Clients</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: '#d1fae5' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#059669' }}>{activeManagerDetails.leadConversion}%</Typography>
                        <Typography variant="body2" color="text.secondary">Lead Conversion</Typography>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 4 }}>
                      <Box sx={{ textAlign: 'center', p: 2, borderRadius: 2, backgroundColor: '#fef3c7' }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#d97706' }}>{activeManagerDetails.performance}%</Typography>
                        <Typography variant="body2" color="text.secondary">Performance Score</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Assigned Telecallers */}
                <Grid size={12}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Assigned Telecallers ({assignedTelecallers.length})</Typography>
                  <TableContainer>
                    <Table size="small" sx={{ minWidth: 800 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Total Calls</TableCell>
                          <TableCell align="center" sx={{ color: '#10b981', whiteSpace: 'nowrap' }}>Interested</TableCell>
                          <TableCell align="center" sx={{ color: '#ef4444', whiteSpace: 'nowrap' }}>Not Int.</TableCell>
                          <TableCell align="center" sx={{ color: '#f59e0b', whiteSpace: 'nowrap' }}>Ringing</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {assignedTelecallers.map((tc) => (
                          <TableRow key={tc.id} hover>
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
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tc.mobile}</Typography></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tc.totalCalls}</Typography></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', whiteSpace: 'nowrap' }}>{tc.interested}</Typography></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444', whiteSpace: 'nowrap' }}>{tc.notInterested}</Typography></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b', whiteSpace: 'nowrap' }}>{tc.ringing}</Typography></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><StatusChip status={tc.status} /></TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<i className="bi bi-person-plus"></i>}
                                onClick={() => handleAssignClientClick(tc)}
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
                                Assign Client
                              </Button>
                            </TableCell>
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

      {/* Add/Edit Manager Modal */}
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
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {isEdit ? 'Edit Manager' : 'Add New Manager'}
          </Typography>
          <IconButton onClick={() => setAddOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2.5} sx={{ mt: 0 }}>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Full Name" 
                size="small" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Email" 
                size="small" 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
            </Grid>
            <Grid size={6}>
              <TextField 
                fullWidth 
                label="Mobile Number" 
                size="small" 
                value={formData.mobile} 
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} 
              />
            </Grid>
            <Grid size={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Department</InputLabel>
                <Select 
                  label="Department" 
                  value={formData.department} 
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                      }
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left'
                    }
                  }}
                >
                  {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={12}>
              <FormControl fullWidth size="small">
                <InputLabel id="assign-telecallers-label">Assign Telecallers</InputLabel>
                <Select
                  labelId="assign-telecallers-label"
                  id="assign-telecallers"
                  multiple
                  value={formData.assignedTelecallers}
                  onChange={(e) => setFormData({ ...formData, assignedTelecallers: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value })}
                  renderValue={(selected) => {
                    return selected.map(id => telecallerList.find(tc => tc.id === id)?.name).filter(Boolean).join(', ');
                  }}
                  label="Assign Telecallers"
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        maxHeight: 250,
                      }
                    },
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left'
                    },
                    transformOrigin: {
                      vertical: 'top',
                      horizontal: 'left'
                    }
                  }}
                >
                  {telecallerList.map((tc) => (
                    <MenuItem key={tc.id} value={tc.id}>
                      <Checkbox checked={formData.assignedTelecallers.indexOf(tc.id) > -1} size="small" />
                      <ListItemText 
                        primary={tc.name} 
                        secondary={`${tc.id} • ${tc.managerName ? `Under ${tc.managerName}` : 'Unassigned'}`} 
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                        secondaryTypographyProps={{ fontSize: '0.7rem' }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setAddOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)' }}>
            {isEdit ? 'Save Changes' : 'Add Manager'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Client Modal */}
      <Dialog 
        open={uploadOpen} 
        onClose={() => { setUploadOpen(false); setSelectedFile(null); }} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Assign Client</Typography>
          <IconButton onClick={() => { setUploadOpen(false); setSelectedFile(null); }}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
            {/* Instructions */}
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              Make sure the headers match the template format: <strong>Name, Email, Mobile, Department</strong>.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={downloadTemplate}
                startIcon={<i className="bi bi-download"></i>}
                sx={{ borderColor: '#0343a8', color: '#0343a8', '&:hover': { borderColor: '#022d71', backgroundColor: '#eaf4ff' } }}
              >
                Download Sample Template
              </Button>
            </Box>

            {/* File Picker Zone */}
            <Box sx={{ width: '100%', border: '1px dashed #cbd5e1', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: '#64748b' }}></i>
              <Button
                variant="contained"
                component="label"
                size="small"
                startIcon={<i className="bi bi-file-earmark-spreadsheet"></i>}
                sx={{ background: '#64748b', '&:hover': { background: '#475569' } }}
              >
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#059669', mt: 1 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setUploadOpen(false); setSelectedFile(null); }} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedFile}
            onClick={handleUploadSubmit}
            sx={{ 
              background: 'linear-gradient(135deg, #0343a8, #0454cc)',
              color: '#ffffff',
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, #0343a8, #0454cc)',
                color: '#ffffff',
                opacity: 0.6
              }
            }}
          >
            Assign Client
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

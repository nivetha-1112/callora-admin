import React, { useState, useMemo, useRef } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, InputAdornment, Dialog,
  DialogTitle, DialogContent, DialogActions, Grid, TableSortLabel,
  Checkbox, ListItemText, Autocomplete
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { managers } from '../../data/managerData';
import { telecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import useDebounce from '../../hooks/useDebounce';
import { useToast } from '../../context/ToastContext';

// Define static options for Roles
const roles = ['Super Admin', 'Admin', 'Manager'];

// Passcode digit input component
const PasscodeInput = ({ value, onChange, show }) => {
  const inputsRef = useRef([]);
  
  const handleCharChange = (index, char) => {
    // Only allow digits
    if (char && !/^\d+$/.test(char)) return;
    
    const newVal = [...value];
    newVal[index] = char;
    onChange(newVal);
    
    if (char && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
      } else {
        const newVal = [...value];
        newVal[index] = '';
        onChange(newVal);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <TextField
          key={i}
          inputRef={(el) => (inputsRef.current[i] = el)}
          value={value[i] || ''}
          onChange={(e) => handleCharChange(i, e.target.value.slice(-1))}
          onKeyDown={(e) => handleKeyDown(i, e)}
          type={show ? 'text' : 'password'}
          size="small"
          slotProps={{
            htmlInput: {
              style: {
                textAlign: 'center',
                padding: 0,
                width: '32px',
                height: '32px',
                fontWeight: 600,
                fontSize: '1rem',
              }
            }
          }}
          sx={{
            width: '45px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: '#ffffff',
            }
          }}
        />
      ))}
    </Box>
  );
};

export default function ManagerList() {
  const { showToast } = useToast();
  const [managerList, setManagerList] = useState(managers);
  const [telecallerList, setTelecallerList] = useState(telecallers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [selectedManager, setSelectedManager] = useState(null);
  const debouncedSearch = useDebounce(search);

  // viewMode can be 'list' | 'add' | 'edit'
  const [viewMode, setViewMode] = useState('list');
  const [isEdit, setIsEdit] = useState(false);
  const [editingManagerId, setEditingManagerId] = useState(null);
  
  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // States for Add/Edit Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    role: '',
    password: ['', '', '', ''],
    confirmPassword: ['', '', '', ''],
    status: 'Active',
    photo: null,
    assignedTelecallers: []
  });



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
      role: manager.role || 'Manager',
      password: ['', '', '', ''],
      confirmPassword: ['', '', '', ''],
      status: manager.status || 'Active',
      photo: manager.photo || null,
      assignedTelecallers: assignedIds
    });
    setEditingManagerId(manager.id);
    setIsEdit(true);
    setViewMode('edit');
  };

  const handleAddClick = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      role: '',
      password: ['', '', '', ''],
      confirmPassword: ['', '', '', ''],
      status: 'Active',
      photo: null,
      assignedTelecallers: []
    });
    setEditingManagerId(null);
    setIsEdit(false);
    setViewMode('add');
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.role) {
      showToast('Please fill in all required fields (Name, Email, Mobile, Role)', 'warning');
      return;
    }

    const pwdFilled = formData.password.join('');
    const confirmPwdFilled = formData.confirmPassword.join('');

    if (!isEdit && pwdFilled.length < 4) {
      showToast('Please enter a 4-digit password', 'warning');
      return;
    }

    if (pwdFilled.length > 0 && pwdFilled.length < 4) {
      showToast('Password must be exactly 4 digits', 'warning');
      return;
    }

    if (pwdFilled !== confirmPwdFilled) {
      showToast('Passwords do not match', 'error');
      return;
    }

    let managerId = editingManagerId;

    if (isEdit) {
      setManagerList((prev) =>
        prev.map((m) =>
          m.id === editingManagerId
            ? { 
                ...m, 
                name: formData.name, 
                email: formData.email, 
                mobile: formData.mobile, 
                role: formData.role, 
                status: formData.status,
                photo: formData.photo 
              }
            : m
        )
      );
      showToast('Manager updated successfully!', 'success');
    } else {
      const newId = `MGR${String(managerList.length + 1).padStart(3, '0')}`;
      managerId = newId;

      const newManager = {
        id: newId,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        role: formData.role,
        status: formData.status,
        photo: formData.photo,
        assignedTelecallers: formData.assignedTelecallers.length,
        joinDate: new Date().toISOString().split('T')[0],
        totalCallsManaged: 0,
        leadConversion: 0,
        performance: 100
      };

      setManagerList((prev) => [...prev, newManager]);
      showToast('Manager added successfully!', 'success');
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

    setViewMode('list');
  };



  const filtered = useMemo(() => {
    return managerList.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.email.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchStatus = statusFilter === 'All' || m.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      const val = order === 'asc' ? 1 : -1;
      if (a[orderBy] < b[orderBy]) return -val;
      if (a[orderBy] > b[orderBy]) return val;
      return 0;
    });
  }, [managerList, debouncedSearch, statusFilter, orderBy, order]);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
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

  if (viewMode !== 'list') {
    // REDESIGNED ADD/EDIT MANAGER PAGE (FULL-SCREEN FORM VIEW)
    return (
      <Box>
        {/* Banner with modern theme-aligned blue gradient */}
        <Box 
          sx={{ 
            background: 'linear-gradient(135deg, #0343a8 0%, #022d71 100%)', 
            p: 3, 
            borderRadius: '12px 12px 0 0', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            boxShadow: '0 4px 20px rgba(3,67,168,0.15)'
          }}
        >
          <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.05em' }}>
            {viewMode === 'add' ? 'ADD MANAGER' : 'EDIT MANAGER'}
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => setViewMode('list')}
            startIcon={<i className="bi bi-arrow-left"></i>}
            sx={{ 
              backgroundColor: '#ffffff', 
              color: '#0343a8', 
              fontWeight: 700,
              fontSize: '0.875rem',
              px: 2.5,
              py: 0.75,
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: '#eaf4ff',
                color: '#022d71'
              }
            }}
          >
            List Manager
          </Button>
        </Box>

        {/* Form Container Card */}
        <Card sx={{ borderRadius: '0 0 12px 12px', border: '1px solid #e2e8f0', borderTop: 'none', p: 4, backgroundColor: '#ffffff' }}>
          <Typography variant="h5" sx={{ color: '#0343a8', fontWeight: 700, mb: 4 }}>
            Basic Information
          </Typography>

          <Grid container spacing={4}>
            {/* Left side - Profile Image Picker */}
            <Grid size={{ xs: 12, md: 3 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, alignSelf: 'flex-start' }}>
                Profile Image <span style={{ color: '#ef4444' }}>*</span>
              </Typography>
              <Box 
                sx={{ 
                  width: 160, 
                  height: 160, 
                  borderRadius: '16px', 
                  border: '1px solid #cbd5e1', 
                  backgroundColor: '#f8fafc',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  overflow: 'hidden',
                  mb: 2,
                  position: 'relative'
                }}
              >
                {formData.photo ? (
                  <img 
                    src={formData.photo} 
                    alt="Profile Preview" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <i className="bi bi-person" style={{ fontSize: '4.5rem', color: '#94a3b8' }}></i>
                )}
              </Box>
              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: '#0343a8',
                  color: '#0343a8',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#022d71',
                    backgroundColor: '#eaf4ff'
                  }
                }}
              >
                Choose
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData({ ...formData, photo: event.target.result });
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                />
              </Button>
            </Grid>

            {/* Right side - Fields Grid */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Grid container spacing={3}>
                {/* Row 1 */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Name <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <TextField 
                    fullWidth 
                    placeholder="Enter Full Name" 
                    size="small" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Email <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <TextField 
                    fullWidth 
                    placeholder="Enter Email Address" 
                    size="small" 
                    type="email"
                    value={formData.email} 
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Mobile Number <span style={{ color: '#ef4444' }}>*</span>
                  </Typography>
                  <TextField 
                    fullWidth 
                    placeholder="Enter Phone Number" 
                    size="small" 
                    value={formData.mobile} 
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} 
                  />
                </Grid>

                 {/* Row 2 */}
                 <Grid size={{ xs: 12, md: 4 }}>
                   <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                     Role <span style={{ color: '#ef4444' }}>*</span>
                   </Typography>
                   <Autocomplete
                     size="small"
                     value={formData.role || null}
                     onChange={(event, newValue) => {
                       setFormData({ ...formData, role: newValue || '' });
                     }}
                     options={roles}
                     renderInput={(params) => <TextField {...params} label="Role" placeholder="Select Role" />}
                     fullWidth
                   />
                 </Grid>
                 
                 <Grid size={{ xs: 12, md: 4 }}>
                   <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                     Password <span style={{ color: '#ef4444' }}>*</span>
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <PasscodeInput 
                       value={formData.password} 
                       onChange={(val) => setFormData({ ...formData, password: val })} 
                       show={showPassword} 
                     />
                     <IconButton onClick={() => setShowPassword(!showPassword)} size="small">
                       <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"} style={{ fontSize: '1.15rem', color: '#64748b' }}></i>
                     </IconButton>
                   </Box>
                 </Grid>
                 
                 <Grid size={{ xs: 12, md: 4 }}>
                   <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                     Confirm Password <span style={{ color: '#ef4444' }}>*</span>
                   </Typography>
                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                     <PasscodeInput 
                       value={formData.confirmPassword} 
                       onChange={(val) => setFormData({ ...formData, confirmPassword: val })} 
                       show={showConfirmPassword} 
                     />
                     <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} size="small">
                       <i className={showConfirmPassword ? "bi bi-eye" : "bi bi-eye-slash"} style={{ fontSize: '1.15rem', color: '#64748b' }}></i>
                     </IconButton>
                   </Box>
                 </Grid>
 
                 {/* Row 3 */}
                 <Grid size={{ xs: 12, md: 4 }}>
                   <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                     Status
                   </Typography>
                   <Autocomplete
                     size="small"
                     value={formData.status}
                     onChange={(event, newValue) => {
                       setFormData({ ...formData, status: newValue || 'Active' });
                     }}
                     options={['Active', 'Inactive']}
                     renderInput={(params) => <TextField {...params} label="Status" />}
                     fullWidth
                     disableClearable
                   />
                 </Grid>
 
                 {/* Telecaller assignment grid inside form (aligned beside Status) */}
                 <Grid size={{ xs: 12, md: 8 }}>
                   <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                     Assign Telecallers
                   </Typography>
                   <Autocomplete
                     multiple
                     size="small"
                     value={telecallerList.filter(tc => formData.assignedTelecallers.includes(tc.id))}
                     onChange={(event, newValue) => {
                       setFormData({ ...formData, assignedTelecallers: newValue.map(item => item.id) });
                     }}
                     options={telecallerList}
                     disableCloseOnSelect
                     getOptionLabel={(option) => option.name}
                     renderOption={(props, option, { selected }) => {
                       const { key, ...optionProps } = props;
                       return (
                         <li key={option.id} {...optionProps}>
                           <Checkbox checked={selected} size="small" style={{ marginRight: 8 }} />
                           <ListItemText
                             primary={option.name}
                             secondary={`${option.id} • ${option.managerName ? `Under ${option.managerName}` : 'Unassigned'}`}
                             primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                             secondaryTypographyProps={{ fontSize: '0.7rem' }}
                           />
                         </li>
                       );
                     }}
                     renderInput={(params) => (
                       <TextField {...params} label="Assign Telecallers" placeholder="Select Telecallers" />
                     )}
                     slotProps={{
                       paper: {
                         sx: {
                           maxHeight: 250,
                         }
                       }
                     }}
                     fullWidth
                   />
                 </Grid>

              </Grid>
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 5 }}>
            <Button 
              variant="outlined" 
              onClick={() => setViewMode('list')}
              sx={{ 
                borderColor: '#cbd5e1', 
                color: '#64748b',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                px: 4.5,
                py: 1,
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              sx={{ 
                background: 'linear-gradient(135deg, #0343a8, #0454cc)',
                color: '#ffffff',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                px: 4.5,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #023687, #0343a8)',
                }
              }}
            >
              Save
            </Button>
          </Box>
        </Card>
      </Box>
    );
  }

  // viewMode === 'list' (DEFAULT TABLE VIEW)
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

      {/* Filters (Removed Department dropdown filter) */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField size="small" placeholder="Search managers..." value={search} onChange={(e) => setSearch(e.target.value)}
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

      {/* Table (Removed Department column) */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'id'} direction={orderBy === 'id' ? order : 'asc'} onClick={() => handleSort('id')}>Manager ID</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleSort('name')}>Manager Name</TableSortLabel></TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Email</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Role</TableCell>
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
                      <Avatar 
                        src={mgr.photo}
                        sx={{ width: 36, height: 36, fontSize: '0.8rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                      >
                        {!mgr.photo && getInitials(mgr.name)}
                      </Avatar>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{mgr.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>{mgr.email}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{mgr.mobile}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip label={mgr.role || 'Manager'} size="small" sx={{ backgroundColor: '#eaf4ff', color: '#0343a8', fontWeight: 500 }} />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip
                      icon={<i className="bi bi-people-fill" style={{ color: '#059669', fontSize: '0.8rem', marginLeft: '6px' }}></i>}
                      label={getAssignedCount(mgr.id)}
                      size="small"
                      sx={{
                        backgroundColor: '#f0fdf4',
                        color: '#059669',
                        fontWeight: 700,
                        pr: 0.5
                      }}
                    />
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

    </Box>
  );
}

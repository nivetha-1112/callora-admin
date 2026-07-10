import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, LinearProgress, InputAdornment, Autocomplete
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import { managers as initialUsers } from '../../data/managerData';
import { telecallers as initialTelecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function TeamTarget() {
  const { showToast } = useToast();
  const [usersList] = useState(initialUsers);
  const [telecallersList] = useState(initialTelecallers);
  
  // Team Creation states
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamFormData, setTeamFormData] = useState({
    teamName: '',
    managerId: '',
    memberIds: [],
    targetCalls: '',
    targetConvs: '',
    period: 'July 2026'
  });
  
  // Targets list state formatted with Group Name, Manager Count, Telecaller Count, Client Amount
  const [targets, setTargets] = useState([
    { id: 'TGT001', userId: 'MGR001', name: 'Arun Patel', role: 'Manager', groupName: 'Group A', managerCount: 1, telecallerCount: 12, clientAmount: 50000, targetCalls: 16000, achievedCalls: 15240, targetConvs: 500, achievedConvs: 480, period: 'July 2026' },
    { id: 'TGT002', userId: 'MGR002', name: 'Sunita Sharma', role: 'Manager', groupName: 'Group B', managerCount: 1, telecallerCount: 8, clientAmount: 40000, targetCalls: 12000, achievedCalls: 12100, targetConvs: 400, achievedConvs: 385, period: 'July 2026' },
    { id: 'TGT003', userId: 'MGR003', name: 'Deepak Verma', role: 'Admin', groupName: 'Group C', managerCount: 2, telecallerCount: 15, clientAmount: 65000, targetCalls: 20000, achievedCalls: 18900, targetConvs: 600, achievedConvs: 540, period: 'July 2026' },
    { id: 'TGT004', userId: 'MGR004', name: 'Kavita Iyer', role: 'Manager', groupName: 'Group A', managerCount: 1, telecallerCount: 10, clientAmount: 35000, targetCalls: 10000, achievedCalls: 9870, targetConvs: 300, achievedConvs: 285, period: 'July 2026' },
    { id: 'TGT005', userId: 'MGR006', name: 'Rekha Nair', role: 'Manager', groupName: 'Group B', managerCount: 1, telecallerCount: 11, clientAmount: 48000, targetCalls: 15000, achievedCalls: 13400, targetConvs: 450, achievedConvs: 410, period: 'July 2026' },
  ]);

  // Form dialog state
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    targetCalls: '',
    targetConvs: '',
    period: 'July 2026'
  });

  // Date filters state
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-31');

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Active details view state for displaying group/individual section
  const [activeGroup, setActiveGroup] = useState(null);

  const filteredTargets = useMemo(() => {
    return targets.filter(tgt => {
      let tgtStart = '2026-07-01';
      let tgtEnd = '2026-07-31';
      if (tgt.period === 'August 2026') {
        tgtStart = '2026-08-01';
        tgtEnd = '2026-08-31';
      } else if (tgt.period === 'September 2026') {
        tgtStart = '2026-09-01';
        tgtEnd = '2026-09-30';
      }

      if (fromDate && tgtEnd < fromDate) return false;
      if (toDate && tgtStart > toDate) return false;
      return true;
    });
  }, [targets, fromDate, toDate]);

  // Telecallers for the active group
  const activeTelecallers = useMemo(() => {
    if (!activeGroup) return [];
    return telecallersList.filter(tc => !activeGroup.userId || tc.managerId === activeGroup.userId);
  }, [activeGroup, telecallersList]);

  const handleAddClick = () => {
    setFormData({
      userId: '',
      targetCalls: '',
      targetConvs: '',
      period: 'July 2026'
    });
    setIsEdit(false);
    setOpen(true);
  };

  const handleEditClick = (target) => {
    setFormData({
      userId: target.userId,
      targetCalls: target.targetCalls,
      targetConvs: target.targetConvs,
      period: target.period
    });
    setEditingId(target.id);
    setIsEdit(true);
    setOpen(true);
  };

  const handleDeleteClick = (id) => {
    setTargets(prev => prev.filter(t => t.id !== id));
    showToast('Target deleted successfully!', 'success');
  };

  const handleSave = () => {
    if (!formData.userId || !formData.targetCalls || !formData.targetConvs) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const selectedUser = usersList.find(u => u.id === formData.userId);
    if (!selectedUser) return;

    if (isEdit) {
      setTargets(prev => prev.map(t => t.id === editingId ? {
        ...t,
        userId: formData.userId,
        name: selectedUser.name,
        role: selectedUser.role,
        targetCalls: Number(formData.targetCalls),
        targetConvs: Number(formData.targetConvs),
        period: formData.period
      } : t));
      showToast('Target updated successfully!', 'success');
    } else {
      const newTarget = {
        id: `TGT${String(targets.length + 1).padStart(3, '0')}`,
        userId: formData.userId,
        name: selectedUser.name,
        role: selectedUser.role,
        groupName: selectedUser.group || 'Group A',
        managerCount: 1,
        telecallerCount: selectedUser.assignedTelecallers || 5,
        clientAmount: 30000,
        targetCalls: Number(formData.targetCalls),
        achievedCalls: 0,
        targetConvs: Number(formData.targetConvs),
        achievedConvs: 0,
        period: formData.period
      };
      setTargets(prev => [...prev, newTarget]);
      showToast('Target assigned successfully!', 'success');
    }
    setOpen(false);
  };

  const handleCreateTeamClick = () => {
    setTeamFormData({
      teamName: '',
      managerId: '',
      memberIds: [],
      targetCalls: '',
      targetConvs: '',
      period: 'July 2026'
    });
    setTeamOpen(true);
  };

  const handleCreateTeamSubmit = () => {
    if (!teamFormData.teamName || !teamFormData.managerId || teamFormData.memberIds.length === 0) {
      showToast('Please fill in all team fields and select at least one member', 'warning');
      return;
    }
    const manager = usersList.find(u => u.id === teamFormData.managerId);
    
    const newTarget = {
      id: `TGT${String(targets.length + 1).padStart(3, '0')}`,
      userId: teamFormData.managerId,
      name: `${teamFormData.teamName} (${manager ? manager.name : 'Unknown'})`,
      role: 'Team',
      groupName: 'Group B',
      managerCount: 1,
      telecallerCount: teamFormData.memberIds.length,
      clientAmount: 45000,
      targetCalls: Number(teamFormData.targetCalls) || 15000,
      achievedCalls: 0,
      targetConvs: Number(teamFormData.targetConvs) || 400,
      achievedConvs: 0,
      period: teamFormData.period
    };
    
    setTargets(prev => [...prev, newTarget]);
    showToast(`Team "${teamFormData.teamName}" created successfully with ${teamFormData.memberIds.length} members!`, 'success');
    setTeamOpen(false);
  };

  if (activeGroup) {
    const completedAvenue = activeGroup.clientAmount * 0.95; // 95% completion rate
    return (
      <Box>
        {/* Back Button aligned to right and styled blue */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setActiveGroup(null)}
            sx={{
              background: 'linear-gradient(135deg, #0343a8, #0454cc)',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '8px',
              px: 3,
            }}
          >
            Back to Team Targets
          </Button>
        </Box>

        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
          Target Details for {activeGroup.groupName}
        </Typography>

        <Grid container spacing={3}>
          {/* Section 1: Group Team Target */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0343a8' }}>
                  <i className="bi bi-people-fill" style={{ marginRight: 10 }}></i>
                  Group Team Target
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Manager Name</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5, color: '#1e293b' }}>
                      {activeGroup.name}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Telecallers List</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                      {activeTelecallers.map(tc => (
                        <Chip 
                          key={tc.id} 
                          label={tc.name} 
                          size="small" 
                          sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Avenue Target</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, color: '#0f172a' }}>
                      ₹{activeGroup.clientAmount.toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Completed Avenue Target</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#16a34a', mt: 0.5 }}>
                      ₹{completedAvenue.toLocaleString('en-IN')}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Avenue Achievement Rate</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                        95%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={95}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e2e8f0',
                        '& .MuiLinearProgress-bar': { backgroundColor: '#16a34a' }
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Section 2: Individual Target */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0343a8' }}>
                  <i className="bi bi-person-fill" style={{ marginRight: 10 }}></i>
                  Individual Target
                </Typography>

                <TableContainer sx={{ maxHeight: 350, border: '1px solid #e2e8f0', borderRadius: 2 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Member Name</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Target Calls</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Completed Target</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Achievement</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activeTelecallers.map(tc => {
                        const targetCalls = 1500;
                        const completed = tc.totalCalls || 1200;
                        const rate = Math.round((completed / targetCalls) * 100);
                        return (
                          <TableRow key={tc.id} hover>
                            <TableCell sx={{ fontWeight: 500 }}>{tc.name}</TableCell>
                            <TableCell align="right">{targetCalls.toLocaleString()}</TableCell>
                            <TableCell align="right">{completed.toLocaleString()}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700, color: rate >= 90 ? '#16a34a' : '#0343a8' }}>
                              {rate}%
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Team Target"
        subtitle="Set calling targets and track team completion metrics"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Team Target' }]}
        actions={
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="outlined" 
              startIcon={<i className="bi bi-people-fill"></i>} 
              onClick={handleCreateTeamClick}
              sx={{ 
                borderColor: '#cbd5e1', 
                color: '#64748b', 
                fontWeight: 600, 
                textTransform: 'none', 
                borderRadius: '8px',
                px: 2.5,
                '&:hover': { 
                  borderColor: '#94a3b8', 
                  backgroundColor: '#f1f5f9' 
                } 
              }}
            >
              Create Team
            </Button>
            <Button 
              variant="contained" 
              startIcon={<i className="bi bi-plus-lg"></i>} 
              onClick={handleAddClick}
              sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', px: 3 }}
            >
              Assign Target
            </Button>
          </Box>
        }
      />

      {/* Date Range Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              type="date"
              label="From Date"
              size="small"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 180 }}
            />
            <TextField
              type="date"
              label="To Date"
              size="small"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(0);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              sx={{ minWidth: 180 }}
            />
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setFromDate('');
                setToDate('');
              }}
              sx={{ 
                borderColor: '#cbd5e1', 
                color: '#64748b', 
                textTransform: 'none', 
                height: 40,
                borderRadius: '6px',
                '&:hover': {
                  borderColor: '#94a3b8',
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              Clear Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Targets Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>S.No</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Group Name</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Manager Count</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Telecaller Count</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Client Amount</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTargets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tgt, index) => (
                <TableRow key={tgt.id} hover>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#64748b' }}>
                      {page * rowsPerPage + index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Chip 
                      label={tgt.groupName} 
                      size="small" 
                      onClick={() => setActiveGroup(tgt)}
                      sx={{ 
                        backgroundColor: '#eaf4ff', 
                        color: '#0343a8', 
                        fontWeight: 700,
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: '#0343a8',
                          color: '#ffffff'
                        }
                      }} 
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{tgt.managerCount}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{tgt.telecallerCount}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#16a34a' }}>
                      ₹{tgt.clientAmount.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => handleEditClick(tgt)} sx={{ color: '#64748b', '&:hover': { color: '#d97706', backgroundColor: '#fef3c7' } }}>
                          <i className="bi bi-pencil" style={{ fontSize: '0.95rem' }}></i>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDeleteClick(tgt.id)} sx={{ color: '#64748b', '&:hover': { color: '#ef4444', backgroundColor: '#fee2e2' } }}>
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
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={filteredTargets.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>

      {/* Target Allocation Modal */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #022d71 0%, #0343a8 100%)', 
          color: '#ffffff',
          fontWeight: 700,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {isEdit ? 'Edit assigned Target' : 'Assign monthly Target'}
          </Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: '#ffffff' }}>
            <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* User selector */}
          <FormControl fullWidth size="small" disabled={isEdit}>
            <InputLabel id="select-user-label">Select User</InputLabel>
            <Select
              labelId="select-user-label"
              value={formData.userId}
              label="Select User"
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            >
              {usersList.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.name} ({u.role})</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Target Period */}
          <FormControl fullWidth size="small">
            <InputLabel id="select-period-label">Period</InputLabel>
            <Select
              labelId="select-period-label"
              value={formData.period}
              label="Period"
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
            >
              <MenuItem value="July 2026">July 2026</MenuItem>
              <MenuItem value="August 2026">August 2026</MenuItem>
              <MenuItem value="September 2026">September 2026</MenuItem>
            </Select>
          </FormControl>

          {/* Target Calls */}
          <TextField
            label="Call Target"
            size="small"
            type="number"
            placeholder="e.g. 10000"
            value={formData.targetCalls}
            onChange={(e) => setFormData({ ...formData, targetCalls: e.target.value })}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="bi bi-telephone" style={{ color: '#64748b' }}></i>
                  </InputAdornment>
                )
              }
            }}
          />

          {/* Target Conversions */}
          <TextField
            label="Conversion Target"
            size="small"
            type="number"
            placeholder="e.g. 300"
            value={formData.targetConvs}
            onChange={(e) => setFormData({ ...formData, targetConvs: e.target.value })}
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <i className="bi bi-gift" style={{ color: '#64748b' }}></i>
                  </InputAdornment>
                )
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: '1px solid #f1f5f9' }}>
          <Button 
            variant="outlined" 
            onClick={() => setOpen(false)}
            sx={{ borderColor: '#cbd5e1', color: '#64748b', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Save Target
          </Button>
        </DialogActions>
      </Dialog>

      {/* Team Creation Modal */}
      <Dialog 
        open={teamOpen} 
        onClose={() => setTeamOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #022d71 0%, #0343a8 100%)', 
          color: '#ffffff',
          fontWeight: 700,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Create New Team
          </Typography>
          <IconButton onClick={() => setTeamOpen(false)} sx={{ color: '#ffffff' }}>
            <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Team Name */}
          <TextField
            label="Team Name"
            size="small"
            placeholder="e.g. Sales Alpha"
            value={teamFormData.teamName}
            onChange={(e) => setTeamFormData({ ...teamFormData, teamName: e.target.value })}
            fullWidth
          />

          {/* Select Manager */}
          <FormControl fullWidth size="small">
            <InputLabel id="select-team-manager-label">Select Manager</InputLabel>
            <Select
              labelId="select-team-manager-label"
              value={teamFormData.managerId}
              label="Select Manager"
              onChange={(e) => setTeamFormData({ ...teamFormData, managerId: e.target.value })}
            >
              {usersList.map(u => (
                <MenuItem key={u.id} value={u.id}>{u.name} ({u.role})</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Select Team Members (Multi-select) */}
          <Autocomplete
            multiple
            size="small"
            options={telecallersList}
            getOptionLabel={(option) => option.name}
            value={telecallersList.filter(t => teamFormData.memberIds.includes(t.id))}
            onChange={(event, newValue) => {
              setTeamFormData({ ...teamFormData, memberIds: newValue.map(item => item.id) });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Team Members" placeholder="Add members..." />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip
                  label={option.name}
                  size="small"
                  {...getTagProps({ index })}
                  sx={{ backgroundColor: '#eaf4ff', color: '#0343a8', fontWeight: 600 }}
                />
              ))
            }
          />

          {/* Target Period */}
          <FormControl fullWidth size="small">
            <InputLabel id="team-period-label">Period</InputLabel>
            <Select
              labelId="team-period-label"
              value={teamFormData.period}
              label="Period"
              onChange={(e) => setTeamFormData({ ...teamFormData, period: e.target.value })}
            >
              <MenuItem value="July 2026">July 2026</MenuItem>
              <MenuItem value="August 2026">August 2026</MenuItem>
              <MenuItem value="September 2026">September 2026</MenuItem>
            </Select>
          </FormControl>

          {/* Target Calls */}
          <TextField
            label="Call Target"
            size="small"
            type="number"
            placeholder="e.g. 15000"
            value={teamFormData.targetCalls}
            onChange={(e) => setTeamFormData({ ...teamFormData, targetCalls: e.target.value })}
            fullWidth
          />

          {/* Target Conversions */}
          <TextField
            label="Conversion Target"
            size="small"
            type="number"
            placeholder="e.g. 450"
            value={teamFormData.targetConvs}
            onChange={(e) => setTeamFormData({ ...teamFormData, targetConvs: e.target.value })}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, gap: 1.5, borderTop: '1px solid #f1f5f9' }}>
          <Button 
            variant="outlined" 
            onClick={() => setTeamOpen(false)}
            sx={{ borderColor: '#cbd5e1', color: '#64748b', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleCreateTeamSubmit}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Create Team
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

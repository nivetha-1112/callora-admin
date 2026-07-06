import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, IconButton, Tooltip, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid, LinearProgress, InputAdornment, Autocomplete
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip as ReTooltip, ResponsiveContainer, Legend
} from 'recharts';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { managers as initialUsers } from '../../data/managerData';
import { telecallers as initialTelecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

// Mock monthly historical target data
const targetHistoryData = [
  { month: 'Jan', targetCalls: 4000, actualCalls: 3800, targetConvs: 120, actualConvs: 110 },
  { month: 'Feb', targetCalls: 4000, actualCalls: 4200, targetConvs: 120, actualConvs: 130 },
  { month: 'Mar', targetCalls: 4500, actualCalls: 4400, targetConvs: 140, actualConvs: 135 },
  { month: 'Apr', targetCalls: 4500, actualCalls: 4600, targetConvs: 140, actualConvs: 142 },
  { month: 'May', targetCalls: 5000, actualCalls: 4800, targetConvs: 160, actualConvs: 150 },
  { month: 'Jun', targetCalls: 5000, actualCalls: 5120, targetConvs: 160, actualConvs: 165 },
];

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
  
  // Targets list state (pre-populating some targets for mockup)
  const [targets, setTargets] = useState([
    { id: 'TGT001', userId: 'MGR001', name: 'Arun Patel', role: 'Manager', targetCalls: 16000, achievedCalls: 15240, targetConvs: 500, achievedConvs: 480, period: 'July 2026' },
    { id: 'TGT002', userId: 'MGR002', name: 'Sunita Sharma', role: 'Manager', targetCalls: 12000, achievedCalls: 12100, targetConvs: 400, achievedConvs: 385, period: 'July 2026' },
    { id: 'TGT003', userId: 'MGR003', name: 'Deepak Verma', role: 'Admin', targetCalls: 20000, achievedCalls: 18900, targetConvs: 600, achievedConvs: 540, period: 'July 2026' },
    { id: 'TGT004', userId: 'MGR004', name: 'Kavita Iyer', role: 'Manager', targetCalls: 10000, achievedCalls: 9870, targetConvs: 300, achievedConvs: 285, period: 'July 2026' },
    { id: 'TGT005', userId: 'MGR006', name: 'Rekha Nair', role: 'Manager', targetCalls: 15000, achievedCalls: 13400, targetConvs: 450, achievedConvs: 410, period: 'July 2026' },
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

  const filteredTargets = useMemo(() => {
    return targets.filter(tgt => {
      // Map period to start/end dates for filtering
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

  // Stats
  const stats = useMemo(() => {
    const totalCallsTarget = filteredTargets.reduce((acc, curr) => acc + Number(curr.targetCalls), 0);
    const totalCallsAchieved = filteredTargets.reduce((acc, curr) => acc + Number(curr.achievedCalls), 0);
    const totalConvsTarget = filteredTargets.reduce((acc, curr) => acc + Number(curr.targetConvs), 0);
    const totalConvsAchieved = filteredTargets.reduce((acc, curr) => acc + Number(curr.achievedConvs), 0);

    const callRate = totalCallsTarget ? Math.round((totalCallsAchieved / totalCallsTarget) * 100) : 0;
    const convRate = totalConvsTarget ? Math.round((totalConvsAchieved / totalConvsTarget) * 100) : 0;

    return {
      callsTarget: totalCallsTarget,
      callsAchieved: totalCallsAchieved,
      callsAchievementRate: callRate,
      convTarget: totalConvsTarget,
      convAchieved: totalConvsAchieved,
      convAchievementRate: convRate
    };
  }, [filteredTargets]);

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

  const chartData = useMemo(() => {
    return filteredTargets.map(t => {
      const completionRate = t.targetCalls ? Math.round((t.achievedCalls / t.targetCalls) * 100) : 0;
      return {
        name: t.name,
        target: t.targetCalls,
        achieved: t.achievedCalls,
        rate: completionRate
      };
    });
  }, [filteredTargets]);

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

      {/* Target Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Calls Target */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Call Target</Typography>
                <Avatar sx={{ backgroundColor: '#eaf4ff', color: '#0343a8', width: 38, height: 38 }}>
                  <i className="bi bi-telephone-outbound-fill" style={{ fontSize: '1rem' }}></i>
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                {stats.callsTarget.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Achieved: <b>{stats.callsAchieved.toLocaleString()}</b></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Calls Achievement rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Call Achievement Rate</Typography>
                <Avatar sx={{ backgroundColor: '#f0fdf4', color: '#16a34a', width: 38, height: 38 }}>
                  <i className="bi bi-percent" style={{ fontSize: '1rem' }}></i>
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#16a34a', mb: 1 }}>
                {stats.callsAchievementRate}%
              </Typography>
              <Box sx={{ width: '100%', mt: 1.5 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.callsAchievementRate} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    backgroundColor: '#e2e8f0', 
                    '& .MuiLinearProgress-bar': { backgroundColor: '#16a34a' } 
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Target */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Conversion Target</Typography>
                <Avatar sx={{ backgroundColor: '#fdf2f8', color: '#db2777', width: 38, height: 38 }}>
                  <i className="bi bi-graph-up-arrow" style={{ fontSize: '1rem' }}></i>
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>
                {stats.convTarget.toLocaleString()}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">Achieved: <b>{stats.convAchieved.toLocaleString()}</b></Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversion Achievement Rate */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Conv. Achievement Rate</Typography>
                <Avatar sx={{ backgroundColor: '#faf5ff', color: '#9333ea', width: 38, height: 38 }}>
                  <i className="bi bi-award" style={{ fontSize: '1rem' }}></i>
                </Avatar>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, color: '#9333ea', mb: 1 }}>
                {stats.convAchievementRate}%
              </Typography>
              <Box sx={{ width: '100%', mt: 1.5 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.convAchievementRate} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    backgroundColor: '#e2e8f0', 
                    '& .MuiLinearProgress-bar': { backgroundColor: '#9333ea' } 
                  }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Target Progress Charts */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Calls Progress Chart */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Calls vs Target Calls</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Comparison of monthly target limits and actual calls placed</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={targetHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="targetCalls" fill="#cbd5e1" name="Target Calls" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="actualCalls" fill="#0343a8" name="Actual Calls" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* User Achievement Rates */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>Individual Progress</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Call target completion percentages</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {filteredTargets.map((tgt) => {
                  const rate = tgt.targetCalls ? Math.round((tgt.achievedCalls / tgt.targetCalls) * 100) : 0;
                  const isSuccess = rate >= 90;
                  const isWarning = rate < 80;
                  
                  return (
                    <Box key={tgt.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{tgt.name}</Typography>
                        <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: isSuccess ? '#16a34a' : (isWarning ? '#ea580c' : '#0343a8') }}>
                          {rate}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(rate, 100)} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3, 
                          backgroundColor: '#f1f5f9',
                          '& .MuiLinearProgress-bar': { 
                            backgroundColor: isSuccess ? '#16a34a' : (isWarning ? '#ea580c' : '#0343a8') 
                          } 
                        }} 
                      />
                    </Box>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Targets Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Target ID</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>User Name</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Role</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Target Period</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Target Calls</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Achieved Calls</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Target Convs</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Achieved Convs</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Achievement</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTargets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tgt) => {
                const completionRate = tgt.targetCalls ? Math.round((tgt.achievedCalls / tgt.targetCalls) * 100) : 0;
                let statusLabel = 'On Track';
                let statusColor = '#0343a8';
                let statusBg = '#eaf4ff';

                if (completionRate >= 95) {
                  statusLabel = 'Achieved';
                  statusColor = '#16a34a';
                  statusBg = '#f0fdf4';
                } else if (completionRate < 80) {
                  statusLabel = 'Behind';
                  statusColor = '#ef4444';
                  statusBg = '#fee2e2';
                }

                return (
                  <TableRow key={tgt.id} hover>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>{tgt.id}</Typography>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, whiteSpace: 'nowrap' }}>
                        <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                          {getInitials(tgt.name)}
                        </Avatar>
                        <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap' }}>{tgt.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Chip label={tgt.role} size="small" sx={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 500 }} />
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tgt.period}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tgt.targetCalls.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tgt.achievedCalls.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tgt.targetConvs.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tgt.achievedConvs.toLocaleString()}</Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Chip 
                        label={`${completionRate}% (${statusLabel})`} 
                        size="small" 
                        sx={{ backgroundColor: statusBg, color: statusColor, fontWeight: 700 }} 
                      />
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
                );
              })}
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

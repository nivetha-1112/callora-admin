import React, { useState, useMemo } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Chip, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import PageHeader from '../../components/PageHeader/PageHeader';
import { getInitials } from '../../utils/helpers';
import { telecallers } from '../../data/telecallerData';
import { managers } from '../../data/managerData';
import { mockClients } from '../../data/clientManagementData';

export default function Dashboard() {
  const navigate = useNavigate();
  const [topPerformerTab, setTopPerformerTab] = useState('telecallers');

  // Group Targets Data
  const groupTargets = useMemo(() => [
    { groupName: 'Group A', weeklyCalls: 12000, monthlyAmount: 245000 },
    { groupName: 'Group B', weeklyCalls: 9500, monthlyAmount: 185000 },
    { groupName: 'Group C', weeklyCalls: 8000, monthlyAmount: 150000 },
    { groupName: 'Group D', weeklyCalls: 6500, monthlyAmount: 125000 },
  ], []);

  // Count stats derived from real data
  const countStats = useMemo(() => [
    {
      label: 'Total Managers',
      value: managers.length,
      active: managers.filter(m => m.status === 'Active').length,
      iconClass: 'bi bi-person-badge',
      color: '#0343a8',
      bgColor: '#eaf4ff',
      borderColor: '#d6e9ff',
      path: '/users',
    },
    {
      label: 'Total Telecallers',
      value: telecallers.length,
      active: telecallers.filter(tc => tc.status === 'Active').length,
      iconClass: 'bi bi-headset',
      color: '#7c3aed',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      path: '/users',
    },
    {
      label: 'Total Clients',
      value: mockClients.length,
      active: mockClients.filter(c => c.currentStatus !== 'Not Interested').length,
      iconClass: 'bi bi-people',
      color: '#059669',
      bgColor: '#ecfdf5',
      borderColor: '#a7f3d0',
      path: '/assign-client',
    },
    {
      label: 'Total Groups',
      value: groupTargets.length,
      active: groupTargets.length,
      iconClass: 'bi bi-grid',
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      path: '/team-target',
    },
  ], [groupTargets]);

  // Top 3 Performance Data
  const top3Managers = useMemo(() => {
    return [...managers]
      .filter(m => m.status === 'Active')
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 3);
  }, []);

  const top3Telecallers = useMemo(() => {
    return [...telecallers]
      .filter(tc => tc.status === 'Active')
      .sort((a, b) => b.converted - a.converted)
      .slice(0, 3);
  }, []);

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your telecalling operations overview."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]}
      />

      {/* Count Stat Boxes */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {countStats.map((stat) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.label}>
            <Card
              className="animate-fade-in-up"
              onClick={() => navigate(stat.path)}
              sx={{
                cursor: 'pointer',
                border: `3px solid ${stat.borderColor}`,
                transition: 'all 0.25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 24px ${stat.color}22`,
                  borderColor: stat.color,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Avatar sx={{ width: 48, height: 48, bgcolor: stat.bgColor, border: `2.5px solid ${stat.borderColor}` }}>
                    <i className={stat.iconClass} style={{ fontSize: '1.3rem', color: stat.color }}></i>
                  </Avatar>
                  <Chip
                    label={`${stat.active} Active`}
                    size="small"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      border: `1px solid ${stat.borderColor}`,
                    }}
                  />
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475569', mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Target & Performance Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Group Targets */}
        <Grid size={{ xs: 12 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Group Targets</Typography>
                <IconButton size="small" onClick={() => navigate('/team-target')}>
                  <i className="bi bi-arrow-right" style={{ fontSize: '1rem', color: '#0343a8' }}></i>
                </IconButton>
              </Box>
              
              <TableContainer sx={{ border: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Group</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Weekly Target</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Monthly Target</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupTargets.map((group) => (
                      <TableRow key={group.groupName} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell sx={{ fontWeight: 700, py: 1.5, px: 1, color: '#1e293b' }}>
                          <Chip 
                            label={group.groupName} 
                            size="small" 
                            sx={{ backgroundColor: '#eaf4ff', color: '#0343a8', fontWeight: 700, fontSize: '0.7rem', height: 20 }} 
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#475569', fontWeight: 600, py: 1.5, px: 1, fontSize: '0.8125rem' }}>
                          {group.weeklyCalls.toLocaleString('en-IN')} calls
                        </TableCell>
                        <TableCell align="right" sx={{ color: '#16a34a', fontWeight: 700, py: 1.5, px: 1, fontSize: '0.8125rem' }}>
                          ₹{group.monthlyAmount.toLocaleString('en-IN')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>


        {/* Top 3 Performers */}
        <Grid size={{ xs: 12 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Top Performers</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, backgroundColor: '#f1f5f9', p: 0.5, borderRadius: 2 }}>
                  <Button
                    size="small"
                    onClick={() => setTopPerformerTab('telecallers')}
                    sx={{
                      fontSize: '0.65rem',
                      textTransform: 'none',
                      py: 0.5,
                      px: 1.2,
                      minWidth: 'auto',
                      borderRadius: 1.5,
                      fontWeight: topPerformerTab === 'telecallers' ? 700 : 500,
                      backgroundColor: topPerformerTab === 'telecallers' ? '#ffffff' : 'transparent',
                      color: topPerformerTab === 'telecallers' ? '#0343a8' : '#64748b',
                      boxShadow: topPerformerTab === 'telecallers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      '&:hover': {
                        backgroundColor: topPerformerTab === 'telecallers' ? '#ffffff' : '#e2e8f0',
                      }
                    }}
                  >
                    Telecallers
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setTopPerformerTab('managers')}
                    sx={{
                      fontSize: '0.65rem',
                      textTransform: 'none',
                      py: 0.5,
                      px: 1.2,
                      minWidth: 'auto',
                      borderRadius: 1.5,
                      fontWeight: topPerformerTab === 'managers' ? 700 : 500,
                      backgroundColor: topPerformerTab === 'managers' ? '#ffffff' : 'transparent',
                      color: topPerformerTab === 'managers' ? '#0343a8' : '#64748b',
                      boxShadow: topPerformerTab === 'managers' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                      '&:hover': {
                        backgroundColor: topPerformerTab === 'managers' ? '#ffffff' : '#e2e8f0',
                      }
                    }}
                  >
                    Managers
                  </Button>
                </Box>
              </Box>

              <TableContainer sx={{ border: 'none' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Rank & Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Performance</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569', fontSize: '0.75rem', px: 1 }}>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(topPerformerTab === 'telecallers' ? top3Telecallers : top3Managers).map((item, idx) => {
                      const rank = idx + 1;
                      const badgeStyles = [
                        { bg: 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)', color: '#78350f', border: '1px solid #fbbf24' }, // Gold
                        { bg: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)', color: '#334155', border: '1px solid #94a3b8' }, // Silver
                        { bg: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)', color: '#7c2d12', border: '1px solid #f97316' }, // Bronze
                      ][idx];

                      return (
                        <TableRow key={item.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ py: 1, px: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              {/* Rank Badge */}
                              <Avatar sx={{ 
                                width: 22, 
                                height: 22, 
                                fontSize: '0.65rem', 
                                fontWeight: 800, 
                                background: badgeStyles.bg, 
                                color: badgeStyles.color, 
                                border: badgeStyles.border 
                              }}>
                                {rank}
                              </Avatar>
                              
                              <Box>
                                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.3, color: '#1e293b' }}>{item.name}</Typography>
                                <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                                  {topPerformerTab === 'telecallers' ? `under ${item.managerName}` : item.group}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="center" sx={{ py: 1, px: 1 }}>
                            <Chip 
                              label={topPerformerTab === 'telecallers' ? `${item.converted} Conv.` : `${item.performance}%`}
                              size="small"
                              sx={{
                                height: 20,
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                backgroundColor: idx === 0 ? '#ecfdf5' : idx === 1 ? '#eff6ff' : '#fcf6e4',
                                color: idx === 0 ? '#059669' : idx === 1 ? '#2563eb' : '#d97706',
                                border: `1px solid ${idx === 0 ? '#a7f3d0' : idx === 1 ? '#bfdbfe' : '#fde68a'}`,
                              }}
                            />
                          </TableCell>
                          <TableCell align="right" sx={{ py: 1, px: 1 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569' }}>
                              {topPerformerTab === 'telecallers' ? `${item.totalCalls.toLocaleString()} calls` : `${item.totalCallsManaged.toLocaleString()} managed`}
                            </Typography>
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

      {/* Quick Actions */}
      <Card className="animate-fade-in-up" sx={{ animationDelay: '0.65s', opacity: 0, animationFillMode: 'forwards' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Add User', iconClass: 'bi bi-person-plus', path: '/users' },
              { label: 'Assign Client', iconClass: 'bi bi-person-plus-fill', path: '/assign-client' },
              { label: 'Team Target', iconClass: 'bi bi-crosshair', path: '/team-target' },
              { label: 'View Reports', iconClass: 'bi bi-bar-chart-line', path: '/reports' },
            ].map((action) => (
              <Grid size={{ xs: 6, sm: 3 }} key={action.label}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate(action.path)}
                  sx={{
                    py: 2.5,
                    borderColor: '#e5e7eb',
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#0343a8',
                      backgroundColor: '#eaf4ff',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(3,76,174,0.1)',
                    },
                  }}
                >
                  <Avatar sx={{ width: 44, height: 44, backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 2 }}>
                    <i className={action.iconClass} style={{ fontSize: '1.2rem', color: '#475569' }}></i>
                  </Avatar>
                  <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: 'text.primary' }}>
                    {action.label}
                  </Typography>
                </Button>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

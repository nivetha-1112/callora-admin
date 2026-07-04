import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, Button, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend } from 'recharts';

import StatCard from '../../components/StatCard/StatCard';
import StatusChip from '../../components/StatusChip/StatusChip';
import PageHeader from '../../components/PageHeader/PageHeader';
import { dashboardStats, dailyCallData, telecallerPerformance, leadStatusData, monthlyCallReport, recentLoginActivities, recentCallLogs, latestTelecallers } from '../../data/dashboardData';
import { formatDate, timeAgo, getInitials, getStatusColor } from '../../utils/helpers';
import { telecallers } from '../../data/telecallerData';
import { mockClients } from '../../data/clientManagementData';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your telecalling operations overview."
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]}
      />

      {/* Stats Grid */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {dashboardStats.map((stat, index) => (
          <Grid size={{ xs: 6, sm: 6, md: 3 }} key={stat.id}>
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              iconClass={stat.iconClass}
              color={stat.color}
              delay={index}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Daily Call Activity */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>Daily Call Activity</Typography>
                  <Typography variant="body2" color="text.secondary">This week's call performance</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#0343a8' }} />
                    <Typography variant="caption" color="text.secondary">Connected</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <Typography variant="caption" color="text.secondary">Missed</Typography>
                  </Box>
                </Box>
              </Box>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dailyCallData}>
                  <defs>
                    <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0343a8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0343a8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMissed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <ReTooltip
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }}
                  />
                  <Area type="monotone" dataKey="connected" stroke="#0343a8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorConnected)" />
                  <Area type="monotone" dataKey="missed" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorMissed)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Status Pie */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.35s', opacity: 0, animationFillMode: 'forwards', height: '100%' }}>
            <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Lead Status</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Distribution overview</Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={leadStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {leadStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {leadStatusData.map((item) => (
                  <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Second Chart Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Telecaller Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Telecaller Performance</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Top performers this month</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={telecallerPerformance} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }} />
                  <Bar dataKey="calls" fill="#0343a8" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Call Report */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.45s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>Monthly Call Report</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Calls vs Target</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyCallReport}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 13 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Bar dataKey="calls" fill="#0343a8" radius={[4, 4, 0, 0]} barSize={16} name="Actual Calls" />
                  <Bar dataKey="target" fill="#d6e9ff" radius={[4, 4, 0, 0]} barSize={16} name="Target" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activities Row */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Recent Login Activities */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Recent Logins</Typography>
                <IconButton size="small" onClick={() => navigate('/logout-report')}>
                  <i className="bi bi-arrow-right" style={{ fontSize: '1rem', color: '#0343a8' }}></i>
                </IconButton>
              </Box>
              {recentLoginActivities.slice(0, 5).map((activity) => (
                <Box
                  key={activity.id}
                  onClick={() => navigate('/logout-report')}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5,
                    borderBottom: '1px solid #f3f4f6',
                    cursor: 'pointer',
                    borderRadius: 1.5,
                    px: 1,
                    mx: -1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      transform: 'translateX(4px)'
                    },
                    '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                    {getInitials(activity.name)}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.3 }}>{activity.name}</Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{activity.action} • {activity.device}</Typography>
                  </Box>
                  <Typography sx={{ fontSize: '0.7rem', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                    {timeAgo(activity.time)}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Call Logs */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.55s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Recent Calls</Typography>
                <IconButton size="small" onClick={() => navigate('/reports')}>
                  <i className="bi bi-arrow-right" style={{ fontSize: '1rem', color: '#0343a8' }}></i>
                </IconButton>
              </Box>
              {recentCallLogs.slice(0, 5).map((log) => {
                const cl = mockClients.find(c => c.clientName.toLowerCase() === log.client.toLowerCase());
                const tcId = cl ? cl.telecallerId : (telecallers.find(t => t.name.toLowerCase() === log.telecaller.toLowerCase())?.id || 'TC001');
                const clientId = cl ? cl.id : 'CLI101';

                return (
                  <Box
                    key={log.id}
                    onClick={() => navigate(`/telecallers/${tcId}/clients/${clientId}`)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5,
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      borderRadius: 1.5,
                      px: 1,
                      mx: -1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                        transform: 'translateX(4px)'
                      },
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
                      <i className="bi bi-telephone-inbound" style={{ fontSize: '0.9rem', color: '#475569' }}></i>
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.3 }}>{log.client}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>by {log.telecaller} • {log.duration}</Typography>
                    </Box>
                    <StatusChip status={log.status} size="small" />
                  </Box>
                );
              })}
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Telecallers */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card className="animate-fade-in-up" sx={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>New Telecallers</Typography>
                <IconButton size="small" onClick={() => navigate('/telecallers')}>
                  <i className="bi bi-arrow-right" style={{ fontSize: '1rem', color: '#0343a8' }}></i>
                </IconButton>
              </Box>
              {latestTelecallers.map((tcItem) => {
                const tc = telecallers.find(t => t.name.toLowerCase() === tcItem.name.toLowerCase());
                const tcId = tc ? tc.id : 'TC001';

                return (
                  <Box
                    key={tcItem.id}
                    onClick={() => navigate(`/telecallers/${tcId}/clients`)}
                    sx={{
                      display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5,
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      borderRadius: 1.5,
                      px: 1,
                      mx: -1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: '#f1f5f9',
                        transform: 'translateX(4px)'
                      },
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Avatar sx={{ width: 34, height: 34, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                      {getInitials(tcItem.name)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, lineHeight: 1.3 }}>{tcItem.name}</Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>{tcItem.department} • Joined {formatDate(tcItem.joinDate)}</Typography>
                    </Box>
                    <StatusChip status={tcItem.status} size="small" />
                  </Box>
                );
              })}
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
              { label: 'Add Manager', iconClass: 'bi bi-person-plus', path: '/managers' },
              { label: 'Add Telecaller', iconClass: 'bi bi-headset', path: '/telecallers' },
              { label: 'View Reports', iconClass: 'bi bi-bar-chart-line', path: '/reports' },
              { label: 'Export Data', iconClass: 'bi bi-download', path: '/reports' },
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

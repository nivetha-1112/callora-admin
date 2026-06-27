import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Avatar, Chip, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Tabs, Tab, Divider, List, ListItem, ListItemText, ListItemIcon, IconButton
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer } from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import StatCard from '../../components/StatCard/StatCard';
import { telecallers, telecallerClients, telecallerDailyPerformance, callHistory, followUpReminders } from '../../data/telecallerData';
import { getInitials, formatDate, formatDateTime, formatDuration } from '../../utils/helpers';

export default function TelecallerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const tc = telecallers.find((t) => t.id === id) || telecallers[0];
  const conversionRate = tc ? ((tc.converted / tc.totalCalls) * 100).toFixed(1) : 0;

  return (
    <Box>
      <PageHeader
        title={tc.name}
        subtitle={`Employee ID: ${tc.id}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Telecallers', path: '/telecallers' },
          { label: tc.name },
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<i className="bi bi-arrow-left"></i>} onClick={() => navigate('/telecallers')}
              sx={{ borderColor: '#e5e7eb', color: 'text.secondary' }}>
              Back
            </Button>
            <ExportMenu onExport={(f) => alert(`Exporting as ${f}...`)} />
          </Box>
        }
      />

      {/* Profile Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar sx={{ width: 72, height: 72, fontSize: '1.5rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                  {getInitials(tc.name)}
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>{tc.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <i className="bi bi-person-badge" style={{ fontSize: '0.9rem', marginRight: '4px' }}></i> Manager: {tc.managerName}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <StatusChip status={tc.status} />
                    <Chip label={tc.id} size="small" sx={{ backgroundColor: '#eaf4ff', color: '#034cae', fontWeight: 600 }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: true }}>
              <Grid container spacing={2}>
                {[
                  { iconClass: 'bi bi-envelope', label: 'Email', value: tc.email },
                  { iconClass: 'bi bi-telephone', label: 'Mobile', value: tc.mobile },
                  { iconClass: 'bi bi-calendar-event', label: 'Joined', value: formatDate(tc.joinDate) },
                ].map((info) => (
                  <Grid size={{ xs: 12, sm: 4 }} key={info.label}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                      <Box sx={{ color: '#475569' }}><i className={info.iconClass} style={{ fontSize: '1.05rem' }}></i></Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{info.label}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{info.value}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {[
          { title: 'Total Calls', value: tc.totalCalls, color: '#034cae', iconClass: 'bi bi-telephone-outbound' },
          { title: 'Total Talk Time', value: formatDuration(tc.totalDuration), color: '#6366f1', iconClass: 'bi bi-clock' },
          { title: 'Conversion Rate', value: `${conversionRate}%`, color: '#10b981', iconClass: 'bi bi-graph-up' },
          { title: 'Total Clients', value: tc.totalClients, color: '#f59e0b', iconClass: 'bi bi-journal-text' },
        ].map((stat, i) => (
          <Grid size={{ xs: 6, md: 3 }} key={stat.title}>
            <StatCard {...stat} delay={i} />
          </Grid>
        ))}
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{
            px: 2,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem' },
            '& .Mui-selected': { color: '#034cae' },
            '& .MuiTabs-indicator': { backgroundColor: '#034cae' },
          }}>
            <Tab label="Client List" />
            <Tab label="Call History" />
            <Tab label="Performance" />
            <Tab label="Follow-Up Reminders" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Client List Tab */}
          {tab === 0 && (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Call Duration</TableCell>
                    <TableCell>Last Contact</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Follow-up Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {telecallerClients.map((client) => (
                    <TableRow key={client.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ width: 30, height: 30, fontSize: '0.7rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                            {getInitials(client.clientName)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{client.clientName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{client.phone}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{client.callDuration}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{formatDate(client.lastContact)}</Typography></TableCell>
                      <TableCell><StatusChip status={client.callStatus} /></TableCell>
                      <TableCell>
                        <Typography variant="body2" color={client.followUpDate ? 'text.primary' : 'text.secondary'}>
                          {client.followUpDate ? formatDate(client.followUpDate) : '—'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Call History Tab */}
          {tab === 1 && (
            <Box>
              {callHistory.map((call) => (
                <Box
                  key={call.id}
                  sx={{
                    display: 'flex', alignItems: 'flex-start', gap: 2, py: 2,
                    borderBottom: '1px solid #f3f4f6', '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36, backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', mt: 0.5 }}>
                    <i className="bi bi-clock-history" style={{ fontSize: '1rem', color: '#475569' }}></i>
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{call.client}</Typography>
                      <StatusChip status={call.status} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{call.notes}</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        <i className="bi bi-clock" style={{ fontSize: '0.75rem', marginRight: '4px', verticalAlign: 'middle' }}></i>
                        {formatDateTime(call.time)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        <i className="bi bi-telephone" style={{ fontSize: '0.75rem', marginRight: '4px', verticalAlign: 'middle' }}></i>
                        {call.duration}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Performance Tab */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Daily Performance This Week</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={telecallerDailyPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Line type="monotone" dataKey="calls" stroke="#034cae" strokeWidth={2.5} dot={{ fill: '#034cae', r: 4 }} name="Calls" />
                      <Line type="monotone" dataKey="conversions" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 4 }} name="Conversions" />
                    </LineChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {[
                      { label: 'Interested', value: tc.interested, color: '#10b981', total: tc.totalCalls },
                      { label: 'Not Interested', value: tc.notInterested, color: '#ef4444', total: tc.totalCalls },
                      { label: 'Follow Up', value: tc.followUp, color: '#3b82f6', total: tc.totalCalls },
                      { label: 'Converted', value: tc.converted, color: '#059669', total: tc.totalCalls },
                      { label: 'Ringing', value: tc.ringing, color: '#f59e0b', total: tc.totalCalls },
                    ].map((item) => (
                      <Box key={item.label}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{item.label}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 6, borderRadius: 3, backgroundColor: '#f3f4f6', overflow: 'hidden' }}>
                          <Box sx={{ width: `${(item.value / item.total) * 100}%`, height: '100%', borderRadius: 3, backgroundColor: item.color, transition: 'width 1s ease' }} />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Follow-Up Reminders Tab */}
          {tab === 3 && (
            <Box>
              {followUpReminders.map((rem) => (
                <Box
                  key={rem.id}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2, py: 2,
                    borderBottom: '1px solid #f3f4f6', '&:last-child': { borderBottom: 'none' },
                  }}
                >
                  <Avatar sx={{
                    width: 40, height: 40,
                    backgroundColor: rem.priority === 'High' ? '#fee2e2' : rem.priority === 'Medium' ? '#fef3c7' : '#d1fae5',
                    color: rem.priority === 'High' ? '#ef4444' : rem.priority === 'Medium' ? '#f59e0b' : '#10b981',
                  }}>
                    <i className="bi bi-bell-fill" style={{ fontSize: '1.1rem' }}></i>
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{rem.client}</Typography>
                    <Typography variant="body2" color="text.secondary">{rem.notes}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{formatDate(rem.date)}</Typography>
                    <Typography variant="caption" color="text.secondary">{rem.time}</Typography>
                  </Box>
                  <Chip label={rem.priority} size="small" sx={{
                    backgroundColor: rem.priority === 'High' ? '#fee2e2' : rem.priority === 'Medium' ? '#fef3c7' : '#d1fae5',
                    color: rem.priority === 'High' ? '#ef4444' : rem.priority === 'Medium' ? '#f59e0b' : '#10b981',
                    fontWeight: 600,
                  }} />
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

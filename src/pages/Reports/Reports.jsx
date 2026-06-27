import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Tabs, Tab, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, Button, Rating
} from '@mui/material';
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, ResponsiveContainer, Legend
} from 'recharts';

import PageHeader from '../../components/PageHeader/PageHeader';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import {
  dailyReportData, weeklyReportData, monthlyReportData,
  telecallerReport, managerReport, leadConversionData
} from '../../data/reportsData';
import { formatDuration, getInitials } from '../../utils/helpers';

const COLORS = ['#034cae', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export default function Reports() {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="View and export detailed performance reports"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Reports' }]}
        actions={<ExportMenu onExport={(f) => alert(`Exporting ${f} report...`)} />}
      />

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{
            px: 2,
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.875rem', minHeight: 52 },
            '& .Mui-selected': { color: '#034cae' },
            '& .MuiTabs-indicator': { backgroundColor: '#034cae', height: 3, borderRadius: '3px 3px 0 0' },
          }}>
            <Tab label="Daily Report" />
            <Tab label="Weekly Report" />
            <Tab label="Monthly Report" />
            <Tab label="Telecaller Performance" />
            <Tab label="Manager Performance" />
            <Tab label="Lead Conversion" />
          </Tabs>
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Daily Report */}
          {tab === 0 && (
            <Box>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Hourly Call Distribution — Today</Typography>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={dailyReportData}>
                      <defs>
                        <linearGradient id="dailyGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#034cae" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="#034cae" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" iconSize={8} />
                      <Area type="monotone" dataKey="calls" stroke="#034cae" strokeWidth={2} fill="url(#dailyGrad)" name="Total Calls" />
                      <Area type="monotone" dataKey="connected" stroke="#10b981" strokeWidth={2} fill="transparent" name="Connected" />
                      <Area type="monotone" dataKey="missed" stroke="#ef4444" strokeWidth={2} fill="transparent" name="Missed" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Today's Summary</Typography>
                  {[
                    { label: 'Total Calls', value: dailyReportData.reduce((s, d) => s + d.calls, 0), color: '#034cae' },
                    { label: 'Connected', value: dailyReportData.reduce((s, d) => s + d.connected, 0), color: '#10b981' },
                    { label: 'Missed', value: dailyReportData.reduce((s, d) => s + d.missed, 0), color: '#ef4444' },
                    { label: 'Connection Rate', value: `${((dailyReportData.reduce((s, d) => s + d.connected, 0) / dailyReportData.reduce((s, d) => s + d.calls, 0)) * 100).toFixed(1)}%`, color: '#6366f1' },
                  ].map((item) => (
                    <Box key={item.label} sx={{ p: 2, mb: 1.5, borderRadius: 2, backgroundColor: `${item.color}08`, border: `1px solid ${item.color}15` }}>
                      <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: item.color }}>{item.value}</Typography>
                    </Box>
                  ))}
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Weekly Report */}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Weekly Performance Breakdown</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={weeklyReportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar dataKey="calls" fill="#034cae" radius={[4, 4, 0, 0]} barSize={20} name="Total Calls" />
                  <Bar dataKey="interested" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Interested" />
                  <Bar dataKey="converted" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} name="Converted" />
                </BarChart>
              </ResponsiveContainer>
              <TableContainer sx={{ mt: 3 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell align="center">Total Calls</TableCell>
                      <TableCell align="center">Interested</TableCell>
                      <TableCell align="center">Not Interested</TableCell>
                      <TableCell align="center">Converted</TableCell>
                      <TableCell align="center">Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {weeklyReportData.map((row) => (
                      <TableRow key={row.day} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{row.day}</TableCell>
                        <TableCell align="center">{row.calls}</TableCell>
                        <TableCell align="center" sx={{ color: '#10b981', fontWeight: 600 }}>{row.interested}</TableCell>
                        <TableCell align="center" sx={{ color: '#ef4444', fontWeight: 600 }}>{row.notInterested}</TableCell>
                        <TableCell align="center" sx={{ color: '#6366f1', fontWeight: 600 }}>{row.converted}</TableCell>
                        <TableCell align="center">{formatDuration(row.duration)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Monthly Report */}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Monthly Performance — 2026</Typography>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyReportData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Legend iconType="circle" iconSize={8} />
                  <Line type="monotone" dataKey="totalCalls" stroke="#034cae" strokeWidth={2.5} dot={{ r: 4 }} name="Total Calls" />
                  <Line type="monotone" dataKey="interested" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="Interested" />
                  <Line type="monotone" dataKey="converted" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} name="Converted" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}

          {/* Telecaller Performance */}
          {tab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Telecaller Performance Report</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Telecaller</TableCell>
                      <TableCell align="center">Total Calls</TableCell>
                      <TableCell align="center">Connected</TableCell>
                      <TableCell align="center">Interested</TableCell>
                      <TableCell align="center">Converted</TableCell>
                      <TableCell align="center">Conversion %</TableCell>
                      <TableCell align="center">Avg Duration</TableCell>
                      <TableCell align="center">Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {telecallerReport.map((tc) => (
                      <TableRow key={tc.name} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                              {getInitials(tc.name)}
                            </Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{tc.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{tc.totalCalls}</TableCell>
                        <TableCell align="center">{tc.connected}</TableCell>
                        <TableCell align="center" sx={{ color: '#10b981', fontWeight: 600 }}>{tc.interested}</TableCell>
                        <TableCell align="center" sx={{ color: '#059669', fontWeight: 600 }}>{tc.converted}</TableCell>
                        <TableCell align="center">
                          <Chip label={`${tc.conversionRate}%`} size="small"
                            sx={{ backgroundColor: tc.conversionRate >= 10 ? '#d1fae5' : '#fef3c7', color: tc.conversionRate >= 10 ? '#059669' : '#d97706', fontWeight: 700 }} />
                        </TableCell>
                        <TableCell align="center">{tc.avgDuration}</TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                            <Rating value={tc.rating} precision={0.1} readOnly size="small" />
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>{tc.rating}</Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Manager Performance */}
          {tab === 4 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Manager Performance Report</Typography>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={managerReport}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                      <YAxis stroke="#9ca3af" fontSize={12} />
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Legend iconType="circle" iconSize={8} />
                      <Bar dataKey="totalCalls" fill="#034cae" radius={[4, 4, 0, 0]} barSize={24} name="Total Calls" />
                      <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Converted" />
                    </BarChart>
                  </ResponsiveContainer>
                </Grid>
                <Grid size={12}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Manager</TableCell>
                          <TableCell align="center">Team Size</TableCell>
                          <TableCell align="center">Total Calls</TableCell>
                          <TableCell align="center">Interested</TableCell>
                          <TableCell align="center">Converted</TableCell>
                          <TableCell align="center">Conv. Rate</TableCell>
                          <TableCell align="center">Team Rating</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {managerReport.map((mgr) => (
                          <TableRow key={mgr.name} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                  {getInitials(mgr.name)}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{mgr.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">{mgr.teamSize}</TableCell>
                            <TableCell align="center">{mgr.totalCalls.toLocaleString()}</TableCell>
                            <TableCell align="center" sx={{ color: '#10b981', fontWeight: 600 }}>{mgr.interested.toLocaleString()}</TableCell>
                            <TableCell align="center" sx={{ color: '#059669', fontWeight: 600 }}>{mgr.converted}</TableCell>
                            <TableCell align="center">
                              <Chip label={`${mgr.conversionRate}%`} size="small" sx={{ backgroundColor: '#d1fae5', color: '#059669', fontWeight: 700 }} />
                            </TableCell>
                            <TableCell align="center">
                              <Rating value={mgr.teamRating} precision={0.1} readOnly size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Lead Conversion */}
          {tab === 5 && (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Lead Conversion by Source</Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={leadConversionData} cx="50%" cy="50%" innerRadius={60} outerRadius={110} paddingAngle={3} dataKey="converted" stroke="none">
                        {leadConversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.5, mt: 1 }}>
                    {leadConversionData.map((item, i) => (
                      <Box key={item.source} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i] }} />
                        <Typography variant="caption">{item.source}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 7 }}>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Source</TableCell>
                          <TableCell align="center">Total Leads</TableCell>
                          <TableCell align="center">Interested</TableCell>
                          <TableCell align="center">Converted</TableCell>
                          <TableCell align="center">Conv. Rate</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {leadConversionData.map((row, i) => (
                          <TableRow key={row.source} hover>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: COLORS[i] }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{row.source}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center">{row.leads.toLocaleString()}</TableCell>
                            <TableCell align="center" sx={{ color: '#10b981', fontWeight: 600 }}>{row.interested}</TableCell>
                            <TableCell align="center" sx={{ color: '#059669', fontWeight: 600 }}>{row.converted}</TableCell>
                            <TableCell align="center">
                              <Chip label={`${row.rate}%`} size="small" sx={{
                                backgroundColor: row.rate >= 15 ? '#d1fae5' : row.rate >= 10 ? '#fef3c7' : '#fee2e2',
                                color: row.rate >= 15 ? '#059669' : row.rate >= 10 ? '#d97706' : '#ef4444',
                                fontWeight: 700,
                              }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { telecallers as teleData } from '../../data/telecallerData';
import { getInitials, formatDate } from '../../utils/helpers';

const mockDatabasesMap = {
  'TC001': [
    { id: 'DB001', name: 'Delhi_NCR_Active_Leads.csv', assignDate: '2026-06-27', clientsCount: 30, createdBy: 'Arun Patel' },
    { id: 'DB002', name: 'Web_Inquiries_June.csv', assignDate: '2026-06-25', clientsCount: 18, createdBy: 'Arun Patel' }
  ],
  'TC002': [
    { id: 'DB003', name: 'Mumbai_Retailers_List.csv', assignDate: '2026-06-26', clientsCount: 35, createdBy: 'Arun Patel' }
  ],
  'TC003': [
    { id: 'DB004', name: 'IT_Managers_Directory.csv', assignDate: '2026-06-25', clientsCount: 40, createdBy: 'Sunita Sharma' },
    { id: 'DB005', name: 'Partner_Referrals_Q2.csv', assignDate: '2026-06-24', clientsCount: 16, createdBy: 'Sunita Sharma' }
  ],
  'TC004': [
    { id: 'DB006', name: 'Healthcare_Contacts.csv', assignDate: '2026-06-26', clientsCount: 42, createdBy: 'Deepak Verma' }
  ],
  'TC005': [
    { id: 'DB007', name: 'E-commerce_Sellers.csv', assignDate: '2026-06-27', clientsCount: 39, createdBy: 'Arun Patel' }
  ]
};

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const employee = useMemo(() => {
    return teleData.find(tc => tc.id === id);
  }, [id]);

  const assignedDatabases = useMemo(() => {
    if (!employee) return [];
    if (mockDatabasesMap[employee.id]) {
      return mockDatabasesMap[employee.id];
    }
    // Dynamic fallback matching employee stats
    return [
      {
        id: `DB_${employee.id}_1`,
        name: `Leads_Campaign_${employee.id}.csv`,
        assignDate: employee.joinDate,
        clientsCount: employee.totalClients || 10,
        createdBy: employee.managerName || 'Arun Patel'
      }
    ];
  }, [employee]);

  if (!employee) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ fontWeight: 700 }}>
          Employee Not Found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/assign-client')} sx={{ mt: 2, background: '#0343a8' }}>
          Back to List
        </Button>
      </Box>
    );
  }

  // Cards stats
  const stats = [
    { title: 'Database Count', value: employee.totalCalls, icon: 'bi bi-database', color: '#0343a8', bg: '#eaf4ff' },
    { title: 'Assigned Clients', value: employee.totalClients, icon: 'bi bi-people-fill', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Conversions', value: employee.converted, icon: 'bi bi-check-circle-fill', color: '#059669', bg: '#f0fdf4' },
    { title: 'Follow-ups', value: employee.followUp, icon: 'bi bi-telephone-outbound-fill', color: '#f59e0b', bg: '#fef3c7' },
  ];

  return (
    <Box>
      <PageHeader
        title="Employee Detail"
        subtitle={`Detailed assignment view for ${employee.name}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Assign Client', path: '/assign-client' },
          { label: 'Employee Detail' }
        ]}
        actions={
          <Button
            variant="outlined"
            onClick={() => navigate('/assign-client')}
            startIcon={<i className="bi bi-arrow-left"></i>}
            sx={{
              borderColor: '#cbd5e1',
              color: '#64748b',
              fontWeight: 600,
              textTransform: 'none',
              borderRadius: '8px',
              '&:hover': {
                borderColor: '#94a3b8',
                backgroundColor: '#f1f5f9',
              }
            }}
          >
            Back to List
          </Button>
        }
      />

      {/* Info Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: '2rem',
                  fontWeight: 700,
                  background: '#f1f5f9',
                  color: '#0343a8',
                  border: '2.5px solid #0343a8'
                }}
              >
                {getInitials(employee.name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {employee.name}
                </Typography>
                <StatusChip status={employee.status} />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <span><strong>Emp ID:</strong> {employee.id}</span>
                <span><strong>Email:</strong> {employee.email}</span>
                <span><strong>Mobile:</strong> {employee.mobile}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Assigned User (Manager):</strong> {employee.managerName || 'None'} • <strong>Joined:</strong> {formatDate(employee.joinDate)}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={2.5} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ backgroundColor: stat.bg, color: stat.color, width: 48, height: 48, borderRadius: 2 }}>
                  <i className={stat.icon} style={{ fontSize: '1.4rem' }}></i>
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {stat.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Assigned Databases Table */}
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Assigned Databases
          </Typography>
          <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: 'bold', width: '80px' }}>S.NO</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Database Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Assign Data</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>Clients</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Created By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedDatabases.map((db, index) => (
                  <TableRow key={db.id} hover>
                    <TableCell align="center" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#0343a8' }}>
                      {db.name}
                    </TableCell>
                    <TableCell align="center">
                      {formatDate(db.assignDate)}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                      {db.clientsCount}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {db.createdBy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

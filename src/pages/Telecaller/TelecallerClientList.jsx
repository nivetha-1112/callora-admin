import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, Tooltip, Chip, InputAdornment, Autocomplete
} from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import ExportMenu from '../../components/ExportMenu/ExportMenu';
import { useToast } from '../../context/ToastContext';
import { telecallers } from '../../data/telecallerData';
import { mockClients, clientLocations, clientStatuses } from '../../data/clientManagementData';
import { getInitials } from '../../utils/helpers';

export default function TelecallerClientList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Find the telecaller info
  const telecaller = useMemo(() => {
    return telecallers.find(tc => tc.id === id);
  }, [id]);

  // Filter clients assigned to this telecaller
  const allTelecallerClients = useMemo(() => {
    return mockClients.filter(c => c.telecallerId === id);
  }, [id]);

  // Search & Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');

  // Table pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Apply filters
  const filteredClients = useMemo(() => {
    return allTelecallerClients.filter(c => {
      const matchSearch = c.clientName.toLowerCase().includes(search.toLowerCase()) || 
                          c.mobileNumber.includes(search) || 
                          c.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || c.currentStatus === statusFilter;
      const matchLocation = locationFilter === 'All' || c.location === locationFilter;
      return matchSearch && matchStatus && matchLocation;
    });
  }, [allTelecallerClients, search, statusFilter, locationFilter]);

  const handleExport = (format) => {
    showToast(`Successfully exported client list as ${format.toUpperCase()}`, 'success');
  };

  return (
    <Box>
      <PageHeader
        title={telecaller ? `Clients of ${telecaller.name}` : 'Client List'}
        subtitle="Manage and view client details assigned to this telecaller"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Telecallers', path: '/telecallers' },
          { label: telecaller ? telecaller.name : 'Telecaller' },
          { label: 'Clients' }
        ]}
        actions={
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="contained" 
              startIcon={<i className="bi bi-arrow-left"></i>}
              onClick={() => navigate('/telecallers')}
              sx={{ 
                backgroundColor: '#0343a8', 
                color: '#ffffff', 
                textTransform: 'none', 
                borderRadius: 2,
                fontWeight: 600,
                px: 2.5,
                boxShadow: 'none',
                '&:hover': {
                  backgroundColor: '#022d71',
                  boxShadow: 'none'
                }
              }}
            >
              Back
            </Button>
          </Box>
        }
      />

      {/* Filters card */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
              placeholder="Search by name, mobile, email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              sx={{ minWidth: 280 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <i className="bi bi-search" style={{ color: '#9ca3af', fontSize: '0.9rem' }}></i>
                    </InputAdornment>
                  )
                }
              }}
            />

            <Autocomplete
              size="small"
              value={statusFilter === 'All' ? 'All Statuses' : statusFilter}
              onChange={(event, newValue) => {
                setStatusFilter(newValue === 'All Statuses' || !newValue ? 'All' : newValue);
                setPage(0);
              }}
              options={['All Statuses', ...clientStatuses]}
              renderInput={(params) => <TextField {...params} label="Status" />}
              sx={{ minWidth: 180 }}
              disableClearable
            />

            <Autocomplete
              size="small"
              value={locationFilter === 'All' ? 'All Locations' : locationFilter}
              onChange={(event, newValue) => {
                setLocationFilter(newValue === 'All Locations' || !newValue ? 'All' : newValue);
                setPage(0);
              }}
              options={['All Locations', ...clientLocations]}
              renderInput={(params) => <TextField {...params} label="Location" />}
              sx={{ minWidth: 180 }}
              disableClearable
            />

            <Box sx={{ flexGrow: 1 }} />
            <ExportMenu onExport={handleExport} />
          </Box>
        </CardContent>
      </Card>

      {/* Clients Table Card */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>S.No</TableCell>
                <TableCell sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Client Name</TableCell>
                <TableCell sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Mobile Number</TableCell>
                <TableCell sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Email</TableCell>
                <TableCell sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Location</TableCell>
                <TableCell sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Assigned Date</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Current Status</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Last Follow-up</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#0343a8', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, index) => (
                <TableRow 
                  key={client.id} 
                  hover 
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/telecallers/${id}/clients/${client.id}`)}
                >
                  <TableCell align="center" sx={{ fontWeight: 500, color: '#4b5563' }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{client.clientName}</Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2">{client.mobileNumber}</Typography></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2">{client.email}</Typography></TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <i className="bi bi-geo-alt" style={{ color: '#9ca3af', fontSize: '0.85rem' }}></i>
                      <Typography variant="body2">{client.location}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2">{client.assignedDate}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <StatusChip status={client.currentStatus} />
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2">{client.lastFollowUpDate || 'N/A'}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<i className="bi bi-card-text"></i>}
                      onClick={() => navigate(`/telecallers/${id}/clients/${client.id}`)}
                      sx={{
                        background: 'linear-gradient(135deg, #0343a8 0%, #0454cc 100%)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'none',
                        borderRadius: '6px',
                        py: 0.5,
                        px: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #022d71 0%, #0343a8 100%)'
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                    <Typography color="text.secondary">No clients found matching the search/filter criteria.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredClients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>
    </Box>
  );
}

import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Button,
  Select, MenuItem, FormControl, InputLabel, TextField, InputAdornment, Autocomplete,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { managers as initialUsers } from '../../data/managerData';
import { telecallers, telecallerClients } from '../../data/telecallerData';
import { getInitials, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // Dialog state for viewing telecaller clients in-place
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);

  const assignedTelecallers = useMemo(() => {
    if (!selectedUserId) return [];
    return telecallers.filter((tc) => tc.managerId === selectedUserId);
  }, [selectedUserId]);

  const filteredTelecallers = useMemo(() => {
    return assignedTelecallers.filter((tc) => 
      tc.name.toLowerCase().includes(search.toLowerCase()) ||
      tc.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [assignedTelecallers, search]);

  const handleRowClick = (tc) => {
    setSelectedTelecaller(tc);
    setDialogOpen(true);
  };

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="View and export detailed performance reports by User"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Reports' }]}
      />

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Dropdown Box */}
          <Box sx={{ mb: 4, maxWidth: 360 }}>
            <Autocomplete
              size="small"
              value={initialUsers.find((u) => u.id === selectedUserId) || null}
              onChange={(event, newValue) => {
                setSelectedUserId(newValue ? newValue.id : '');
                setSearch('');
              }}
              options={initialUsers}
              getOptionLabel={(option) => `${option.name} (${option.role})`}
              renderInput={(params) => <TextField {...params} label="Select User" />}
              fullWidth
            />
          </Box>

          {/* Telecallers Table or Prompt */}
          {selectedUserId ? (
            <Box>
              {assignedTelecallers.length > 0 ? (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Assigned Telecallers ({filteredTelecallers.length})
                    </Typography>
                    <TextField
                      size="small"
                      placeholder="Search telecallers..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{ minWidth: 260 }}
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
                  </Box>
                  {filteredTelecallers.length > 0 ? (
                    <TableContainer>
                      <Table sx={{ minWidth: 900 }}>
                        <TableHead>
                          <TableRow>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Assigned Clients</TableCell>
                            <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {filteredTelecallers.map((tc) => (
                            <TableRow 
                              key={tc.id} 
                              hover
                              onClick={() => handleRowClick(tc)}
                              sx={{ cursor: 'pointer' }}
                            >
                              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>
                                  {tc.id}
                                </Typography>
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
                              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                <StatusChip status={tc.status} />
                              </TableCell>
                              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                  {tc.totalClients || 0}
                                </Typography>
                              </TableCell>
                              <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  startIcon={<i className="bi bi-download"></i>}
                                  onClick={() => showToast(`Exporting report for ${tc.name}...`, 'info')}
                                  sx={{
                                    borderColor: '#64748b',
                                    color: '#64748b',
                                    fontWeight: 600,
                                    fontSize: '0.75rem',
                                    py: 0.5,
                                    px: 1.5,
                                    borderRadius: '6px',
                                    '&:hover': {
                                      borderColor: '#0343a8',
                                      color: '#0343a8',
                                      backgroundColor: '#eaf4ff',
                                    }
                                  }}
                                >
                                  Export
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <Typography color="text.secondary" sx={{ mt: 2 }}>
                      No telecallers found matching the search criteria.
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No telecallers assigned to this user.
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <i className="bi bi-person-badge" style={{ fontSize: '3.5rem', color: '#cbd5e1' }}></i>
              <Typography color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                Select a user from the dropdown above to view their performance report and assigned telecallers.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* In-place Assigned Clients Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
        maxWidth="md"
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
            {selectedTelecaller ? `${selectedTelecaller.name}'s Assigned Clients` : 'Assigned Clients'}
          </Typography>
          <IconButton onClick={() => setDialogOpen(false)} sx={{ color: '#ffffff' }}>
            <i className="bi bi-x-lg" style={{ fontSize: '1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3, pb: 3 }}>
          {selectedTelecaller && (
            <Box>
              <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Client Name</TableCell>
                      <TableCell align="center">Phone</TableCell>
                      <TableCell align="center">Last Contact</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Duration</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {telecallerClients.map((client) => (
                      <TableRow key={client.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{client.clientName}</TableCell>
                        <TableCell align="center">{client.phone}</TableCell>
                        <TableCell align="center">{formatDate(client.lastContact)}</TableCell>
                        <TableCell align="center">
                          <StatusChip status={client.callStatus} />
                        </TableCell>
                        <TableCell align="center">{client.callDuration}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #f1f5f9' }}>
          <Button 
            variant="contained" 
            onClick={() => setDialogOpen(false)}
            sx={{ background: '#0343a8', textTransform: 'none', borderRadius: 2, px: 3 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

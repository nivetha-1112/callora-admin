import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, Tooltip, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, IconButton, Checkbox, ListItemText
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { managers } from '../../data/managerData';
import { getInitials } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

// We import telecallers and telecallerClients from telecallerData
import { telecallers as teleData, telecallerClients } from '../../data/telecallerData';

export default function AssignClient() {
  const { showToast } = useToast();
  const [managerList] = useState(managers);
  const [telecallerList, setTelecallerList] = useState(teleData);
  const [selectedManagerId, setSelectedManagerId] = useState('All');
  
  // Table state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedTelecaller, setSelectedTelecaller] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // View Clients Modal state
  const [clientsOpen, setClientsOpen] = useState(false);
  const [selectedClientsTelecaller, setSelectedClientsTelecaller] = useState(null);

  // Audio playback simulation state
  const [playingClientId, setPlayingClientId] = useState(null);
  const [playProgress, setPlayProgress] = useState(0);
  const playbackTimer = useRef(null);

  const handleClientsClick = (tc) => {
    setSelectedClientsTelecaller(tc);
    setClientsOpen(true);
  };

  const handlePlayToggle = (clientId) => {
    if (playingClientId === clientId) {
      clearInterval(playbackTimer.current);
      setPlayingClientId(null);
    } else {
      clearInterval(playbackTimer.current);
      setPlayingClientId(clientId);
      setPlayProgress(0);
      playbackTimer.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 15) {
            clearInterval(playbackTimer.current);
            setPlayingClientId(null);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleCloseClientsDialog = () => {
    clearInterval(playbackTimer.current);
    setPlayingClientId(null);
    setClientsOpen(false);
    setSelectedClientsTelecaller(null);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => clearInterval(playbackTimer.current);
  }, []);

  const handleAssignClick = (tc) => {
    setSelectedTelecaller(tc);
    setSelectedFile(null);
    setUploadOpen(true);
  };

  const downloadTemplate = () => {
    const csvContent = "Client Name,Email,Mobile,Notes\nAlice Johnson,alice@example.com,+91 99887 71122,Interested in premium plan\nBob Smith,bob@example.com,+91 99887 71133,Follow up next week\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "client_assignment_template.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile || !selectedTelecaller) {
      showToast('Please choose a CSV file first', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      if (lines.length < 2) {
        showToast('CSV file is empty or missing headers', 'error');
        return;
      }

      // Parse headers
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const nameIdx = headers.indexOf('client name');
      const mobileIdx = headers.indexOf('mobile');

      if (nameIdx === -1 || mobileIdx === -1) {
        showToast('Invalid CSV headers. Must contain Client Name and Mobile', 'error');
        return;
      }

      const clientCount = lines.length - 1; // Subtract header line

      // Update telecaller clients count and calls in state
      setTelecallerList(prev => 
        prev.map(tc => 
          tc.id === selectedTelecaller.id 
            ? { 
                ...tc, 
                totalClients: (tc.totalClients || 0) + clientCount,
                totalCalls: (tc.totalCalls || 0) + clientCount
              } 
            : tc
        )
      );

      showToast(`Successfully assigned ${clientCount} clients to ${selectedTelecaller.name}!`, 'success');
      setUploadOpen(false);
      setSelectedFile(null);
      setSelectedTelecaller(null);
    };
    reader.readAsText(selectedFile);
  };

  // Filter telecallers by selected manager
  const filteredTelecallers = useMemo(() => {
    if (selectedManagerId === 'All') return telecallerList;
    return telecallerList.filter(tc => tc.managerId === selectedManagerId);
  }, [telecallerList, selectedManagerId]);

  return (
    <Box>
      <PageHeader
        title="Assign Client"
        subtitle="Manage and assign client databases to telecallers"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Managers', path: '/managers' }, { label: 'Assign Client' }]}
      />

      {/* Select Manager Dropdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <FormControl size="small" sx={{ minWidth: 260 }}>
              <InputLabel id="manager-select-label">Filter by Manager</InputLabel>
              <Select
                labelId="manager-select-label"
                id="manager-select"
                value={selectedManagerId}
                onChange={(e) => {
                  setSelectedManagerId(e.target.value);
                  setPage(0);
                }}
                label="Filter by Manager"
              >
                <MenuItem value="All">All Managers</MenuItem>
                {managerList.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} ({m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>

      {/* Telecallers Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap' }}>Manager Name</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Assigned Clients</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Total Calls</TableCell>
                <TableCell align="center" sx={{ color: '#10b981', whiteSpace: 'nowrap' }}>Interested</TableCell>
                <TableCell align="center" sx={{ color: '#ef4444', whiteSpace: 'nowrap' }}>Not Int.</TableCell>
                <TableCell align="center" sx={{ color: '#f59e0b', whiteSpace: 'nowrap' }}>Ringing</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTelecallers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tc) => (
                <TableRow key={tc.id} hover>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8', whiteSpace: 'nowrap' }}>{tc.id}</Typography>
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
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>{tc.managerName || 'Unassigned'}</Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tc.mobile}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Typography 
                      variant="body2" 
                      onClick={() => handleClientsClick(tc)}
                      sx={{ 
                        fontWeight: 700, 
                        color: '#0343a8', 
                        cursor: 'pointer', 
                        textDecoration: 'underline',
                        '&:hover': {
                          color: '#022d71'
                        }
                      }}
                    >
                      {tc.totalClients || tc.interested + tc.notInterested}
                    </Typography>
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600 }}>{tc.totalCalls}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981' }}>{tc.interested}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444' }}>{tc.notInterested}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b' }}>{tc.ringing}</Typography></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><StatusChip status={tc.status} /></TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<i className="bi bi-person-plus"></i>}
                      onClick={() => handleAssignClick(tc)}
                      sx={{
                        borderColor: '#0343a8',
                        color: '#0343a8',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: '6px',
                        textTransform: 'none',
                        '&:hover': {
                          borderColor: '#022d71',
                          backgroundColor: '#eaf4ff',
                        }
                      }}
                    >
                      Assign Client
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTelecallers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Card>

      {/* CSV File Upload Modal */}
      <Dialog 
        open={uploadOpen} 
        onClose={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Assign Client</Typography>
          <IconButton onClick={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pb: 3 }}>
          {selectedTelecaller && (
            <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Telecaller: <span style={{ color: '#0343a8' }}>{selectedTelecaller.name}</span>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Emp ID: {selectedTelecaller.id} | Manager: {selectedTelecaller.managerName}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
              Make sure the headers match the template format: <strong>Client Name, Email, Mobile, Notes</strong>.
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                onClick={downloadTemplate}
                startIcon={<i className="bi bi-download"></i>}
                sx={{ borderColor: '#0343a8', color: '#0343a8', '&:hover': { borderColor: '#022d71', backgroundColor: '#eaf4ff' } }}
              >
                Download Sample Template
              </Button>
            </Box>

            <Box sx={{ width: '100%', border: '1px dashed #cbd5e1', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <i className="bi bi-cloud-upload" style={{ fontSize: '2rem', color: '#64748b' }}></i>
              <Button
                variant="contained"
                component="label"
                size="small"
                startIcon={<i className="bi bi-file-earmark-spreadsheet"></i>}
                sx={{ background: '#64748b', '&:hover': { background: '#475569' } }}
              >
                Choose CSV File
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {selectedFile && (
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#059669', mt: 1 }}>
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!selectedFile}
            onClick={handleUploadSubmit}
            sx={{ 
              background: 'linear-gradient(135deg, #0343a8, #0454cc)',
              color: '#ffffff',
              '&.Mui-disabled': {
                background: 'linear-gradient(135deg, #0343a8, #0454cc)',
                color: '#ffffff',
                opacity: 0.6
              }
            }}
          >
            Assign Client
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Clients Modal */}
      <Dialog
        open={clientsOpen}
        onClose={handleCloseClientsDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        {selectedClientsTelecaller && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Assigned Clients</Typography>
                <Typography variant="caption" color="text.secondary">
                  Telecaller: {selectedClientsTelecaller.name} ({selectedClientsTelecaller.id})
                </Typography>
              </Box>
              <IconButton 
                onClick={handleCloseClientsDialog}
                sx={{ ml: 'auto' }}
              >
                <i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i>
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: 0 }}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">Client ID</TableCell>
                      <TableCell>Client Name</TableCell>
                      <TableCell align="center">Phone</TableCell>
                      <TableCell align="center">Last Contact</TableCell>
                      <TableCell align="center">Call Duration</TableCell>
                      <TableCell align="center">Status</TableCell>
                      <TableCell align="center">Recorded Call</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {telecallerClients.map((client) => (
                      <TableRow key={client.id} hover>
                        <TableCell align="center">
                          <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0343a8' }}>
                            {`CLI${String(client.id).padStart(3, '0')}`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{client.clientName}</Typography>
                        </TableCell>
                        <TableCell align="center"><Typography variant="body2">{client.phone}</Typography></TableCell>
                        <TableCell align="center"><Typography variant="body2">{client.lastContact}</Typography></TableCell>
                        <TableCell align="center"><Typography variant="body2">{client.callDuration}</Typography></TableCell>
                        <TableCell align="center">
                          <Chip 
                            label={client.callStatus} 
                            size="small"
                            sx={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              backgroundColor: 
                                client.callStatus === 'Interested' ? '#f0fdf4' :
                                client.callStatus === 'Converted' ? '#eaf4ff' :
                                client.callStatus === 'Not Interested' ? '#fee2e2' :
                                client.callStatus === 'Ringing' ? '#fffbeb' : '#f3e8ff',
                              color: 
                                client.callStatus === 'Interested' ? '#16a34a' :
                                client.callStatus === 'Converted' ? '#0343a8' :
                                client.callStatus === 'Not Interested' ? '#dc2626' :
                                client.callStatus === 'Ringing' ? '#d97706' : '#7c3aed',
                              border: `1px solid ${
                                client.callStatus === 'Interested' ? '#bbf7d0' :
                                client.callStatus === 'Converted' ? '#bfdbfe' :
                                client.callStatus === 'Not Interested' ? '#fecaca' :
                                client.callStatus === 'Ringing' ? '#fef3c7' : '#e9d5ff'
                              }`
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          {client.callStatus === 'Ringing' ? (
                            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>N/A</Typography>
                          ) : (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, minWidth: 100 }}>
                              <IconButton 
                                size="small" 
                                onClick={() => handlePlayToggle(client.id)}
                                sx={{
                                  color: playingClientId === client.id ? '#ef4444' : '#0343a8',
                                  backgroundColor: playingClientId === client.id ? '#fee2e2' : '#eaf4ff',
                                  '&:hover': {
                                    backgroundColor: playingClientId === client.id ? '#fecaca' : '#d1fae5',
                                  }
                                }}
                              >
                                <i className={playingClientId === client.id ? "bi bi-pause-fill" : "bi bi-play-fill"} style={{ fontSize: '0.95rem' }}></i>
                              </IconButton>
                              {playingClientId === client.id ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                  <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 700, color: '#ef4444' }}>
                                    {`0:${String(playProgress).padStart(2, '0')} / ${client.callDuration}`}
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: '2px', alignItems: 'center', mt: 0.3 }}>
                                    {[6, 12, 8, 14, 5].map((h, i) => (
                                      <Box 
                                        key={i} 
                                        sx={{
                                          width: '2px',
                                          height: `${h}px`,
                                          backgroundColor: '#ef4444',
                                          borderRadius: '1px',
                                          animation: 'pulse 1s infinite alternate',
                                          animationDelay: `${i * 0.15}s`,
                                          '@keyframes pulse': {
                                            '0%': { height: '3px' },
                                            '100%': { height: `${h}px` }
                                          }
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              ) : (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                                  Listen
                                </Typography>
                              )}
                            </Box>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleCloseClientsDialog}
                sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)', borderRadius: 2 }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, MenuItem, Select, FormControl,
  InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TablePagination, Avatar, Tooltip, Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, Grid, IconButton, Checkbox, ListItemText, InputAdornment, Autocomplete
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { managers } from '../../data/managerData';
import { getInitials } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import useDebounce from '../../hooks/useDebounce';

// We import telecallers and telecallerClients from telecallerData
import { telecallers as teleData, telecallerClients } from '../../data/telecallerData';

export default function AssignClient() {
  const navigate = useNavigate();
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

  // Assign Clients from Existing Group dialog state
  const [assignGroupOpen, setAssignGroupOpen] = useState(false);
  
  // States for Transfer clients modal
  const [selectedToTelecallerId, setSelectedToTelecallerId] = useState('');
  const [transferType, setTransferType] = useState('selected');
  const [filterLocation, setFilterLocation] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [clientSearch, setClientSearch] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [transferReason, setTransferReason] = useState('Workload balancing due to high volume');

  // Search state
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  // Selected to-telecaller object
  const selectedToTelecaller = useMemo(() => {
    return telecallerList.find(t => t.id === selectedToTelecallerId);
  }, [telecallerList, selectedToTelecallerId]);

  // We assign mock locations to telecaller clients
  const clientsWithMockData = useMemo(() => {
    const locations = ['Noida', 'Gurgaon', 'Delhi', 'Noida', 'Gurgaon', 'Delhi', 'Chennai', 'Mumbai', 'Chennai', 'Mumbai', 'Noida', 'Gurgaon'];
    return telecallerClients.map((c, idx) => ({
      ...c,
      location: locations[idx % locations.length]
    }));
  }, []);

  // Filter clients shown in the transfer list
  const filteredClients = useMemo(() => {
    return clientsWithMockData.filter(c => {
      const matchSearch = c.clientName.toLowerCase().includes(clientSearch.toLowerCase());
      const matchLocation = filterLocation === 'All' || c.location === filterLocation;
      const matchStatus = filterStatus === 'All' || c.callStatus === filterStatus;
      return matchSearch && matchLocation && matchStatus;
    });
  }, [clientsWithMockData, clientSearch, filterLocation, filterStatus]);

  const handleToggleClientSelect = (clientId) => {
    setSelectedClientIds(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId) 
        : [...prev, clientId]
    );
  };

  const handleAssignClick = (tc) => {
    setSelectedTelecaller(tc);
    setSelectedFile(null);
    setUploadOpen(true);
  };

  const handleAssignGroupClick = (tc) => {
    setSelectedTelecaller(tc);
    setSelectedToTelecallerId('');
    setTransferType('selected');
    setFilterLocation('All');
    setFilterStatus('All');
    setClientSearch('');
    // Default select a few clients to match the mockup visual
    setSelectedClientIds([1, 2, 5]); 
    setTransferReason('Workload balancing due to high volume');
    setAssignGroupOpen(true);
  };

  const handleTransferSubmit = () => {
    if (!selectedToTelecallerId || !selectedTelecaller) {
      showToast('Please select a target telecaller', 'warning');
      return;
    }

    const countToTransfer = transferType === 'all' 
      ? (selectedTelecaller.totalClients || 42)
      : selectedClientIds.length;

    // Update both telecallers in state
    setTelecallerList(prev => 
      prev.map(tc => {
        if (tc.id === selectedTelecaller.id) {
          // From telecaller
          const currentTotal = tc.totalClients || 0;
          return {
            ...tc,
            totalClients: Math.max(0, currentTotal - countToTransfer),
            totalCalls: Math.max(0, (tc.totalCalls || 0) - countToTransfer)
          };
        } else if (tc.id === selectedToTelecallerId) {
          // To telecaller
          return {
            ...tc,
            totalClients: (tc.totalClients || 0) + countToTransfer,
            totalCalls: (tc.totalCalls || 0) + countToTransfer
          };
        }
        return tc;
      })
    );

    showToast(`Successfully transferred ${countToTransfer} clients from ${selectedTelecaller.name} to ${selectedToTelecaller.name}!`, 'success');
    setAssignGroupOpen(false);
    setSelectedTelecaller(null);
    setSelectedToTelecallerId('');
    setSelectedClientIds([]);
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

  // Filter telecallers by selected manager and search keyword
  const filteredTelecallers = useMemo(() => {
    return telecallerList.filter(tc => {
      const matchManager = selectedManagerId === 'All' || tc.managerId === selectedManagerId;
      const matchSearch = tc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                          tc.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchManager && matchSearch;
    });
  }, [telecallerList, selectedManagerId, debouncedSearch]);

  return (
    <Box>
      <PageHeader
        title="Assign Client"
        subtitle="Manage and assign client databases to telecallers"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Managers', path: '/managers' }, { label: 'Assign Client' }]}
      />

      {/* Filters: Select Manager and Search Employee Name */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Autocomplete
              size="small"
              value={selectedManagerId === 'All' ? { id: 'All', name: 'All Managers' } : (managerList.find((m) => m.id === selectedManagerId) || null)}
              onChange={(event, newValue) => {
                setSelectedManagerId(newValue ? newValue.id : 'All');
                setPage(0);
              }}
              options={[{ id: 'All', name: 'All Managers' }, ...managerList]}
              getOptionLabel={(option) => option.id === 'All' ? option.name : `${option.name} (${option.id})`}
              renderInput={(params) => <TextField {...params} label="Filter by Manager" />}
              sx={{ minWidth: 260 }}
              disableClearable
            />

            <TextField 
              size="small" 
              placeholder="Search employee name..." 
              value={search} 
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: 260, flex: { xs: 1, sm: 'unset' } }}
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
        </CardContent>
      </Card>

      {/* Telecallers Table */}
      <Card>
        <TableContainer>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>S.No</TableCell>
                <TableCell sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Emp ID</TableCell>
                <TableCell sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Employee Name</TableCell>
                <TableCell sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Manager Name</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Assigned Clients</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Status</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Action</TableCell>
                <TableCell align="center" sx={{ backgroundColor: '#a80f14', color: '#ffffff', fontWeight: 'bold', fontSize: '0.875rem', py: 1.5 }}>Bulk Upload</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTelecallers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((tc, index) => {
                const serialNo = page * rowsPerPage + index + 1;
                return (
                  <TableRow 
                    key={tc.id} 
                    hover
                    onClick={() => navigate(`/telecallers/${tc.id}/clients`)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 500, color: '#4b5563' }}>{serialNo}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
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
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 700, 
                          color: '#111827'
                        }}
                      >
                        {tc.totalClients || tc.interested + tc.notInterested}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}><StatusChip status={tc.status} /></TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton 
                            size="small" 
                            onClick={() => showToast(`Edit functionality for ${tc.name}`, 'info')}
                            sx={{ 
                              color: '#ea580c', 
                              backgroundColor: '#fef3c7', 
                              width: 32, 
                              height: 32,
                              '&:hover': { backgroundColor: '#ffedd5' } 
                            }}
                          >
                            <i className="bi bi-pencil" style={{ fontSize: '0.95rem' }}></i>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={() => showToast(`Delete functionality for ${tc.name}`, 'info')}
                            sx={{ 
                              color: '#dc2626', 
                              backgroundColor: '#fee2e2', 
                              width: 32, 
                              height: 32,
                              '&:hover': { backgroundColor: '#fecaca' } 
                            }}
                          >
                            <i className="bi bi-trash" style={{ fontSize: '0.95rem' }}></i>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<i className="bi bi-upload"></i>}
                          onClick={() => handleAssignClick(tc)}
                          sx={{
                            borderColor: '#9e1a1a',
                            color: '#9e1a1a',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            py: 0.5,
                            px: 1.5,
                            borderRadius: '6px',
                            textTransform: 'none',
                            '&:hover': {
                              borderColor: '#7a1414',
                              backgroundColor: '#fee2e2',
                            }
                          }}
                        >
                          Bulk Upload
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      {/* CSV File Upload Modal (Redesigned) */}
      <Dialog 
        open={uploadOpen} 
        onClose={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(135deg, #022d71 0%, #0343a8 100%)',
          color: '#ffffff',
          py: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Bulk Upload Clients</Typography>
          <IconButton 
            onClick={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }}
            sx={{ color: '#ffffff' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 3 }}>
          {selectedTelecaller && (
            <Box sx={{ 
              mb: 3, 
              p: 2.5, 
              backgroundColor: '#f8fafc', 
              borderRadius: 3, 
              border: '1px solid #e2e8f0',
              textAlign: 'center'
            }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
                Target Group
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0343a8' }}>
                {selectedTelecaller.name}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Avatar sx={{ width: 56, height: 56, backgroundColor: '#eaf4ff', color: '#0343a8' }}>
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: '1.8rem' }}></i>
              </Avatar>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2, px: 2 }}>
              Download the template, fill in your client data, and upload it back to the system.
            </Typography>

            {/* Step 1 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              p: 2, 
              backgroundColor: '#f8fafc', 
              borderRadius: 2, 
              border: '1px solid #e2e8f0',
              mb: 1
            }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937' }}>
                  Step 1: Download Template
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Get the standard Excel/CSV format.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={downloadTemplate}
                startIcon={<i className="bi bi-download"></i>}
                sx={{ 
                  borderColor: '#0343a8', 
                  color: '#0343a8', 
                  fontWeight: 700,
                  textTransform: 'none',
                  '&:hover': { borderColor: '#022d71', backgroundColor: '#eaf4ff' } 
                }}
              >
                Download
              </Button>
            </Box>

            {/* Step 2 */}
            <Box sx={{ 
              p: 2, 
              backgroundColor: '#f8fafc', 
              borderRadius: 2, 
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1f2937', mb: 1.5 }}>
                Step 2: Upload File
              </Typography>
              <Box 
                component="label"
                sx={{ 
                  width: '100%', 
                  border: '2px dashed #3b82f6', 
                  borderRadius: 2, 
                  p: 3, 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: 1, 
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: '#0343a8',
                    backgroundColor: '#f8fafc'
                  }
                }}
              >
                <input
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={handleFileChange}
                />
                <i className="bi bi-cloud-upload-fill" style={{ fontSize: '1.8rem', color: '#3b82f6' }}></i>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4b5563', textAlign: 'center' }}>
                  Click to browse or drag & drop files here
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supported formats: CSV, Excel
                </Typography>
                {selectedFile && (
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#10b981', mt: 0.5 }}>
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => { setUploadOpen(false); setSelectedFile(null); setSelectedTelecaller(null); }} 
            sx={{ 
              borderColor: '#9ca3af', 
              color: '#4b5563',
              borderRadius: 2,
              px: 3,
              '&:hover': { borderColor: '#4b5563', backgroundColor: '#f3f4f6' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedFile}
            onClick={handleUploadSubmit}
            startIcon={<i className="bi bi-check-circle-fill"></i>}
            sx={{ 
              background: 'linear-gradient(135deg, #0343a8, #0454cc)',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              '&.Mui-disabled': {
                background: '#e5e7eb',
                color: '#9ca3af'
              }
            }}
          >
            Upload Clients
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transfer Clients Between Telecallers Modal (Assign Clients popup redesign) */}
      <Dialog 
        open={assignGroupOpen} 
        onClose={() => { setAssignGroupOpen(false); setSelectedTelecaller(null); setSelectedToTelecallerId(''); }} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: '#0343a8', 
          color: '#ffffff',
          py: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <i className="bi bi-arrow-left-right" style={{ fontSize: '1.2rem' }}></i>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Transfer Clients Between Telecallers</Typography>
          </Box>
          <IconButton 
            onClick={() => { setAssignGroupOpen(false); setSelectedTelecaller(null); setSelectedToTelecallerId(''); }}
            sx={{ color: '#ffffff' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3, pt: 3 }}>
          {selectedTelecaller && (
            <Box>
              {/* From and To Cards */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 3 }}>
                {/* From Card */}
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  backgroundColor: '#f0f4f9', 
                  borderRadius: 3, 
                  border: '1px solid #d0d7de',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#0343a8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    From Telecaller
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 44, height: 44, background: '#0343a815', color: '#0343a8', border: '1px solid #0343a830', fontSize: '0.875rem' }}>
                      {getInitials(selectedTelecaller.name)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1a1a2e' }}>
                        {selectedTelecaller.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Total Clients: <span style={{ fontWeight: 700, color: '#0343a8' }}>{selectedTelecaller.totalClients || 0}</span>
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Arrow */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Avatar sx={{ width: 36, height: 36, backgroundColor: '#ffffff', color: '#6b7280', border: '1px solid #e5e7eb' }}>
                    <i className="bi bi-arrow-right"></i>
                  </Avatar>
                </Box>

                {/* To Card */}
                <Box sx={{ 
                  flex: 1, 
                  p: 2, 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: 3, 
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    To Telecaller *
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ 
                      width: 44, 
                      height: 44, 
                      background: selectedToTelecaller ? '#16a34a15' : '#f3f4f6', 
                      color: selectedToTelecaller ? '#16a34a' : '#9ca3af', 
                      border: selectedToTelecaller ? '1px solid #16a34a30' : '1px solid #e5e7eb',
                      fontSize: '0.875rem'
                    }}>
                      {selectedToTelecaller ? getInitials(selectedToTelecaller.name) : '?'}
                    </Avatar>
                    <Autocomplete
                      size="small"
                      value={telecallerList.find((t) => t.id === selectedToTelecallerId) || null}
                      onChange={(event, newValue) => {
                        setSelectedToTelecallerId(newValue ? newValue.id : '');
                      }}
                      options={telecallerList.filter((t) => t.id !== selectedTelecaller.id)}
                      getOptionLabel={(option) => `${option.name} (${option.id})`}
                      renderInput={(params) => <TextField {...params} label="Select Telecaller" />}
                      sx={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 2 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Transfer Type and Filters */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3, mb: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                    Transfer Type
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box 
                      onClick={() => setTransferType('all')}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        cursor: 'pointer',
                        p: 1, 
                        px: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: transferType === 'all' ? '#0343a8' : '#e2e8f0',
                        backgroundColor: transferType === 'all' ? '#eaf4ff' : 'transparent',
                        color: transferType === 'all' ? '#0343a8' : '#475569',
                        fontWeight: transferType === 'all' ? 700 : 500,
                        fontSize: '0.8125rem'
                      }}
                    >
                      <i className={transferType === 'all' ? "bi bi-record-circle-fill" : "bi bi-circle"}></i>
                      All Clients
                    </Box>
                    <Box 
                      onClick={() => setTransferType('selected')}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        cursor: 'pointer',
                        p: 1, 
                        px: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: transferType === 'selected' ? '#0343a8' : '#e2e8f0',
                        backgroundColor: transferType === 'selected' ? '#eaf4ff' : 'transparent',
                        color: transferType === 'selected' ? '#0343a8' : '#475569',
                        fontWeight: transferType === 'selected' ? 700 : 500,
                        fontSize: '0.8125rem'
                      }}
                    >
                      <i className={transferType === 'selected' ? "bi bi-record-circle-fill" : "bi bi-circle"}></i>
                      Selected Clients
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                      Filter Clients (Optional)
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Autocomplete
                        size="small"
                        value={filterLocation === 'All' ? 'All Locations' : filterLocation}
                        onChange={(event, newValue) => {
                          setFilterLocation(newValue === 'All Locations' || !newValue ? 'All' : newValue);
                        }}
                        options={['All Locations', 'Noida', 'Gurgaon', 'Delhi', 'Chennai', 'Mumbai']}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Location"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <i className="bi bi-geo-alt" style={{ marginRight: '4px', color: '#64748b' }}></i>
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        sx={{ minWidth: 150 }}
                        disableClearable
                      />
                      <Autocomplete
                        size="small"
                        value={filterStatus === 'All' ? 'All Status' : filterStatus}
                        onChange={(event, newValue) => {
                          setFilterStatus(newValue === 'All Status' || !newValue ? 'All' : newValue);
                        }}
                        options={['All Status', 'Interested', 'Follow Up', 'Not Contacted', 'Ringing', 'Converted']}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Status"
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <>
                                  <i className="bi bi-filter" style={{ marginRight: '4px', color: '#64748b' }}></i>
                                  {params.InputProps.startAdornment}
                                </>
                              )
                            }}
                          />
                        )}
                        sx={{ minWidth: 150 }}
                        disableClearable
                      />
                    </Box>
                  </Box>
                </Box>
              </Box>

              {/* Clients List (only shown when selected transfer type) */}
              {transferType === 'selected' && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                      Clients to Transfer
                    </Typography>
                    <TextField 
                      size="small" 
                      placeholder="Search clients..." 
                      value={clientSearch}
                      onChange={(e) => setClientSearch(e.target.value)}
                      sx={{ width: 220 }}
                      slotProps={{ 
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <i className="bi bi-search" style={{ fontSize: '0.85rem', color: '#9ca3af' }}></i>
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                  </Box>
                  
                  <Box sx={{ 
                    border: '1px solid #e2e8f0', 
                    borderRadius: 2.5, 
                    overflow: 'hidden',
                    maxHeight: 220,
                    overflowY: 'auto'
                  }}>
                    {filteredClients.map((client) => {
                      const isChecked = selectedClientIds.includes(client.id);
                      return (
                        <Box 
                          key={client.id}
                          onClick={() => handleToggleClientSelect(client.id)}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            p: 1.2, 
                            px: 2,
                            borderBottom: '1px solid #f1f5f9',
                            cursor: 'pointer',
                            backgroundColor: isChecked ? '#f8fafc' : 'transparent',
                            '&:hover': { backgroundColor: '#f1f5f9' },
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Checkbox 
                              checked={isChecked} 
                              size="small"
                              onClick={(e) => e.stopPropagation()}
                              onChange={() => handleToggleClientSelect(client.id)}
                            />
                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', background: '#e0e7ff', color: '#4f46e5' }}>
                              {getInitials(client.clientName)}
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600 }}>{client.clientName}</Typography>
                              <Typography variant="caption" color="text.secondary">{client.email || `${client.clientName.toLowerCase().replace(' ', '.')}@telecall.in`}</Typography>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                            <StatusChip status={client.callStatus} size="small" />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 80 }}>
                              <i className="bi bi-geo-alt" style={{ fontSize: '0.8rem', color: '#9ca3af' }}></i>
                              <Typography sx={{ fontSize: '0.75rem', color: '#4b5563' }}>{client.location || 'Noida'}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                    {filteredClients.length === 0 && (
                      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
                        <Typography variant="body2">No clients match the search/filter criteria.</Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 600, color: '#475569' }}>
                    Selected: <span style={{ color: '#0343a8', fontWeight: 700 }}>{selectedClientIds.length} Clients</span>
                  </Typography>
                </Box>
              )}

              {/* Transfer Reason */}
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
                  Transfer Reason (Optional)
                </Typography>
                <Autocomplete
                  size="small"
                  value={transferReason}
                  onChange={(event, newValue) => {
                    setTransferReason(newValue || 'Workload balancing due to high volume');
                  }}
                  options={[
                    'Workload balancing due to high volume',
                    'Telecaller on leave / absent',
                    'Specialized client handling request',
                    'Territory reallocation'
                  ]}
                  renderInput={(params) => <TextField {...params} label="Transfer Reason" />}
                  fullWidth
                  disableClearable
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #f1f5f9', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => { setAssignGroupOpen(false); setSelectedTelecaller(null); setSelectedToTelecallerId(''); }} 
            sx={{ 
              borderColor: '#cbd5e1', 
              color: '#4b5563',
              borderRadius: 2,
              px: 3,
              '&:hover': { borderColor: '#94a3b8', backgroundColor: '#f8fafc' }
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!selectedToTelecallerId || (transferType === 'selected' && selectedClientIds.length === 0)}
            onClick={handleTransferSubmit}
            startIcon={<i className="bi bi-arrow-left-right"></i>}
            sx={{ 
              background: '#0343a8',
              color: '#ffffff',
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              '&:hover': {
                background: '#022d71'
              },
              '&.Mui-disabled': {
                background: '#e2e8f0',
                color: '#94a3b8'
              }
            }}
          >
            Transfer Clients
          </Button>
        </DialogActions>
      </Dialog>


    </Box>
  );
}

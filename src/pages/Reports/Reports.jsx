import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Avatar, Button,
  Select, MenuItem, FormControl, InputLabel
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { managers } from '../../data/managerData';
import { telecallers } from '../../data/telecallerData';
import { getInitials } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function Reports() {
  const { showToast } = useToast();
  const [selectedManagerId, setSelectedManagerId] = useState('');

  const assignedTelecallers = useMemo(() => {
    if (!selectedManagerId) return [];
    return telecallers.filter((tc) => tc.managerId === selectedManagerId);
  }, [selectedManagerId]);

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="View and export detailed performance reports by manager"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Reports' }]}
      />

      <Card>
        <CardContent sx={{ p: 4 }}>
          {/* Dropdown Box */}
          <Box sx={{ mb: 4, maxWidth: 360 }}>
            <FormControl fullWidth size="small">
              <InputLabel id="manager-select-label">Select Manager</InputLabel>
              <Select
                labelId="manager-select-label"
                id="manager-select"
                value={selectedManagerId}
                label="Select Manager"
                onChange={(e) => setSelectedManagerId(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      maxHeight: 250, // Ensures scrollability for a long list of managers
                    }
                  }
                }}
              >
                <MenuItem value="">
                  <em>Select a Manager</em>
                </MenuItem>
                {managers.map((mgr) => (
                  <MenuItem key={mgr.id} value={mgr.id}>
                    {mgr.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Telecallers Table or Prompt */}
          {selectedManagerId ? (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                Assigned Telecallers ({assignedTelecallers.length})
              </Typography>
              {assignedTelecallers.length > 0 ? (
                <TableContainer>
                  <Table sx={{ minWidth: 900 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Emp ID</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Name</TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Mobile</TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Total Calls</TableCell>
                        <TableCell align="center" sx={{ color: '#10b981', whiteSpace: 'nowrap' }}>Interested</TableCell>
                        <TableCell align="center" sx={{ color: '#ef4444', whiteSpace: 'nowrap' }}>Not Int.</TableCell>
                        <TableCell align="center" sx={{ color: '#f59e0b', whiteSpace: 'nowrap' }}>Ringing</TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Status</TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {assignedTelecallers.map((tc) => (
                        <TableRow key={tc.id} hover>
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
                            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>{tc.mobile}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{tc.totalCalls}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#10b981', whiteSpace: 'nowrap' }}>{tc.interested}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#ef4444', whiteSpace: 'nowrap' }}>{tc.notInterested}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#f59e0b', whiteSpace: 'nowrap' }}>{tc.ringing}</Typography>
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                            <StatusChip status={tc.status} />
                          </TableCell>
                          <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
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
                  No telecallers assigned to this manager.
                </Typography>
              )}
            </Box>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <i className="bi bi-person-badge" style={{ fontSize: '3.5rem', color: '#cbd5e1' }}></i>
              <Typography color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
                Select a manager from the dropdown above to view their performance report and assigned telecallers.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

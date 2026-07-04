import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, LinearProgress,
  Chip, Tooltip, FormControl, Select, MenuItem, Autocomplete, TextField
} from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { useToast } from '../../context/ToastContext';
import { telecallers } from '../../data/telecallerData';
import {
  mockClients, mockTimelines, mockCallHistory, mockRecordings
} from '../../data/clientManagementData';
import { getInitials } from '../../utils/helpers';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Lead created':
    case 'Lead Received':
    case 'New Lead':
      return 'bi bi-cloud-arrow-up';
    case 'Contacted':
      return 'bi bi-telephone';
    case 'Interested':
      return 'bi bi-star';
    case 'Follow Up':
    case 'Follow-up Scheduled':
    case 'Follow-up Required':
      return 'bi bi-calendar-event';
    case 'Callback Requested':
      return 'bi bi-telephone-inbound';
    case 'Not Interested':
      return 'bi bi-x-circle';
    case 'Converted':
      return 'bi bi-check-circle';
    default:
      return 'bi bi-info-circle';
  }
};

export default function TelecallerClientDetails() {
  const { id, clientId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Find the telecaller info
  const telecaller = useMemo(() => {
    return telecallers.find(tc => tc.id === id);
  }, [id]);

  // Find the client details
  const client = useMemo(() => {
    return mockClients.find(c => c.id === clientId);
  }, [clientId]);

  // Find timeline updates
  const timeline = useMemo(() => {
    return mockTimelines[clientId] || [
      { status: 'New Lead', updatedBy: 'System Bulk Upload', date: client?.assignedDate || '2026-06-24', time: '09:00 AM', remarks: 'Lead automatically created via bulk upload import.' }
    ];
  }, [clientId, client]);

  // Find call logs
  const callLogs = useMemo(() => {
    return mockCallHistory[clientId] || [
      { date: client?.lastFollowUpDate || '2026-06-25', time: '11:15 AM', duration: '03:40', telecallerName: telecaller?.name || 'Priya Sharma', outcome: client?.currentStatus || 'Contacted', notes: 'Spoke with client. Discussed product capabilities.' }
    ];
  }, [clientId, client, telecaller]);

  // Find call recordings
  const recordings = useMemo(() => {
    return mockRecordings[clientId] || [
      { name: `Recording_${clientId}_25062026.mp3`, date: client?.assignedDate || '2026-06-25', duration: '03:40' }
    ];
  }, [clientId, client]);

  // Interactive simulated Audio Player states
  const [playingRecording, setPlayingRecording] = useState(null); // name of playing recording
  const [playProgress, setPlayProgress] = useState(0);
  const playerTimer = useRef(null);

  const handlePlayToggle = (rec) => {
    if (playingRecording === rec.name) {
      clearInterval(playerTimer.current);
      setPlayingRecording(null);
      setPlayProgress(0);
    } else {
      clearInterval(playerTimer.current);
      setPlayingRecording(rec.name);
      setPlayProgress(0);

      // Parse duration to seconds (format MM:SS)
      const parts = rec.duration.split(':');
      const totalSeconds = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
      
      playerTimer.current = setInterval(() => {
        setPlayProgress((prev) => {
          if (prev >= 100) {
            clearInterval(playerTimer.current);
            setPlayingRecording(null);
            showToast(`Finished playing call recording: ${rec.name}`, 'success');
            return 0;
          }
          return prev + (100 / totalSeconds);
        });
      }, 1000);
    }
  };

  const handleDownload = (recName) => {
    showToast(`Downloading call recording: ${recName}...`, 'success');
  };

  useEffect(() => {
    return () => clearInterval(playerTimer.current);
  }, []);

  if (!client) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" color="error" sx={{ mb: 2 }}>Client Not Found</Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate(`/telecallers/${id}/clients`)}
          sx={{
            backgroundColor: '#0343a8',
            color: '#ffffff',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#022d71',
              boxShadow: 'none'
            }
          }}
        >
          Back to Clients
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title={client.clientName}
        subtitle={`Client ID: ${client.id}`}
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Telecallers', path: '/telecallers' },
          { label: telecaller ? telecaller.name : 'Telecaller' },
          { label: 'Clients', path: `/telecallers/${id}/clients` },
          { label: client.clientName }
        ]}
        actions={
          <Button 
            variant="contained" 
            startIcon={<i className="bi bi-arrow-left"></i>}
            onClick={() => navigate(`/telecallers/${id}/clients`)}
            sx={{
              backgroundColor: '#0343a8',
              color: '#ffffff',
              borderRadius: 2,
              px: 2.5,
              fontWeight: 600,
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: '#022d71',
                boxShadow: 'none'
              }
            }}
          >
            Back to Clients
          </Button>
        }
      />

      <Grid container spacing={3}>
        {/* Left: Client Information Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>{client.clientName}</Typography>
                <Typography variant="body2" color="text.secondary">Assigned to: {telecaller?.name || 'Unassigned'}</Typography>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 2, letterSpacing: '0.05em' }}>
                Client Details
              </Typography>

              <Grid container spacing={2}>
                {[
                  { label: 'Mobile Number', value: client.mobileNumber, icon: 'bi-telephone' },
                  { label: 'Email Address', value: client.email, icon: 'bi-envelope' },
                  { label: 'Location', value: client.location, icon: 'bi-geo-alt' },
                  { label: 'Assigned Telecaller', value: telecaller?.name || 'Unassigned', icon: 'bi-person' },
                  { label: 'Created Date', value: client.assignedDate, icon: 'bi-calendar-event' }
                ].map((item, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                      <i className={`bi ${item.icon}`} style={{ color: '#0343a8', fontSize: '1.1rem', marginTop: '2px' }}></i>
                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                          {item.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#1e293b' }}>
                          {item.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}

                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 1 }}>
                    <i className="bi bi-shield-check" style={{ color: '#0343a8', fontSize: '1.1rem' }}></i>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Current Status:
                      </Typography>
                      <StatusChip status={client.currentStatus} />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Status Timeline Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status Timeline
                </Typography>
                <Autocomplete
                  size="small"
                  value="All Activities"
                  options={["All Activities"]}
                  renderInput={(params) => <TextField {...params} label="Activities" />}
                  sx={{ 
                    minWidth: 150,
                    '& .MuiOutlinedInput-root': {
                      fontSize: '0.75rem',
                      height: '32px',
                      borderRadius: '8px',
                    }
                  }}
                  disableClearable
                />
              </Box>

              <Box sx={{ 
                height: 250,
                overflowY: 'auto',
                scrollbarGutter: 'stable',
                pr: 1,
                pl: 1,
                '&::-webkit-scrollbar': { width: '5px' },
                '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '3px' },
                '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }
              }}>
                <Box sx={{ position: 'relative', minHeight: '100%', pb: 2 }}>
                  {/* Vertical Timeline Line */}
                  <Box sx={{
                    position: 'absolute',
                    left: '26px',
                    top: '18px',
                    bottom: '18px',
                    width: '2px',
                    backgroundColor: '#cbd5e1',
                    zIndex: 1
                  }} />

                  {timeline.map((log, idx) => {
                    const isLast = idx === timeline.length - 1;
                    return (
                      <Box 
                        key={idx} 
                        sx={{ 
                          position: 'relative', 
                          pb: 2, 
                          pt: idx === 0 ? 0 : 2,
                          pl: 6,
                          borderBottom: isLast ? 'none' : '1px solid #f1f5f9',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start'
                        }}
                      >
                        {/* Timeline Icon Avatar (Blue color only) */}
                        <Avatar sx={{
                          position: 'absolute',
                          left: 0,
                          top: idx === 0 ? '0px' : '16px',
                          width: 36,
                          height: 36,
                          backgroundColor: '#eaf4ff',
                          color: '#0343a8',
                          border: '2px solid #ffffff',
                          boxShadow: '0 0 0 1px #e2e8f0',
                          zIndex: 2
                        }}>
                          <i className={getStatusIcon(log.status)} style={{ fontSize: '1.05rem' }}></i>
                        </Avatar>

                        {/* Main Text Content */}
                        <Box sx={{ flex: 1, pl: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <StatusChip status={log.status} />
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                              by {log.updatedBy}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.75rem', mt: 0.5 }}>
                            "{log.remarks || 'No remarks provided.'}"
                          </Typography>
                        </Box>

                        {/* Right aligned Date & Time */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 100 }}>
                          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                            {log.date}
                          </Typography>
                          <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                            {log.time}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Call History & Recording Section */}
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', textTransform: 'uppercase', mb: 2.5, letterSpacing: '0.05em' }}>
            Call History & Recordings
          </Typography>

          <TableContainer 
            sx={{ 
              border: '1px solid #e2e8f0', 
              borderRadius: 2.5, 
              maxHeight: 320, 
              overflowY: 'auto',
              overflowX: 'auto',
              scrollbarGutter: 'stable',
              '&::-webkit-scrollbar': { width: '5px', height: '5px' },
              '&::-webkit-scrollbar-thumb': { backgroundColor: '#cbd5e1', borderRadius: '3px' },
              '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' }
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Call Date & Time</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Caller</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Recording</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', py: 1.5 }}>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {callLogs.map((log, index) => {
                  // Find if there is a matching recording for this call index
                  const matchingRec = recordings[index];
                  const isPlaying = matchingRec && playingRecording === matchingRec.name;

                  return (
                    <React.Fragment key={index}>
                      <TableRow hover>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1e293b' }}>{log.date}</Typography>
                            <Typography variant="caption" color="text.secondary">{log.time}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifycontent: 'center', gap: 0.5 }}>
                            <i className="bi bi-clock-history" style={{ fontSize: '0.8rem', color: '#94a3b8' }}></i>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.duration}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.telecallerName}</Typography>
                        </TableCell>
                        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
                          <StatusChip status={log.outcome} />
                        </TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap' }}>
                          {matchingRec ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Tooltip title={isPlaying ? "Pause" : "Play"}>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handlePlayToggle(matchingRec)}
                                  sx={{ 
                                    color: isPlaying ? '#ef4444' : '#16a34a',
                                    backgroundColor: isPlaying ? '#fee2e2' : '#f0fdf4',
                                    '&:hover': { backgroundColor: isPlaying ? '#fecaca' : '#dcfce7' }
                                  }}
                                >
                                  <i className={isPlaying ? "bi bi-pause-fill" : "bi bi-play-fill"}></i>
                                </IconButton>
                              </Tooltip>
                              <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#64748b', fontFamily: 'monospace' }}>
                                {matchingRec.name}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="caption" color="text.disabled">No recording</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ fontSize: '0.8125rem', color: '#4b5563' }}>
                            {log.notes}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      
                      {/* Waveform Player Waveform Visualizer */}
                      {isPlaying && (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ py: 1.5, px: 3, backgroundColor: '#f8fafc' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                              <Box sx={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: '#ef4444' }}>
                                  Playing call recording: {matchingRec.name}...
                                </Typography>
                                <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                                  {[8, 14, 6, 16, 9, 12, 5, 11, 7, 15].map((h, i) => (
                                    <Box 
                                      key={i} 
                                      sx={{
                                        width: '2px',
                                        height: `${h}px`,
                                        backgroundColor: '#ef4444',
                                        borderRadius: '1px',
                                        animation: 'pulse 0.8s infinite alternate',
                                        animationDelay: `${i * 0.12}s`,
                                        '@keyframes pulse': {
                                          '0%': { height: '3px' },
                                          '100%': { height: `${h}px` }
                                        }
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                              <LinearProgress variant="determinate" value={playProgress} color="error" sx={{ height: 4, borderRadius: 2 }} />
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

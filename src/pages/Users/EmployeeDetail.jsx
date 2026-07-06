import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, Button, Grid, Avatar, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle,
  DialogContent, DialogActions, IconButton, TextField, InputAdornment, Tooltip
} from '@mui/material';

import PageHeader from '../../components/PageHeader/PageHeader';
import StatusChip from '../../components/StatusChip/StatusChip';
import { telecallers as teleData } from '../../data/telecallerData';
import { getInitials, formatDate } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import { useAppContext } from '../../store/AppContext';

const generateMockClients = (dbId, count, telecallerName) => {
  const names = [
    'Rajesh Kumar', 'Sita Devi', 'Vikram Singh', 'Aarti Sharma', 'Sanjay Patel', 
    'Pooja Gupta', 'Anil Mehta', 'Kiran Reddy', 'Sunil Verma', 'Deepa Nair',
    'Ramesh Rao', 'Geeta Joshi', 'Vijay Iyer', 'Kavita Deshmukh', 'Manoj Saxena',
    'Neha Pandey', 'Rakesh Tiwari', 'Divya Menon', 'Suresh Pillai', 'Jyoti Mishra',
    'Alok Yadav', 'Harish Rawat', 'Preeti Bhatia', 'Ajay Gill', 'Seema Kapoor',
    'Nitin Chaudhury', 'Rekha Sen', 'Abhishek Das', 'Monica Roy', 'Sandeep Bose'
  ];
  const locations = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad'];
  const statuses = ['New Lead', 'Follow Up', 'Interested', 'Not Interested', 'Converted'];
  const sources = ['Google Ads', 'Facebook Lead', 'Reference', 'Cold Call', 'Website Inquiry'];
  
  const clients = [];
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : '');
    // Ensure we have a semi-unique seed for phone number based on dbId
    const seed = parseInt(String(dbId).replace(/\D/g, '') || '0') || 100;
    const mobile = `+91 99887 ${String(71000 + i + (seed % 1000)).padStart(5, '0')}`;
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    const company = `${name.split(' ')[0]} Ventures`;
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const source = sources[i % sources.length];
    const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    
    clients.push({
      name,
      mobile,
      email,
      company,
      leadSource: source,
      location,
      status,
      assign: telecallerName || 'Priya Sharma',
      date,
      duration: `${Math.floor(Math.random() * 3) + 1}m ${String(Math.floor(Math.random() * 60)).padStart(2, '0')}s`
    });
  }
  return clients;
};

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
  const { showToast } = useToast();
  const { state: appState } = useAppContext();

  const currentUserName = appState?.user?.name || 'Arun Patel';

  const [employeeData, setEmployeeData] = useState(null);
  const [databasesList, setDatabasesList] = useState([]);
  
  // Dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [databaseName, setDatabaseName] = useState('');

  // View clients dialog state
  const [viewingDb, setViewingDb] = useState(null);
  const [clientSearch, setClientSearch] = useState('');
  const [playingClientId, setPlayingClientId] = useState(null);

  useEffect(() => {
    const found = teleData.find(tc => tc.id === id);
    if (found) {
      setEmployeeData(found);
      const initial = mockDatabasesMap[found.id] || [
        {
          id: `DB_${found.id}_1`,
          name: `Leads_Campaign_${found.id}.csv`,
          assignDate: found.joinDate,
          clientsCount: found.totalClients || 10,
          createdBy: found.managerName || 'Arun Patel'
        }
      ];
      const initialWithClients = initial.map(db => ({
        ...db,
        clients: db.clients || generateMockClients(db.id, db.clientsCount, found.name)
      }));
      setDatabasesList(initialWithClients);
    } else {
      setEmployeeData(null);
      setDatabasesList([]);
    }
  }, [id]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setDatabaseName(file.name);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "Name,mobile,email,company,lead source,location,current status,assign,date\nAlice Johnson,+91 99887 71122,alice@example.com,Acme Corp,Google Ads,Delhi,New Lead,Priya Sharma,2026-07-06\nBob Smith,+91 99887 71133,bob@example.com,Beta Inc,Facebook Lead,Mumbai,Follow Up,Priya Sharma,2026-07-06\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${employeeData?.name.replace(/\s+/g, '_')}_database_template.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) {
      showToast('Please choose a CSV file first', 'warning');
      return;
    }
    if (!databaseName.trim()) {
      showToast('Please enter a database name', 'warning');
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
      const required = ['name', 'mobile', 'email', 'company', 'lead source', 'location', 'current status', 'assign', 'date'];
      const missing = required.filter(col => !headers.includes(col));

      if (missing.length > 0) {
        showToast(`Invalid CSV headers. Missing columns: ${missing.join(', ')}`, 'error');
        return;
      }

      // Map headers to indices
      const headerIndices = {};
      required.forEach(col => {
        headerIndices[col] = headers.indexOf(col);
      });

      // Parse clients
      const clients = [];
      for (let i = 1; i < lines.length; i++) {
        const row = lines[i].split(',').map(cell => cell.trim());
        if (row.length < headers.length) continue;
        
        clients.push({
          name: row[headerIndices['name']] || '',
          mobile: row[headerIndices['mobile']] || '',
          email: row[headerIndices['email']] || '',
          company: row[headerIndices['company']] || '',
          leadSource: row[headerIndices['lead source']] || '',
          location: row[headerIndices['location']] || '',
          status: row[headerIndices['current status']] || '',
          assign: row[headerIndices['assign']] || '',
          date: row[headerIndices['date']] || '',
          duration: `${Math.floor(Math.random() * 3) + 1}m ${String(Math.floor(Math.random() * 60)).padStart(2, '0')}s`
        });
      }

      const clientCount = clients.length;

      // Update local database list
      const newDb = {
        id: `DB_${Date.now()}`,
        name: databaseName.trim(),
        assignDate: new Date().toISOString().split('T')[0],
        clientsCount: clientCount,
        createdBy: currentUserName,
        clients: clients
      };

      setDatabasesList(prev => [newDb, ...prev]);

      // Update employee stats
      setEmployeeData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          totalClients: (prev.totalClients || 0) + clientCount,
          totalCalls: (prev.totalCalls || 0) + clientCount
        };
      });

      showToast(`Successfully assigned database and ${clientCount} clients to ${employeeData.name}!`, 'success');
      setUploadOpen(false);
      setSelectedFile(null);
      setDatabaseName('');
    };
    reader.readAsText(selectedFile);
  };

  if (!employeeData) {
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
    { title: 'Database Count', value: employeeData.totalCalls, icon: 'bi bi-database', color: '#0343a8', bg: '#eaf4ff' },
    { title: 'Assigned Clients', value: employeeData.totalClients, icon: 'bi bi-people-fill', color: '#10b981', bg: '#ecfdf5' },
    { title: 'Conversions', value: employeeData.converted, icon: 'bi bi-check-circle-fill', color: '#059669', bg: '#f0fdf4' },
    { title: 'Follow-ups', value: employeeData.followUp, icon: 'bi bi-telephone-outbound-fill', color: '#f59e0b', bg: '#fef3c7' },
  ];

  return (
    <Box>
      <PageHeader
        title="Employee Detail"
        subtitle={`Detailed assignment view for ${employeeData.name}`}
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
                {getInitials(employeeData.name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm sx={{ minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="h3" sx={{ fontWeight: 800 }}>
                  {employeeData.name}
                </Typography>
                <StatusChip status={employeeData.status} />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <span><strong>Emp ID:</strong> {employeeData.id}</span>
                <span><strong>Email:</strong> {employeeData.email}</span>
                <span><strong>Mobile:</strong> {employeeData.mobile}</span>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Assigned User (Manager):</strong> {employeeData.managerName || 'None'} • <strong>Joined:</strong> {formatDate(employeeData.joinDate)}
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

      {/* Assigned Databases Table OR Clients Page Style */}
      {!viewingDb ? (
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Assigned Databases
              </Typography>
              <Button
                variant="contained"
                onClick={() => setUploadOpen(true)}
                startIcon={<i className="bi bi-cloud-arrow-up-fill"></i>}
                sx={{
                  background: 'linear-gradient(135deg, #0343a8, #0454cc)',
                  color: '#ffffff',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 3,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #022d71, #0343a8)'
                  }
                }}
              >
                DB Upload
              </Button>
            </Box>
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
                  {databasesList.map((db, index) => (
                    <TableRow key={db.id} hover>
                      <TableCell align="center" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                        {index + 1}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>
                        <Tooltip title="Click to view database clients" arrow>
                          <span
                            style={{
                              color: '#0343a8',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            onClick={() => setViewingDb(db)}
                          >
                            {db.name}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="center">
                        {formatDate(db.assignDate)}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>
                        <Tooltip title="Click to view database clients" arrow>
                          <span
                            style={{
                              color: '#0343a8',
                              cursor: 'pointer',
                              textDecoration: 'none'
                            }}
                            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
                            onClick={() => setViewingDb(db)}
                          >
                            {db.clientsCount}
                          </span>
                        </Tooltip>
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
      ) : (
        <Card>
          <CardContent sx={{ p: 4 }}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton 
                  onClick={() => { setViewingDb(null); setClientSearch(''); setPlayingClientId(null); }}
                  sx={{ 
                    color: '#0343a8', 
                    border: '1.5px solid #0343a8', 
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    '&:hover': {
                      backgroundColor: '#eaf4ff'
                    }
                  }}
                >
                  <i className="bi bi-arrow-left" style={{ fontSize: '1rem' }}></i>
                </IconButton>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>
                    Database: {viewingDb.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Total Clients: {viewingDb.clientsCount} • Created By: {viewingDb.createdBy}
                  </Typography>
                </Box>
              </Box>

              {/* Search Bar inside header */}
              <TextField
                size="small"
                placeholder="Search clients..."
                value={clientSearch}
                onChange={(e) => setClientSearch(e.target.value)}
                sx={{ 
                  width: { xs: '100%', sm: '300px' },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px'
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="bi bi-search" style={{ color: '#64748b' }}></i>
                      </InputAdornment>
                    ),
                  }
                }}
              />
            </Box>

            {/* Clients Table (Page Style) */}
            <TableContainer sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>S.No</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Client Name</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Phone Number</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Company</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Lead Source</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Location</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc', width: '130px' }}>Recorder</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f8fafc' }}>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {viewingDb.clients && viewingDb.clients
                    .filter(c => 
                      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                      c.mobile.includes(clientSearch) ||
                      c.email.toLowerCase().includes(clientSearch.toLowerCase())
                    )
                    .map((client, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell align="center" sx={{ color: 'text.secondary' }}>{idx + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{client.name}</TableCell>
                        <TableCell>{client.mobile}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>{client.company}</TableCell>
                        <TableCell>{client.leadSource}</TableCell>
                        <TableCell>{client.location}</TableCell>
                        <TableCell align="center">
                          <StatusChip status={client.status} />
                        </TableCell>
                        <TableCell align="center">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                if (playingClientId === client.mobile) {
                                  setPlayingClientId(null);
                                } else {
                                  setPlayingClientId(client.mobile);
                                }
                              }}
                              sx={{ 
                                color: playingClientId === client.mobile ? '#ef4444' : '#0343a8',
                                backgroundColor: playingClientId === client.mobile ? '#fee2e2' : '#eaf4ff',
                                padding: '4px',
                                '&:hover': {
                                  backgroundColor: playingClientId === client.mobile ? '#fecaca' : '#d0e8ff',
                                }
                              }}
                            >
                              {playingClientId === client.mobile ? (
                                <i className="bi bi-pause-fill" style={{ fontSize: '1rem' }}></i>
                              ) : (
                                <i className="bi bi-play-fill" style={{ fontSize: '1rem' }}></i>
                              )}
                            </IconButton>
                            <Typography variant="body2" sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', minWidth: '45px', textAlign: 'left' }}>
                              {playingClientId === client.mobile ? (
                                <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                  Playing <i className="bi bi-soundwave" style={{ fontSize: '0.85rem' }}></i>
                                </span>
                              ) : (
                                client.duration || '1m 24s'
                              )}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{formatDate(client.date)}</TableCell>
                      </TableRow>
                    ))}
                  {(!viewingDb.clients || viewingDb.clients.filter(c => 
                      c.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
                      c.mobile.includes(clientSearch) ||
                      c.email.toLowerCase().includes(clientSearch.toLowerCase())
                    ).length === 0) && (
                    <TableRow>
                      <TableCell colSpan={10} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                        No clients found in this database.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* CSV File Upload Modal (Redesigned) */}
      <Dialog 
        open={uploadOpen} 
        onClose={() => { setUploadOpen(false); setSelectedFile(null); }} 
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
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Bulk Upload Databases</Typography>
          <IconButton 
            onClick={() => { setUploadOpen(false); setSelectedFile(null); }}
            sx={{ color: '#ffffff' }}
          >
            <i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, py: 3 }}>
          <Box sx={{ 
            mb: 3, 
            p: 2.5, 
            backgroundColor: '#f8fafc', 
            borderRadius: 3, 
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.5 }}>
              Target Telecaller
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0343a8' }}>
              {employeeData?.name}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <Avatar sx={{ width: 56, height: 56, backgroundColor: '#eaf4ff', color: '#0343a8' }}>
                <i className="bi bi-cloud-arrow-up" style={{ fontSize: '1.8rem' }}></i>
              </Avatar>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2, px: 2 }}>
              Download the template, fill in your client data, and upload it back to the system.
            </Typography>
            <Box sx={{ p: 2, backgroundColor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0', mb: 1, textAlign: 'left' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#475569', mb: 0.5 }}>
                Database Field Names (CSV Columns):
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.4 }}>
                <strong>Name</strong>, <strong>mobile</strong>, <strong>email</strong>, <strong>company</strong>, <strong>lead source</strong>, <strong>location</strong>, <strong>current status</strong>, <strong>assign</strong>, <strong>date</strong>
              </Typography>
            </Box>

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

              <TextField
                fullWidth
                label="Database Name"
                size="small"
                value={databaseName}
                onChange={(e) => setDatabaseName(e.target.value)}
                sx={{ mb: 2, backgroundColor: '#ffffff' }}
              />

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
            onClick={() => { setUploadOpen(false); setSelectedFile(null); }} 
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
            Upload DB
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

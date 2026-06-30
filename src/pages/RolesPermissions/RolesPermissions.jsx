import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid
} from '@mui/material';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useToast } from '../../context/ToastContext';

const initialRoles = [
  { id: 1, name: 'Super Admin', permissions: 'Full Access', users: 2, color: '#0343a8' },
  { id: 2, name: 'Admin', permissions: 'Manage Users, View Reports', users: 5, color: '#6366f1' },
  { id: 3, name: 'Manager', permissions: 'Manage Telecallers, View Team Reports', users: 24, color: '#10b981' },
  { id: 4, name: 'Telecaller', permissions: 'Make Calls, View Own Data', users: 156, color: '#f59e0b' },
  { id: 5, name: 'Viewer', permissions: 'View Only Access', users: 8, color: '#6b7280' },
];

export default function RolesPermissions() {
  const { showToast } = useToast();
  const [roleList, setRoleList] = useState(initialRoles);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({ name: '', permissions: '' });

  const handleEditClick = (role) => {
    setEditingRole(role);
    setFormData({ name: role.name, permissions: role.permissions });
    setOpen(true);
  };

  const handleAddClick = () => {
    setEditingRole(null);
    setFormData({ name: '', permissions: '' });
    setOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.permissions) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (editingRole) {
      setRoleList(prev => prev.map(r => r.id === editingRole.id ? { ...r, name: formData.name, permissions: formData.permissions } : r));
      showToast('Role updated successfully!', 'success');
    } else {
      const newRole = {
        id: roleList.length + 1,
        name: formData.name,
        permissions: formData.permissions,
        users: 0,
        color: '#6366f1'
      };
      setRoleList(prev => [...prev, newRole]);
      showToast('Role added successfully!', 'success');
    }
    setOpen(false);
  };

  return (
    <Box>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Manage user roles, authorization levels, and platform access control"
        breadcrumbs={[{ label: 'Home', path: '/' }, { label: 'Roles & Permissions' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<i className="bi bi-shield-plus"></i>}
            onClick={handleAddClick}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)' }}
          >
            Add Role
          </Button>
        }
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ pl: 4 }}>Role Name</TableCell>
                  <TableCell>Permissions</TableCell>
                  <TableCell align="center">Users Count</TableCell>
                  <TableCell align="center" sx={{ pr: 4 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {roleList.map((role) => (
                  <TableRow key={role.id} hover>
                    <TableCell sx={{ pl: 4 }}>
                      <Chip 
                        label={role.name} 
                        sx={{ 
                          backgroundColor: `${role.color}15`, 
                          color: role.color, 
                          fontWeight: 600,
                          borderRadius: '6px'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {role.permissions}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={role.users} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#f3f4f6', 
                          fontWeight: 600,
                          px: 1
                        }} 
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ pr: 4 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleEditClick(role)}
                        sx={{ color: '#64748b', '&:hover': { color: '#0343a8', backgroundColor: '#eaf4ff' } }}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: '0.95rem' }}></i>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Role Modal */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
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
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {editingRole ? 'Edit Role' : 'Add New Role'}
          </Typography>
          <IconButton onClick={() => setOpen(false)}><i className="bi bi-x-lg" style={{ fontSize: '1.1rem' }}></i></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0 }}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Role Name"
                size="small"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Permissions (comma separated)"
                size="small"
                multiline
                rows={3}
                value={formData.permissions}
                onChange={(e) => setFormData({ ...formData, permissions: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: 'text.secondary' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            sx={{ background: 'linear-gradient(135deg, #0343a8, #0454cc)' }}
          >
            {editingRole ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

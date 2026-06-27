import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';

export default function ExportMenu({ onExport }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleExport = (format) => {
    if (onExport) onExport(format);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<i className="bi bi-download" style={{ fontSize: '0.9rem' }}></i>}
        onClick={handleClick}
        sx={{
          borderColor: '#e5e7eb',
          color: 'text.secondary',
          '&:hover': {
            borderColor: 'primary.main',
            color: 'primary.main',
            backgroundColor: '#eaf4ff',
          },
        }}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            minWidth: 180,
          },
        }}
      >
        <MenuItem onClick={() => handleExport('csv')}>
          <ListItemIcon><i className="bi bi-filetype-csv" style={{ fontSize: '1.1rem', color: '#475569' }}></i></ListItemIcon>
          <ListItemText>Export CSV</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('excel')}>
          <ListItemIcon><i className="bi bi-file-earmark-excel" style={{ fontSize: '1.1rem', color: '#475569' }}></i></ListItemIcon>
          <ListItemText>Export Excel</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleExport('pdf')}>
          <ListItemIcon><i className="bi bi-filetype-pdf" style={{ fontSize: '1.1rem', color: '#475569' }}></i></ListItemIcon>
          <ListItemText>Export PDF</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0343a8',
      light: '#3669bd',
      dark: '#022d71',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a2e',
      secondary: '#6b7280',
    },
    success: {
      main: '#10b981',
      light: '#d1fae5',
    },
    warning: {
      main: '#f59e0b',
      light: '#fef3c7',
    },
    error: {
      main: '#ef4444',
      light: '#fee2e2',
    },
    info: {
      main: '#3b82f6',
      light: '#dbeafe',
    },
    divider: '#e5e7eb',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 800, fontSize: '2rem', lineHeight: 1.2, color: '#000000' },
    h2: { fontWeight: 800, fontSize: '1.5rem', lineHeight: 1.3, color: '#000000' },
    h3: { fontWeight: 800, fontSize: '1.25rem', lineHeight: 1.4, color: '#000000' },
    h4: { fontWeight: 700, fontSize: '1.125rem', lineHeight: 1.4, color: '#000000' },
    h5: { fontWeight: 700, fontSize: '1rem', lineHeight: 1.5, color: '#000000' },
    h6: { fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.5, color: '#000000' },
    subtitle1: { fontWeight: 500, fontSize: '0.9375rem' },
    subtitle2: { fontWeight: 500, fontSize: '0.8125rem', color: '#6b7280' },
    body1: { fontSize: '0.9375rem', lineHeight: 1.6 },
    body2: { fontSize: '0.8125rem', lineHeight: 1.5 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 2px rgba(0,0,0,0.04)',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)',
    '0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04)',
    '0 20px 25px -5px rgba(0,0,0,0.06), 0 10px 10px -5px rgba(0,0,0,0.03)',
    '0 25px 50px -12px rgba(0,0,0,0.15)',
    ...Array(18).fill('0 25px 50px -12px rgba(0,0,0,0.15)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#c1c1c1 transparent',
          '&::-webkit-scrollbar': { width: 6, height: 6 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: 3,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 16px',
          borderBottom: '1px solid #f3f4f6',
        },
        sizeSmall: {
          padding: '12px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
          border: '1px solid #f0f0f0',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 10px 25px -5px rgba(3,76,174,0.1), 0 4px 6px -2px rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(3,76,174,0.25)',
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(3,76,174,0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            transition: 'all 0.2s ease',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(3,76,174,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 0 0 3px rgba(3,76,174,0.12)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            backgroundColor: '#f9fafb',
            borderBottom: '2px solid #e5e7eb',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.15s ease',
          '&:hover': {
            backgroundColor: '#f8faff !important',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;

export const authStats = [
  { id: 1, title: 'Total Active Users', value: 142, change: '+5', trend: 'up', iconClass: 'bi bi-person-check', color: '#10b981' },
  { id: 2, title: 'Logged In Today', value: 98, change: '+12', trend: 'up', iconClass: 'bi bi-box-arrow-in-right', color: '#0343a8' },
  { id: 3, title: 'Logged Out Today', value: 34, change: '+8', trend: 'up', iconClass: 'bi bi-box-arrow-right', color: '#6b7280' },
  { id: 4, title: 'Failed Login Attempts', value: 7, change: '-3', trend: 'down', iconClass: 'bi bi-exclamation-triangle', color: '#ef4444' },
];

export const loginHistory = [
  { id: 1, employeeId: 'TC001', name: 'Priya Sharma', loginTime: '2026-06-27T09:30:00', logoutTime: null, sessionDuration: '-', device: 'Windows PC', browser: 'Chrome 126', ip: '192.168.1.101', status: 'Logged In' },
  { id: 2, employeeId: 'TC002', name: 'Amit Kumar', loginTime: '2026-06-27T09:15:00', logoutTime: '2026-06-27T09:50:00', sessionDuration: '35m', device: 'Android Mobile', browser: 'Chrome Mobile', ip: '192.168.1.102', status: 'Logged Out' },
  { id: 3, employeeId: 'TC003', name: 'Sneha Reddy', loginTime: '2026-06-27T09:00:00', logoutTime: null, sessionDuration: '-', device: 'Windows PC', browser: 'Firefox 127', ip: '192.168.1.103', status: 'Logged In' },
  { id: 4, employeeId: 'TC004', name: 'Rahul Mehta', loginTime: '2026-06-27T08:45:00', logoutTime: null, sessionDuration: '-', device: 'MacBook Pro', browser: 'Safari 19', ip: '192.168.1.104', status: 'Logged In' },
  { id: 5, employeeId: 'TC005', name: 'Neha Patel', loginTime: '2026-06-27T08:30:00', logoutTime: '2026-06-27T09:10:00', sessionDuration: '40m', device: 'iPad', browser: 'Safari 19', ip: '192.168.1.105', status: 'Logged Out' },
  { id: 6, employeeId: 'TC006', name: 'Vikram Joshi', loginTime: '2026-06-27T08:00:00', logoutTime: '2026-06-27T08:30:00', sessionDuration: '30m', device: 'Android Mobile', browser: 'Chrome Mobile', ip: '192.168.1.106', status: 'Session Expired' },
  { id: 7, employeeId: 'TC007', name: 'Anita Deshmukh', loginTime: '2026-06-27T07:45:00', logoutTime: null, sessionDuration: '-', device: 'Windows PC', browser: 'Edge 126', ip: '192.168.1.107', status: 'Logged In' },
  { id: 8, employeeId: 'TC008', name: 'Karan Singh', loginTime: '2026-06-26T17:30:00', logoutTime: '2026-06-26T18:00:00', sessionDuration: '30m', device: 'Windows PC', browser: 'Chrome 126', ip: '192.168.1.108', status: 'Logged Out' },
  { id: 9, employeeId: 'TC009', name: 'Divya Krishnan', loginTime: '2026-06-26T17:00:00', logoutTime: null, sessionDuration: '-', device: 'MacBook Air', browser: 'Chrome 126', ip: '192.168.1.109', status: 'Session Expired' },
  { id: 10, employeeId: 'TC010', name: 'Rohit Verma', loginTime: '2026-06-26T16:45:00', logoutTime: '2026-06-26T18:15:00', sessionDuration: '1h 30m', device: 'Windows PC', browser: 'Firefox 127', ip: '192.168.1.110', status: 'Logged Out' },
  { id: 11, employeeId: 'TC011', name: 'Anjali Menon', loginTime: '2026-06-26T16:30:00', logoutTime: null, sessionDuration: '-', device: 'iPhone', browser: 'Safari Mobile', ip: '192.168.1.111', status: 'Failed Login' },
  { id: 12, employeeId: 'TC012', name: 'Sunil Tiwari', loginTime: '2026-06-26T16:00:00', logoutTime: '2026-06-26T17:30:00', sessionDuration: '1h 30m', device: 'Windows PC', browser: 'Chrome 126', ip: '192.168.1.112', status: 'Logged Out' },
  { id: 13, employeeId: 'TC013', name: 'Pooja Bhatt', loginTime: '2026-06-26T15:30:00', logoutTime: null, sessionDuration: '-', device: 'Android Tablet', browser: 'Chrome Mobile', ip: '192.168.1.113', status: 'Session Expired' },
  { id: 14, employeeId: 'TC014', name: 'Manish Agarwal', loginTime: '2026-06-26T15:00:00', logoutTime: '2026-06-26T18:00:00', sessionDuration: '3h', device: 'Windows PC', browser: 'Chrome 126', ip: '192.168.1.114', status: 'Logged Out' },
  { id: 15, employeeId: 'TC015', name: 'Ritu Saxena', loginTime: '2026-06-26T14:30:00', logoutTime: null, sessionDuration: '-', device: 'MacBook Pro', browser: 'Safari 19', ip: '192.168.1.115', status: 'Failed Login' },
];

export const activityTimeline = [
  { id: 1, name: 'Priya Sharma', action: 'Logged In', time: '2026-06-27T09:30:00', device: 'Windows PC', type: 'login' },
  { id: 2, name: 'Sneha Reddy', action: 'Logged In', time: '2026-06-27T09:00:00', device: 'Windows PC', type: 'login' },
  { id: 3, name: 'Amit Kumar', action: 'Logged Out', time: '2026-06-27T09:50:00', device: 'Android Mobile', type: 'logout' },
  { id: 4, name: 'Rahul Mehta', action: 'Logged In', time: '2026-06-27T08:45:00', device: 'MacBook Pro', type: 'login' },
  { id: 5, name: 'Neha Patel', action: 'Logged Out', time: '2026-06-27T09:10:00', device: 'iPad', type: 'logout' },
  { id: 6, name: 'Vikram Joshi', action: 'Session Expired', time: '2026-06-27T08:30:00', device: 'Android Mobile', type: 'expired' },
  { id: 7, name: 'Anita Deshmukh', action: 'Logged In', time: '2026-06-27T07:45:00', device: 'Windows PC', type: 'login' },
  { id: 8, name: 'Anjali Menon', action: 'Failed Login', time: '2026-06-26T16:30:00', device: 'iPhone', type: 'failed' },
  { id: 9, name: 'Karan Singh', action: 'Logged Out', time: '2026-06-26T18:00:00', device: 'Windows PC', type: 'logout' },
  { id: 10, name: 'Divya Krishnan', action: 'Session Expired', time: '2026-06-26T17:00:00', device: 'MacBook Air', type: 'expired' },
  { id: 11, name: 'Ritu Saxena', action: 'Failed Login', time: '2026-06-26T14:30:00', device: 'MacBook Pro', type: 'failed' },
  { id: 12, name: 'Rohit Verma', action: 'Logged Out', time: '2026-06-26T18:15:00', device: 'Windows PC', type: 'logout' },
];

export const securityAlerts = [
  { id: 1, type: 'warning', title: 'Multiple Device Login', message: 'Priya Sharma logged in from 2 devices simultaneously', time: '2026-06-27T09:30:00' },
  { id: 2, type: 'error', title: 'Failed Login Attempts', message: 'Anjali Menon had 3 consecutive failed login attempts', time: '2026-06-26T16:30:00' },
  { id: 3, type: 'warning', title: 'Unusual Login Time', message: 'Ritu Saxena attempted login at unusual hours', time: '2026-06-26T14:30:00' },
  { id: 4, type: 'info', title: 'Password Changed', message: 'Amit Kumar changed their password successfully', time: '2026-06-26T10:00:00' },
];

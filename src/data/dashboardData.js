export const dashboardStats = [
  { id: 1, title: 'Total Managers', value: 24, change: '+3', trend: 'up', iconClass: 'bi bi-person-badge', color: '#034cae' },
  { id: 2, title: 'Total Telecallers', value: 156, change: '+12', trend: 'up', iconClass: 'bi bi-headset', color: '#6366f1' },
  { id: 3, title: 'Total Clients', value: 3842, change: '+248', trend: 'up', iconClass: 'bi bi-people', color: '#8b5cf6' },
  { id: 4, title: "Today's Calls", value: 1247, change: '+18%', trend: 'up', iconClass: 'bi bi-telephone-outbound', color: '#10b981' },
  { id: 5, title: 'Total Call Duration', value: '486h', change: '+24h', trend: 'up', iconClass: 'bi bi-clock', color: '#f59e0b' },
  { id: 6, title: 'Interested Leads', value: 892, change: '+67', trend: 'up', iconClass: 'bi bi-hand-thumbs-up', color: '#059669' },
  { id: 7, title: 'Not Interested', value: 1456, change: '-5%', trend: 'down', iconClass: 'bi bi-hand-thumbs-down', color: '#ef4444' },
  { id: 8, title: 'Missed/Ringing', value: 324, change: '-12%', trend: 'down', iconClass: 'bi bi-telephone-x', color: '#f97316' },
];

export const dailyCallData = [
  { day: 'Mon', calls: 180, connected: 142, missed: 38 },
  { day: 'Tue', calls: 220, connected: 185, missed: 35 },
  { day: 'Wed', calls: 195, connected: 160, missed: 35 },
  { day: 'Thu', calls: 250, connected: 210, missed: 40 },
  { day: 'Fri', calls: 230, connected: 198, missed: 32 },
  { day: 'Sat', calls: 140, connected: 115, missed: 25 },
  { day: 'Sun', calls: 80, connected: 65, missed: 15 },
];

export const telecallerPerformance = [
  { name: 'Priya S.', calls: 89, conversions: 23, duration: 245 },
  { name: 'Amit K.', calls: 76, conversions: 19, duration: 198 },
  { name: 'Sneha R.', calls: 95, conversions: 28, duration: 312 },
  { name: 'Rahul M.', calls: 68, conversions: 15, duration: 176 },
  { name: 'Neha P.', calls: 82, conversions: 21, duration: 234 },
  { name: 'Vikram J.', calls: 71, conversions: 17, duration: 189 },
  { name: 'Anita D.', calls: 88, conversions: 25, duration: 267 },
  { name: 'Karan S.', calls: 64, conversions: 12, duration: 156 },
];

export const leadStatusData = [
  { name: 'Interested', value: 892, color: '#10b981' },
  { name: 'Not Interested', value: 1456, color: '#ef4444' },
  { name: 'Follow Up', value: 634, color: '#3b82f6' },
  { name: 'Callback', value: 312, color: '#8b5cf6' },
  { name: 'Converted', value: 248, color: '#059669' },
  { name: 'Ringing', value: 300, color: '#f59e0b' },
];

export const monthlyCallReport = [
  { month: 'Jan', calls: 4200, target: 5000 },
  { month: 'Feb', calls: 4800, target: 5000 },
  { month: 'Mar', calls: 5100, target: 5500 },
  { month: 'Apr', calls: 4600, target: 5500 },
  { month: 'May', calls: 5300, target: 5500 },
  { month: 'Jun', calls: 5800, target: 6000 },
  { month: 'Jul', calls: 5500, target: 6000 },
  { month: 'Aug', calls: 6100, target: 6000 },
  { month: 'Sep', calls: 5900, target: 6500 },
  { month: 'Oct', calls: 6400, target: 6500 },
  { month: 'Nov', calls: 6200, target: 6500 },
  { month: 'Dec', calls: 6800, target: 7000 },
];

export const recentLoginActivities = [
  { id: 1, name: 'Priya Sharma', action: 'Logged In', time: '2026-06-27T09:30:00', device: 'Desktop', status: 'success' },
  { id: 2, name: 'Amit Kumar', action: 'Logged Out', time: '2026-06-27T09:15:00', device: 'Mobile', status: 'info' },
  { id: 3, name: 'Sneha Reddy', action: 'Failed Login', time: '2026-06-27T09:00:00', device: 'Desktop', status: 'error' },
  { id: 4, name: 'Rahul Mehta', action: 'Logged In', time: '2026-06-27T08:45:00', device: 'Tablet', status: 'success' },
  { id: 5, name: 'Neha Patel', action: 'Logged In', time: '2026-06-27T08:30:00', device: 'Desktop', status: 'success' },
  { id: 6, name: 'Vikram Joshi', action: 'Session Expired', time: '2026-06-27T08:00:00', device: 'Mobile', status: 'warning' },
];

export const recentCallLogs = [
  { id: 1, telecaller: 'Priya Sharma', client: 'Suresh Gupta', duration: '4m 32s', status: 'Interested', time: '10:30 AM' },
  { id: 2, telecaller: 'Amit Kumar', client: 'Meena Devi', duration: '2m 15s', status: 'Not Interested', time: '10:15 AM' },
  { id: 3, telecaller: 'Sneha Reddy', client: 'Ramesh Iyer', duration: '6m 48s', status: 'Converted', time: '10:00 AM' },
  { id: 4, telecaller: 'Rahul Mehta', client: 'Kavita Singh', duration: '0m 45s', status: 'Ringing', time: '9:45 AM' },
  { id: 5, telecaller: 'Neha Patel', client: 'Arjun Nair', duration: '3m 20s', status: 'Follow Up', time: '9:30 AM' },
  { id: 6, telecaller: 'Vikram Joshi', client: 'Sunita Rao', duration: '5m 10s', status: 'Interested', time: '9:15 AM' },
];

export const latestTelecallers = [
  { id: 1, name: 'Divya Krishnan', department: 'Sales', joinDate: '2026-06-25', status: 'Active' },
  { id: 2, name: 'Rohit Verma', department: 'Support', joinDate: '2026-06-24', status: 'Active' },
  { id: 3, name: 'Anjali Menon', department: 'Sales', joinDate: '2026-06-23', status: 'Training' },
  { id: 4, name: 'Sunil Tiwari', department: 'Retention', joinDate: '2026-06-22', status: 'Active' },
  { id: 5, name: 'Pooja Bhatt', department: 'Sales', joinDate: '2026-06-21', status: 'Active' },
];

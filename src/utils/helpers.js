import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime);
dayjs.extend(duration);

export const formatDuration = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
};

export const formatDate = (date) => dayjs(date).format('DD MMM YYYY');

export const formatDateTime = (date) => dayjs(date).format('DD MMM YYYY, hh:mm A');

export const formatTime = (date) => dayjs(date).format('hh:mm A');

export const timeAgo = (date) => dayjs(date).fromNow();

export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status) => {
  const map = {
    active: '#10b981',             // Emerald Green
    inactive: '#ef4444',           // Bright Red
    interested: '#16a34a',         // Grass Green
    'not interested': '#dc2626',   // Crimson Red
    ringing: '#ca8a04',            // Gold
    'follow up': '#ea580c',        // Dark Orange
    'follow-up required': '#f97316', // Orange
    'follow-up scheduled': '#b45309', // Amber Orange
    'callback requested': '#7c3aed', // Purple
    converted: '#0d9488',          // Teal
    'logged in': '#65a30d',        // Lime Green
    'logged out': '#4b5563',       // Dark Grey
    'session expired': '#d97706',  // Amber
    'failed login': '#db2777',     // Deep Pink
    'new lead': '#3b82f6',         // Indigo-blue
    'lead received': '#0284c7',    // Sky Blue
    'lead created': '#4b5563',     // Slate Grey
    contacted: '#4f46e5',          // Indigo
    pending: '#a1a1aa',            // Light zinc grey
    completed: '#059669',          // Dark Emerald
    missed: '#be123c',             // Rose red
  };
  return map[status?.toLowerCase()] || '#6b7280';
};

export const getStatusBgColor = (status) => {
  const map = {
    active: '#d1fae5',
    inactive: '#fee2e2',
    interested: '#f0fdf4',
    'not interested': '#fef2f2',
    ringing: '#fef9c3',
    'follow up': '#fff7ed',
    'follow-up required': '#ffedd5',
    'follow-up scheduled': '#fef3c7',
    'callback requested': '#f5f3ff',
    converted: '#f0fdfa',
    'logged in': '#f7fee7',
    'logged out': '#f3f4f6',
    'session expired': '#fffbeb',
    'failed login': '#fdf2f8',
    'new lead': '#dbeafe',
    'lead received': '#e0f2fe',
    'lead created': '#f1f5f9',
    contacted: '#e0e7ff',
    pending: '#f4f4f5',
    completed: '#ecfdf5',
    missed: '#ffe4e6',
  };
  return map[status?.toLowerCase()] || '#f3f4f6';
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toString() || '0';
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const getRandomColor = () => {
  const colors = ['#0343a8', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

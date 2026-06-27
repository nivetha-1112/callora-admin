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
    active: '#10b981',
    inactive: '#ef4444',
    interested: '#10b981',
    'not interested': '#ef4444',
    ringing: '#f59e0b',
    'follow up': '#3b82f6',
    'callback requested': '#8b5cf6',
    converted: '#059669',
    'logged in': '#10b981',
    'logged out': '#6b7280',
    'session expired': '#f59e0b',
    pending: '#f59e0b',
    completed: '#10b981',
    missed: '#ef4444',
  };
  return map[status?.toLowerCase()] || '#6b7280';
};

export const getStatusBgColor = (status) => {
  const map = {
    active: '#d1fae5',
    inactive: '#fee2e2',
    interested: '#d1fae5',
    'not interested': '#fee2e2',
    ringing: '#fef3c7',
    'follow up': '#dbeafe',
    'callback requested': '#ede9fe',
    converted: '#d1fae5',
    'logged in': '#d1fae5',
    'logged out': '#f3f4f6',
    'session expired': '#fef3c7',
    pending: '#fef3c7',
    completed: '#d1fae5',
    missed: '#fee2e2',
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
  const colors = ['#034cae', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  return colors[Math.floor(Math.random() * colors.length)];
};

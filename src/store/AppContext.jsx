import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  sidebarOpen: true,
  sidebarMobileOpen: false,
  user: {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@telecall.in',
    role: 'Super Admin',
    avatar: null,
  },
  notifications: [
    { id: 1, title: 'New Telecaller Added', message: 'Priya Sharma has been added', time: '5 min ago', read: false },
    { id: 2, title: 'Daily Report Ready', message: 'Yesterday\'s call report is ready', time: '1 hr ago', read: false },
    { id: 3, title: 'Failed Login Attempt', message: 'Multiple failed logins detected for Amit', time: '2 hrs ago', read: true },
  ],
  themeMode: 'light',
};

function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'TOGGLE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: !state.sidebarMobileOpen };
    case 'CLOSE_MOBILE_SIDEBAR':
      return { ...state, sidebarMobileOpen: false };
    case 'SET_THEME':
      return { ...state, themeMode: action.payload };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}

export default AppContext;

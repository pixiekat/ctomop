import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import { Login } from './components/Auth/Login';
import { AuthCallback } from './components/Auth/AuthCallback';
import PatientList from './components/Patient/PatientList';
import PatientDetail from './components/Patient/PatientDetail';
import UploadFHIR from './components/Patient/UploadFHIR';
import UploadCSV from './components/Patient/UploadCSV';
import { useAuth } from './hooks/useAuth';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AppRoutes: React.FC = () => {
  const { currentUser, loading: authLoading, refresh } = useAuth();
  const location = useLocation();

  // Refresh auth when returning from OAuth
  useEffect(() => {
    if (location.pathname === '/auth/callback') {
      // Give the backend a moment to set up the session
      setTimeout(() => {
        refresh();
      }, 500);
    }
  }, [location.pathname, refresh]);

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected routes */}
      <Route
        path="/"
        element={
          currentUser ? <PatientList /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/patient/:personId"
        element={
          currentUser ? <PatientDetail /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/upload-fhir"
        element={
          currentUser ? <UploadFHIR /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/upload-csv"
        element={
          currentUser ? <UploadCSV /> : <Navigate to="/login" replace />
        }
      />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*
        basename keeps client-side routes in sync with the subpath the app is
        mounted under (e.g. /ctomop on prod behind a reverse proxy). CRA bakes
        process.env.PUBLIC_URL from the "homepage" field in package.json at
        build time, and from the PUBLIC_URL env var at dev-server time. When
        mounted at the root the value is "", so this stays a safe no-op.
      */}
      <Router basename={process.env.PUBLIC_URL}>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  );
};

export default App;

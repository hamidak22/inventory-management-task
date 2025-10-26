import { createTheme } from '@mui/material';

const theme = createTheme({
  direction: 'ltr',
  spacing: 4,

  palette: {
    primary: {
      main: '#2e7d32',
      light: '#60ad66',
      dark: '#1b5e20',
      contrastText: '#ffffff',
      A100: '#81c784',
    },
    secondary: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#388e3c',
      contrastText: '#ffffff',
      A100: '#b2fab4',
    },
    error: {
      main: '#d32f2f',
      light: '#ff6659',
      dark: '#9a0007',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f57c00',
    },
    success: {
      main: '#2e7d32',
      light: '#60ad66',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#4fb3f6',
      dark: '#005b9f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f7f5',
      paper: '#ffffff',
    },
  }
});

export default theme;

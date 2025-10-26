import AppSidebar from '@/components/layout/sidebar';
import '@/styles/globals.css';
import theme from '@/styles/theme';
import { ThemeProvider } from '@mui/material';

export default function App({ Component, pageProps }) {
  return <ThemeProvider theme={theme}>
    <AppSidebar/>
    <Component {...pageProps} />
  </ThemeProvider>;
}


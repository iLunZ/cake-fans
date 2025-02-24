import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import Header from '../components/Header';
import { LoginDialogProvider } from '../contexts/LoginDialogContext';
import { AuthProvider } from '../contexts/AuthContext';


const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#81c784',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Cake Fans - No cakes, no life!</title>
        <meta name="description" content="Share and discover amazing cakes from our community of cake lovers" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/cake.ico" />
        <meta property="og:title" content="Cake Fans" />
        <meta property="og:description" content="Share and discover amazing cakes from our community of cake lovers" />
        <meta property="og:image" content="/slice_cake.png" />
      </Head>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <LoginDialogProvider>
            <CssBaseline />
            <Header />
            <Component {...pageProps} />
          </LoginDialogProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import Header from '../components/Header';
import { LoginDialogProvider } from '../contexts/LoginDialogContext';
import { AuthProvider } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {LoadingOverlay} from '../components/LoadingLay';
import { Analytics } from "@vercel/analytics/react";

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF85A2', // Sweet pink like strawberry frosting
      light: '#FFA5BD',
      dark: '#E66B87',
    },
    secondary: {
      main: '#FFB74D', // Warm orange like caramel
      light: '#FFD180',
      dark: '#FF9D1B',
    },
    background: {
      default: '#FFF9F9', // Soft cream background
      paper: '#FFFFFF',
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

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
            {isLoading && <LoadingOverlay />}
            <Header />
            <Component {...pageProps} />
            <Analytics />
          </LoginDialogProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
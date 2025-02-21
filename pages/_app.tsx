import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme } from '@mui/material/styles'
import Header from '../components/Header'
import { LoginDialogProvider } from '../contexts/LoginDialogContext'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#81c784',
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <LoginDialogProvider>
        <CssBaseline />
        <Header />
        <Component {...pageProps} />
      </LoginDialogProvider>
    </ThemeProvider>
  )
}

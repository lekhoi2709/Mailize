import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { SessionProvider } from 'next-auth/react'

const darkTheme = createTheme({
   palette: {
      mode: 'dark',
   },
})

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
   return (
      <SessionProvider session={session}>
         <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Component {...pageProps} />
         </ThemeProvider>
      </SessionProvider>
   )
}

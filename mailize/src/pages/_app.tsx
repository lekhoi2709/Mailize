import '@/styles/globals.css'

import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import NextNProgress from 'nextjs-progressbar'

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
            <NextNProgress color='#006fff' options={{ showSpinner: false }} />
            <Component {...pageProps} />
         </ThemeProvider>
      </SessionProvider>
   )
}

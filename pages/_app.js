import Header from '../sections/header/header'
import Footer from '../sections/footer/footer'

import { ThemeProvider } from "next-themes";
import { useState } from 'react'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from '@/utilities/supabase'

import "../styles/base.scss";

export default function MyApp({ Component, pageProps }) {

    const [supabaseClient] = useState(() => supabase)

    return <>
        <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
        >
            <ThemeProvider>
                <Header/>
                <Component {...pageProps} />
                <Footer/>
            </ThemeProvider>
        </SessionContextProvider>
    </>
  }

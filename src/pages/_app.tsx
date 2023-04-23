import '@/styles/globals.css'
import axios, { AxiosError } from 'axios'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useEffect } from 'react'

const poppins = Poppins({weight: ["400","600","700"], subsets: ["latin-ext"]})

export default function App({ Component, pageProps }: AppProps) {

    useEffect(() => {
        const interval = setInterval(() => {
            if (!localStorage.getItem("refresh_token")) return;
            axios.get('/api/auth/refresh', {headers: {"Authorization": localStorage.getItem("refresh_token")}})
            .then((res)=>{
                localStorage.setItem("refresh_token", res.data["refresh_token"]);
                localStorage.setItem("resource_token", res.data["resource_token"]);
            }).catch((err: AxiosError<any, any>)=>{
                if (err.status == 401) {
                    localStorage.removeItem("refresh_token");
                    localStorage.removeItem("resource_token");
                    console.error(err);
                }
            })
        }, 120000); // 2 minutes
        return () => clearInterval(interval);
    }, []);
    
    return (
        <>
            <Head>
                <title>Spaghetti Chat</title>
                <meta name="description" content="TODO" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={poppins.className}>
                <Component {...pageProps} />
            </div>
        </>
    )
}

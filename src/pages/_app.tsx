import { AuthContext } from '@/context/AuthContext'
import '@/styles/globals.css'
import axios, { AxiosError } from 'axios'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import Head from 'next/head'
import { useEffect, useState } from 'react'

const poppins = Poppins({weight: ["400","600","700"], subsets: ["latin-ext"]})

export default function App({ Component, pageProps }: AppProps) {

    var refreshToken: string|undefined = undefined;
    
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [resourceToken, setResourceToken] = useState<string>();
    const [awaitAuth, setAwaitAuth] = useState<Promise<void>>();

    function updateTokens() {
        return new Promise<void>((res)=>{
            if (!refreshToken) return res();

            axios.get('/api/auth/refresh', {headers: {"Authorization": refreshToken}})
            .then((res)=>{
                setLoggedIn(true);
                refreshToken = res.data["refresh_token"];
                setResourceToken(res.data["resource_token"]);

                localStorage.setItem("session_token", res.data["refresh_token"]);
            }).catch((err: AxiosError<any, any>)=>{
                if (err.status == 401) {
                    setLoggedIn(false);
                    refreshToken = undefined;
                    setResourceToken(undefined);
                    localStorage.removeItem("session_token");
                }
                console.error(err);
            }).finally(()=>{
                res();
                if (awaitAuth) setAwaitAuth(undefined);
            })
        });
    }

    useEffect(() => {
        console.log("useEffect called")
        var _refreshToken = localStorage.getItem("session_token");
        if (_refreshToken) {
            console.log("Found existing token");
            setLoggedIn(true);
            refreshToken = _refreshToken;
            setAwaitAuth(updateTokens());
            awaitAuth?.then(()=>{console.log("Resource token available", resourceToken?.substring(0,5))});
        } else {
            console.log("Could not find existing token");
        }
        const interval = setInterval(updateTokens, 120000);
        return () => clearInterval(interval);
    }, []);

    function setTokens(_refreshToken: string|undefined, resourceToken: string|undefined) {
        console.log("Tokens updated", _refreshToken?.substring(0,5), resourceToken?.substring(0,5))
        if (_refreshToken && resourceToken) setLoggedIn(true);
        refreshToken = _refreshToken;
        setResourceToken(resourceToken);

        if (refreshToken) localStorage.setItem('session_token', refreshToken);
        else localStorage.removeItem('session_token');
    }
    
    return (
        <AuthContext.Provider value={{loggedIn, resourceToken, awaitAuth, updateAuth: setTokens}}>
            <Head>
                <title>{ pageProps.title ? `${pageProps.title} | Spaghetti Chat` : `Spaghetti Chat`}</title>
                <meta name="description" content="TODO" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={poppins.className}>
                <Component {...pageProps} />
            </div>
        </AuthContext.Provider>
    )
}

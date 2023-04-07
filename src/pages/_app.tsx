import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Poppins } from 'next/font/google'
import Head from 'next/head'

const poppins = Poppins({weight: ["400","600","700"], subsets: ["latin-ext"]})

export default function App({ Component, pageProps }: AppProps) {
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

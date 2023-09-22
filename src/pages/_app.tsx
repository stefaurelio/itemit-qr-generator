import type { AppProps } from 'next/app'
import localFont from 'next/font/local'
import Head from 'next/head'
import '~/styles/main.css'

const inter = localFont({
  src: [
    {
      path: '../../public/fonts/Inter-roman.var.woff2',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Inter-italic.var.woff2',
      style: 'italic',
    },
  ],
  weight: '100 900',
  variable: '--font-inter',
})

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          :root {
            --font-inter: ${inter.variable};
          }
        `}</style>
      </Head>

      <Component {...pageProps} />
    </>
  )
}

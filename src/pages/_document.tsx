import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(): JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <body className="min-w-xs antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

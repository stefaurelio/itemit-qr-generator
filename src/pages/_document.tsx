import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(): JSX.Element {
  return (
    <Html lang="en">
      <Head />
      <body className="min-w-xs bg-gray-200 antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

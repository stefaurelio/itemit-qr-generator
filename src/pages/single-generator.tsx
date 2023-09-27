import QRCodeDocument from './components/QRCodeDocument'
import QRGenerator from './components/QRCodeGenerator'
import html2canvas from 'html2canvas'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

export default function SingeGenerator(): JSX.Element {
  const [qrValue, setQrValue] = useState('https://itemit.com')
  const handleQRGenerate = (event: any) => {
    const { value } = event.target
    setQrValue(value)
  }

  const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    }
  )

  const downloadQRCode = () => {
    // Generate download with use canvas and stream
    const elementToCapture = document.getElementById('qr-generated')

    if (elementToCapture) {
      // Use html2canvas to capture the element
      html2canvas(elementToCapture, {
        useCORS: true, // Required for external images
        backgroundColor: null, // Set the background color to transparent
      }).then((canvas) => {
        // Append the canvas to the DOM or do further processing
        const QRCanvas = canvas

        if (QRCanvas) {
          const pngUrl = QRCanvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
          const downloadLink = document.createElement('a')

          downloadLink.href = pngUrl
          downloadLink.download = `${qrValue}.png`

          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      })
    }
  }
  return (
    <main className="container my-12 flex flex-col gap-20 lg:flex-row">
      <section className="mx-auto mt-16 max-w-xl">
        <Image
          src={'/itemit-logo.svg'}
          alt="itemit logo"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h1 className="text-center text-display-sm font-semibold text-gray-700 lg:text-display-lg">
          QR Code Generator
        </h1>
        <p className="mt-2 text-center text-gray-500">
          powered by{' '}
          <Link className="text-primary-500" href="www.itemit.com">
            itemit.com
          </Link>
        </p>
        <label className="mt-16 block">
          <span className="block text-md font-medium text-gray-700">Enter QR link</span>
          <div className="mt-1.5 flex space-x-3">
            <input
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-gray-700  placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="e.g. https://itemit.com"
              onChange={handleQRGenerate}
              defaultValue={qrValue}
            />
          </div>
          <span className="mt-2 block text-md font-medium text-gray-700">
            <Link className="text-gray-500 hover:text-primary-500" href="/">
              Generate bulk QR instead
            </Link>
          </span>
        </label>
        <button
          className="mx-auto mt-8 w-full rounded-lg border border-primary-500 bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
          onClick={downloadQRCode}
        >
          Download PNG
        </button>

        {qrValue && (
          <PDFDownloadLink document={<QRCodeDocument ids={['1']} />} fileName="qrcode.pdf">
            {({ loading }) =>
              loading ? (
                <div className="mx-auto mt-4 flex space-x-2 text-gray-700">
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-primary-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                <button className="mx-auto mt-4 w-full rounded-lg border border-primary-500 bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700">
                  Download PDF
                </button>
              )
            }
          </PDFDownloadLink>
        )}
      </section>
      <section>
        <div className="mx-auto rounded-2xl bg-white px-9 py-10" id="qr-generated">
          <QRGenerator value={qrValue} documentId={1} QRsize={580} isBulk={false} />
        </div>
      </section>
    </main>
  )
}

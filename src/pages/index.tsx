import html2canvas from 'html2canvas'
import React, { useState } from 'react'
import { QRCode } from 'react-qrcode-logo'

export default function Home(): JSX.Element {
  const [qrValue, setQrValue] = useState('https://itemit.com')
  const handleQRGenerate = (event: any) => {
    const { value } = event.target
    setQrValue(value)
  }

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
        <h1 className="text-center text-display-sm font-semibold text-gray-700 lg:text-display-lg">
          itemit QR Code Generator
        </h1>
        <label className="mt-16 block">
          <span className="block text-sm font-medium text-gray-700">Enter QR link</span>
          <div className="mt-1.5 flex space-x-3">
            <input
              className="w-full rounded-lg border border-gray-400 px-3 py-2 text-gray-700  placeholder-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100"
              placeholder="e.g. https://itemit.com"
              onChange={handleQRGenerate}
            />
          </div>
        </label>
      </section>
      <section>
        <div
          className="mx-auto h-[680px] w-[680px] rounded-2xl bg-white px-9 py-10"
          id="qr-generated"
        >
          <QRCode
            value={qrValue}
            size={480}
            quietZone={0}
            ecLevel={'H'}
            fgColor={'#5BBFBE'}
            eyeColor={{
              outer: '#4B9C9C',
              inner: '#5BBFBE',
            }}
            eyeRadius={2}
          />
          <div className="mt-8 text-center">
            <h1 className="text-display-md font-medium tracking-widest text-gray-700">
              Tracked by itemit
            </h1>
            <p className="mt-2 text-display-sm tracking-wider text-gray-400">itemit.com</p>
          </div>
        </div>

        <button
          className="mx-auto mt-8 w-full rounded-lg border border-primary-500 bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700"
          onClick={downloadQRCode}
        >
          Download
        </button>
      </section>
    </main>
  )
}

import QRCodeDocument from './components/QRCodeDocument'
import QRGenerator from './components/QRCodeGenerator'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import Papa from 'papaparse'
import React, { useState } from 'react'

export default function Home(): JSX.Element {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [isGenerating, setGenerating] = useState(false)
  const [qrCodeIds, setQrCodeIds] = useState<string[]>([])

  const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => (
        <div className="mt-16 flex flex-col items-center space-x-2 text-gray-700">
          <Image src={'/pulse-ring.svg'} width={80} height={80} alt={'spinner'} />
          <span className="mt-2 text-md text-gray-700">Loading...</span>
        </div>
      ),
    }
  )

  const uploadFileHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    //setLoading true
    setGenerating(true)

    try {
      const results = await new Promise<any>((resolve, reject) => {
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          complete: resolve,
          error: reject,
        })
      })
      const data = results.data
      const ids = data.map((_: any, index: any) => index)

      setCsvData(data)
      setQrCodeIds(ids)
      setGenerating(false)
    } catch (error) {
      console.error('Error parsing CSV file:', error)
      setGenerating(false)
      // Handle the error as needed
    }
  }

  return (
    <main className="container my-12 flex flex-col gap-8">
      <section className="mx-auto mt-16 max-w-xl">
        <Image
          src={'/itemit-logo.svg'}
          alt="itemit logo"
          width={100}
          height={100}
          className="mx-auto"
        />
        <h1 className="text-center text-display-sm font-semibold text-gray-700 lg:text-display-lg">
          Bulk QR Code Generator
        </h1>
        <p className="mt-2 text-center text-gray-500">
          powered by{' '}
          <Link className="text-primary-500" href="https://www.itemit.com">
            itemit.com
          </Link>
        </p>
        <label className="mt-16  block">
          <span className="block text-md font-medium text-gray-700">Upload CSV File</span>
          <div className="mt-1.5">
            <input
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
              type="file"
              name="file"
              onChange={uploadFileHandler}
              accept=".csv"
            />
          </div>
          <span className="mt-2 block text-md font-medium text-gray-700">
            <Link className="text-gray-500 hover:text-primary-500" href="/single-generator">
              Generate a single QR instead
            </Link>
          </span>
        </label>
      </section>
      <section className="mx-auto">
        {isGenerating && (
          <div className="mt-16 flex flex-col items-center space-x-2 text-gray-700">
            <Image src={'/pulse-ring.svg'} width={80} height={80} alt={'spinner'} />
            <span className="mt-2 text-md text-gray-700">Generating QR Codes...</span>
          </div>
        )}

        <div className="mx-auto max-w-md">
          {csvData.length > 0 && qrCodeIds && (
            <PDFDownloadLink document={<QRCodeDocument ids={qrCodeIds} />} fileName="qrcode.pdf">
              {({ loading }) =>
                loading ? (
                  <div className="mt-16 flex flex-col items-center space-x-2 text-gray-700">
                    <Image src={'/pulse-ring.svg'} width={80} height={80} alt={'spinner'} />
                    <span className="mt-2 text-md text-gray-700">Processing PDF...</span>
                  </div>
                ) : (
                  <button className="mx-auto mt-8 w-full rounded-lg border border-primary-500 bg-primary-500 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-700">
                    Download PDF
                  </button>
                )
              }
            </PDFDownloadLink>
          )}
        </div>
        <div className="mt-8 grid grid-cols-4 gap-6">
          {csvData.map((row, index) => {
            return (
              <div key={index}>
                <QRGenerator value={row[0]} documentId={index} QRsize={300} isBulk={true} />
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}

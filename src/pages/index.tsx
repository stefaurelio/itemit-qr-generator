import QRCodeDocument from './components/QRCodeDocument'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import Papa from 'papaparse'
import React, { useState, useEffect, Suspense } from 'react'

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <div className="mt-16 flex flex-col items-center space-x-2 text-gray-700">
        <span className="mt-2 text-md text-gray-700">Waiting for PDF to generate...</span>
      </div>
    ),
  }
)

function BulkQRCodeGenerator(): JSX.Element {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [isGenerating, setGenerating] = useState(false)
  const [qrCodeIds, setQrCodeIds] = useState<string[]>([])
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    // Implement lazy loading here for QR code generation component
    import('./components/QRCodeGenerator').then((module) => {
      setQRCodeGeneratorModule(module)
    })
  }, [])

  const [QRCodeGeneratorModule, setQRCodeGeneratorModule] = useState<any | null>(null)

  const handleUploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0]
    setLoading(true)

    try {
      const results = await new Promise<any>((resolve, reject) => {
        Papa.parse(file, {
          header: false,
          skipEmptyLines: true,
          fastMode: true,
          complete: resolve,
          error: reject,
        })
      })

      const data = results.data
      setCsvData(data)

      // Generate QR codes in batches of 100
      const batchSize = 100
      let batchIndex = 0
      const qrIds: string[] = []

      const generateNextBatch = () => {
        if (batchIndex * batchSize < data.length) {
          const batch = data.slice(batchIndex * batchSize, (batchIndex + 1) * batchSize)
          const batchIds = batch.map((_: any, index: any) => index)
          qrIds.push(...batchIds)
          setCurrentBatchIndex(batchIndex)
          batchIndex++
          setTimeout(generateNextBatch, 500) // Add a delay
        } else {
          setQrCodeIds(qrIds)
          setGenerating(false)
        }
      }

      setQrCodeIds([])
      setLoading(false)
      setGenerating(true)

      generateNextBatch()
    } catch (error) {
      console.error('Error parsing CSV file:', error)
      setGenerating(false)
    }
  }

  return (
    <main className="container my-12 flex flex-col gap-8">
      <section className="mx-auto mt-16 max-w-xl">
        {/* ... Logo and title */}
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
          {/* ... Upload file input */}
          <span className="block text-md font-medium text-gray-700">Upload CSV File</span>
          <div className="mt-1.5">
            <input
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
              type="file"
              name="file"
              onChange={handleUploadFile}
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
        {isLoading && <LoadingSpinner message="Preparing to generate your QR Codes..." />}
        {isGenerating && (
          <LoadingSpinner message={`Generating Batch ${currentBatchIndex + 1} of QR Codes...`} />
        )}

        <div className="mx-auto max-w-md">
          {qrCodeIds.length > 0 && (
            <PDFDownloadLink
              document={<QRCodeDocument ids={qrCodeIds} />}
              fileName={`qrcode-${csvData.length}.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  <LoadingSpinner message="Please wait while we process your PDF..." />
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
          {csvData.map((row, index) => (
            <Suspense
              fallback={<LoadingSpinner message="Loading QR Code Generator..." />}
              key={index}
            >
              {QRCodeGeneratorModule && (
                <QRCodeGeneratorModule.default
                  value={row[0]}
                  documentId={index}
                  QRsize={300}
                  isBulk={true}
                />
              )}
            </Suspense>
          ))}
        </div>
      </section>
    </main>
  )
}

function LoadingSpinner({ message }: { message: string }): JSX.Element {
  return (
    <div className="mt-16 flex flex-col items-center space-x-2 text-gray-700">
      <span className="mt-2 text-md text-gray-700">{message}</span>
    </div>
  )
}

export default BulkQRCodeGenerator

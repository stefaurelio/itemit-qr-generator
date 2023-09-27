import React from 'react'
import { QRCode } from 'react-qrcode-logo'

interface QRGeneratorProps {
  value: string
  documentId: any
  QRsize: number
  isBulk: boolean
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, documentId, QRsize, isBulk }) => {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <QRCode
        id={documentId}
        value={value}
        size={QRsize}
        quietZone={0}
        ecLevel={'H'}
        fgColor={'#5BBFBE'}
        eyeColor={{
          outer: '#4B9C9C',
          inner: '#5BBFBE',
        }}
        eyeRadius={2}
      />
      <div className="mt-6 text-center">
        {isBulk ? (
          <>
            <h1 className="text-md font-semibold tracking-widest text-gray-700">
              Tracked by itemit
            </h1>
            <p className="mt-2 text-sm tracking-wider text-gray-400">itemit.com</p>
          </>
        ) : (
          <>
            <h1 className="text-display-md font-semibold tracking-widest text-gray-700">
              Tracked by itemit
            </h1>
            <p className="mt-2 text-display-sm tracking-wider text-gray-400">itemit.com</p>
          </>
        )}
      </div>
    </div>
  )
}

export default QRGenerator

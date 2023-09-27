import React from 'react'
import { QRCode } from 'react-qrcode-logo'

interface QRGeneratorProps {
  value: string
  documentId: any
  QRsize: number
  isBulk: boolean
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, documentId, QRsize, isBulk }) => {
  const commonHeadingClass = isBulk
    ? 'text-md font-semibold tracking-widest'
    : 'text-display-md font-semibold tracking-widest'

  const commonTextClass = isBulk
    ? 'mt-2 text-sm tracking-wider'
    : 'mt-2 text-display-sm tracking-wider'

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
        <h1 className={`text-gray-700 ${commonHeadingClass}`}>Tracked by itemit</h1>
        <p className={`text-gray-400 ${commonTextClass}`}>itemit.com</p>
      </div>
    </div>
  )
}

export default QRGenerator

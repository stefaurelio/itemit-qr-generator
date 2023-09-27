import { Document, Page, Image, View, Text, Font } from '@react-pdf/renderer'
import React from 'react'
import { createTw } from 'react-pdf-tailwind'

// Register fonts and create tw object outside the components
Font.register({
  family: 'Inter',
  fonts: [
    {
      src: '/fonts/Inter-Medium.woff',
      fontStyle: 'normal',
      fontWeight: 'medium',
    },
    {
      src: '/fonts/Inter-SemiBold.woff',
      fontStyle: 'normal',
      fontWeight: 'semibold',
    },
  ],
})

const tw = createTw({
  theme: {
    fontFamily: {
      sans: ['Inter'],
    },
    extend: {
      colors: {
        white: '#ffffff',
        gray: {
          400: '#98a2b3',
          700: '#344054',
        },
      },
    },
    fontSize: {
      'display-sm': ['1.875rem'],
      'display-md': ['2.25rem'],
    },
    letterSpacing: {
      wider: ['0.05em'],
      widest: ['0.1rem'],
    },
  },
})

// Extract a separate component for QRCodePage content
const QRCodeContent: React.FC<{ dataUrl: string }> = ({ dataUrl }) => (
  <View style={tw('mt-8 text-center')}>
    <Text style={tw('font-sans text-display-md font-semibold tracking-widest text-gray-700')}>
      Tracked by itemit
    </Text>
    <Text style={tw('mt-2 font-sans text-display-sm font-medium tracking-wider text-gray-400')}>
      itemit.com
    </Text>
  </View>
)

interface QRCodePageProps {
  id: string
}

const QRCodePage: React.FC<QRCodePageProps> = ({ id }) => {
  const canvasElement = document.getElementById(id) as HTMLCanvasElement // Cast to HTMLCanvasElement
  const dataUrl = canvasElement?.toDataURL() || ''
  return (
    <Page key={`page_${id}`} size="LETTER" orientation="landscape" wrap={false}>
      <View style={tw('mx-auto h-full w-[680px] rounded-2xl bg-white px-9 py-10')}>
        <Image src={dataUrl} style={tw('mx-auto w-[480px] h-[480px]')} />
        <QRCodeContent dataUrl={dataUrl} />
      </View>
    </Page>
  )
}

interface QRCodeDocumentProps {
  ids: string[]
}

const QRCodeDocument: React.FC<QRCodeDocumentProps> = ({ ids }) => {
  return (
    <Document>
      {ids?.map((id) => (
        <QRCodePage key={id} id={id} />
      ))}
    </Document>
  )
}

export default QRCodeDocument

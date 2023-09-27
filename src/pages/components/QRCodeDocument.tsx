import { Document, Page, Image, View, Text, Font } from '@react-pdf/renderer'
import React from 'react'
import { createTw } from 'react-pdf-tailwind'

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
        <View style={tw('mt-8 text-center')}>
          <Text style={tw('font-sans text-display-md font-semibold tracking-widest text-gray-700')}>
            Tracked by itemit
          </Text>
          <Text
            style={tw('mt-2 font-sans text-display-sm font-medium tracking-wider text-gray-400')}
          >
            itemit.com
          </Text>
        </View>
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

// Create your tw object with your theme configuration
const tw = createTw({
  theme: {
    fontFamily: {
      sans: ['Inter'],
    },
    extend: {
      colors: {
        white: '#ffffff',
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f2f4f7',
          200: '#eaecf0',
          300: '#d0d5dd',
          400: '#98a2b3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#1d2939',
          900: '#101828',
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

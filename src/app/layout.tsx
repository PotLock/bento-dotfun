import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { WalletProvider } from '@/context/WalletContext'
import LayoutCustom from '@/components/LayoutCustom'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Markdown Editor',
  description: 'A decentralized markdown editor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Toaster position="top-center" />
        <WalletProvider>
          <LayoutCustom>
            {children}
          </LayoutCustom>
        </WalletProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { AuthProvider } from '@/app/contexts/AuthContext'
import ProtectedRoute from '@/app/components/auth/ProtectedRoute'
import Header from '@/app/components/layout/Header'
import Footer from '@/app/components/layout/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sales Tool - Metal America',
  description: 'Partner coverage and pricing tool',
  icons: {
    icon: '/ma-mascot.svg',
    shortcut: '/ma-mascot.svg',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <ProtectedRoute>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  )
}


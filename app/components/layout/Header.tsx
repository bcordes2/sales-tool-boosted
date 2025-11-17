'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/app/hooks/useAuth'
import { useState } from 'react'

export default function Header() {
  const { user, logout, userDisplayName } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      // Redirect will be handled by AuthContext
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="bg-black shadow">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center h-16">
            <Image 
              src="/ma-logo.png" 
              alt="Metal America Logo" 
              height={64} 
              width={160} 
              className="object-contain h-16 w-auto" 
              priority 
            />
          </Link>

          {/* Right: User Info & Logout */}
          {user && (
            <div className="flex items-center space-x-4">
              {/* User Display Name */}
              <span className="text-white text-sm hidden sm:block">
                Welcome, {userDisplayName || 'User'}
              </span>
              
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="border border-gray-400 bg-white text-black hover:bg-gray-100 hover:border-gray-300 px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Signing out...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}


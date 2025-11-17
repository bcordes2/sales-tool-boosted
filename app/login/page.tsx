'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/app/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, signInWithGoogle } = useAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    setError(null)

    try {
      await signInWithGoogle()
      // Redirect will happen via useEffect when user state updates
    } catch (error) {
      console.error('Login error:', error)
      if (error instanceof Error) {
        if (error.message.includes('restricted') || error.message.includes('Metal America')) {
          setError('Access restricted to Metal America employees')
        } else if (error.message.includes('popup-closed-by-user') || error.message.includes('popup-closed')) {
          setError('Sign-in was cancelled. Please try again.')
        } else if (error.message.includes('network-request-failed')) {
          setError('Network error. Please check your connection and try again.')
        } else if (error.message.includes('too-many-requests')) {
          setError('Too many sign-in attempts. Please wait a moment and try again.')
        } else if (error.message.includes('user-disabled')) {
          setError('This account has been disabled. Please contact your administrator.')
        } else {
          setError('Authentication failed, please try again')
        }
      } else {
        setError('Authentication failed, please try again')
      }
    } finally {
      setIsSigningIn(false)
    }
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render login form if user is already authenticated (redirect in progress)
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-red mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <Image 
              src="/ma-logo.png" 
              alt="Metal America Logo" 
              width={200} 
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sales Tool
          </h2>
          <p className="text-gray-600">
            Sign in with your Metal America account to access partner coverage and pricing
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Google Sign-In Button */}
            <div>
              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-md py-3 px-4 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {!isSigningIn && (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {isSigningIn && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                )}
                <span>
                  {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
                </span>
              </button>
            </div>

            {/* Info Text */}
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Only Metal America employees can access this application
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Metal America Sales Team Tool - Confidential</p>
        </div>
      </div>
    </div>
  )
}

'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, isValidDomain, parseDisplayName } from '@/app/lib/firebase/config'

interface AuthContextType {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  userDisplayName: string
  userEmail: string
  firstName: string
  lastName: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Validate domain and email verification before setting user
        if (user.email && user.emailVerified && isValidDomain(user.email)) {
          setUser(user)
        } else {
          // Invalid domain or unverified email - sign out immediately
          signOut(auth).catch((error) => {
            console.error('Error signing out invalid user:', error)
          })
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, googleProvider)
      
      // Validate domain and email verification after sign-in
      if (!result.user.email || !result.user.emailVerified || !isValidDomain(result.user.email)) {
        await signOut(auth)
        if (!result.user.emailVerified) {
          throw new Error('Please use a verified Google account')
        } else {
          throw new Error('Access restricted to Metal America employees')
        }
      }
      
      // User will be set by onAuthStateChanged
    } catch (error) {
      console.error('Sign-in error:', error)
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      // User will be cleared by onAuthStateChanged
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  // Derived values for easy access
  const userDisplayName = user?.displayName || ''
  const userEmail = user?.email || ''
  const { firstName, lastName } = parseDisplayName(user?.displayName || null)

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    logout,
    userDisplayName,
    userEmail,
    firstName,
    lastName,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase (avoid re-initialization)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Domain validation constant
export const ALLOWED_DOMAIN = process.env.NEXT_PUBLIC_ALLOWED_DOMAIN || 'metalbuildingsnorthamerica.com'

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider()

// Configure Google provider settings
googleProvider.setCustomParameters({
  prompt: 'select_account', // Always show account selection
  hd: ALLOWED_DOMAIN, // Restrict to specific domain
})

// Helper function to validate user email domain
export function isValidDomain(email: string): boolean {
  if (!email) return false
  const domain = email.split('@')[1]
  return domain === ALLOWED_DOMAIN
}

// Helper function to parse display name into first and last name
export function parseDisplayName(displayName: string | null): { firstName: string; lastName: string } {
  if (!displayName) {
    return { firstName: '', lastName: '' }
  }
  
  const parts = displayName.trim().split(' ')
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || ''
  
  return { firstName, lastName }
}

export default app

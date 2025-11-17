'use client'

import { useState, useRef, useEffect } from 'react'
import { Input } from '@/app/components/ui/Input'
import { Select } from '@/app/components/ui/Select'
import { Button } from '@/app/components/ui/Button'
import { WIDTH_OPTIONS, MANUFACTURERS } from '@/app/lib/utils/constants'

interface FormProps {
  onResults: (data: any[]) => void
  onLoading: (loading: boolean) => void
}

export default function Form({ onResults, onLoading }: FormProps) {
  const [zipcode, setZipcode] = useState('')
  const [width, setWidth] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showManufacturerDropdown, setShowManufacturerDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowManufacturerDropdown(false)
      }
    }

    if (showManufacturerDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showManufacturerDropdown])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!zipcode) {
      setError('Please enter a Zip Code')
      return
    }

    if (!width) {
      setError('Please select a Width')
      return
    }

    onLoading(true)

    try {
      const response = await fetch('/api/get-partners', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          zipcode,
          trusstype: width,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      onResults(result.data || [])
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      onResults([])
    } finally {
      onLoading(false)
    }
  }

  const handleManufacturerSearch = async (manufacturer: string) => {
    setShowManufacturerDropdown(false)
    setError(null)
    onLoading(true)

    try {
      const response = await fetch('/api/get-manufacturers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          manufacturer,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      onResults(result.data || [])
    } catch (err) {
      console.error('Manufacturer search error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
      onResults([])
    } finally {
      onLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Title with Manufacturer Dropdown */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sales Tool</h1>
          
          {/* Manufacturer Dropdown styled like Reference Guide */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowManufacturerDropdown(!showManufacturerDropdown)}
              className="flex items-center space-x-2 text-gray-900 hover:text-gray-700 transition-colors text-sm font-medium border-2 px-3 py-1 rounded"
              style={{ borderColor: '#ff2400' }}
            >
              <span>Select a Manu</span>
              <svg 
                className={`w-4 h-4 transition-transform ${showManufacturerDropdown ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showManufacturerDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200 max-h-96 overflow-y-auto">
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Select a manufacturer
                  </div>
                  {MANUFACTURERS.map((manufacturer) => (
                    <button
                      key={manufacturer}
                      onClick={() => handleManufacturerSearch(manufacturer)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {manufacturer}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Zip Code Input */}
          <Input
            label="Zip Code"
            type="text"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
            placeholder="12345"
            required
          />

          {/* Width Select */}
          <Select
            label="Width"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            options={WIDTH_OPTIONS}
            placeholder="Select Width"
            required
          />

          {/* Submit Button */}
          <Button type="submit" variant="darkRed" className="w-full">
            Submit
          </Button>
        </form>

        {/* External Links */}
        <div className="mt-4 space-y-2 text-center">
          <div>
            <a
              href="https://metalbuildingsnorthamerica.com/sales-tax-calculator/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff2400] hover:text-[#cc1d00] font-semibold"
            >
              Sales Tax Calculator
            </a>
          </div>
          <div>
            <a
              href="https://supportmia.metalbuildingsnorthamerica.com/login"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff2400] hover:text-[#cc1d00] font-semibold"
            >
              Customer Service Tickets
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

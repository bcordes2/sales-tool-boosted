'use client'

import { useState } from 'react'
import Form from '@/app/components/form/Form'
import Results from '@/app/components/results/Results'

export default function HomePage() {
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Form Component */}
        <Form 
          onResults={setResults}
          onLoading={setIsLoading}
        />

        {/* Results Component */}
        <Results 
          results={results}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}


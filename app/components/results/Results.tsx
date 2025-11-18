'use client'

import { Button } from '@/app/components/ui/Button'

interface ResultsProps {
  results: any[]
  isLoading: boolean
}

export default function Results({ results, isLoading }: ResultsProps) {
  // Sort results by rating (highest first)
  const sortedResults = [...results].sort((a, b) => {
    const ratingA = a.p_rating || a.rating || 0
    const ratingB = b.p_rating || b.rating || 0
    return ratingB - ratingA
  })

  // Generate star rating display
  const getStarRating = (rating: number | null) => {
    if (!rating && rating !== 0) return 'Not specified'
    const fullStars = '★'.repeat(Math.floor(rating))
    const hasHalfStar = rating % 1 === 0.5
    const emptyStars = '☆'.repeat(5 - Math.ceil(rating))
    
    return (
      <span className="text-yellow-500 text-xl">
        {fullStars}
        {hasHalfStar && (
          <svg width="1em" height="1em" viewBox="0 0 24 24" className="inline align-middle mr-0.5">
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="rgb(234 179 8)" />
                <stop offset="50%" stopColor="white" />
              </linearGradient>
            </defs>
            <polygon 
              points="12,2 15,9 22,9 17,14 18,21 12,17.5 6,21 7,14 2,9 9,9" 
              fill="url(#half)" 
              stroke="rgb(234 179 8)" 
              strokeWidth="1"
            />
          </svg>
        )}
        {emptyStars}
      </span>
    )
  }

  // Format price
  const formatPrice = (price: number | null) => {
    if (!price) return 'Not specified'
    const numPrice = parseInt(price.toString())
    return isNaN(numPrice) ? 'Not specified' : `$${numPrice.toLocaleString()}`
  }

  if (isLoading) {
    return (
      <div className="mt-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff2400]"></div>
            <span className="ml-3 text-gray-600">Loading results...</span>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="mt-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <div className="text-center py-12 text-gray-600">
            No results found. Try a different search.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-6">Results</h2>
        
        {/* Card Grid - 3 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResults.map((result, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-300 rounded-lg p-4 flex flex-col"
            >
              {/* Manufacturer Name */}
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Manufacturer {index + 1}: {result.c_manufacturer || result.manufacturer}
              </h3>

              {/* Info Grid */}
              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-sm mb-4">
                {/* Rating */}
                <div className="font-semibold">Rating:</div>
                <div>{getStarRating(result.p_rating || result.rating)}</div>

                {/* Location */}
                {result.c_city && (
                  <>
                    <div className="font-semibold">Location:</div>
                    <div>{result.c_city}, {result.c_state}</div>
                  </>
                )}

                {/* Lead Time */}
                <div className="font-semibold">Lead Time:</div>
                <div>{result.c_leadtime || 'n/a'}</div>

                {/* Price */}
                {result.pt_product && result.pt_price && (
                  <>
                    <div className="font-semibold">Price:</div>
                    <div>
                      <span className="text-[#ff2400] font-bold">
                        {formatPrice(result.pt_price)}
                      </span>
                      {' '}({result.pt_product})
                    </div>
                  </>
                )}

                {/* Commission */}
                <div className="font-semibold">Commission:</div>
                <div>{result.p_margin || result.margin || 'Not specified'}</div>

                {/* Phone Number */}
                <div className="font-semibold">Phone Number:</div>
                <div>{result.p_phonenumber || result.phonenumber || 'Not specified'}</div>

                {/* Email */}
                <div className="font-semibold">Email:</div>
                <div>{result.p_primaryrto || result.primaryrto || 'Not specified'}</div>

                {/* Description */}
                {result.pt_description && (
                  <>
                    <div className="font-semibold">Description:</div>
                    <div>{result.pt_description}</div>
                  </>
                )}

                {/* Installation Surface */}
                {result.pt_surface && (
                  <>
                    <div className="font-semibold">Installation Surface:</div>
                    <div>{result.pt_surface}</div>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {(result.p_coverage || result.coveragemap) && (
                  <a 
                    href={result.p_coverage || result.coveragemap} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="darkRed" size="sm">
                      View Coverage Map
                    </Button>
                  </a>
                )}

                {(result.p_website || result.website) && (
                  <a 
                    href={result.p_website || result.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="lightRed" size="sm">
                      Visit Website
                    </Button>
                  </a>
                )}

                {(result.p_tool || result.designtool) && (
                  <a 
                    href={result.p_tool || result.designtool} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="black" size="sm">
                      Access Design Tool
                    </Button>
                  </a>
                )}

                {(result.p_primaryrtolink || result.primaryrtolink) && (
                  <a 
                    href={result.p_primaryrtolink || result.primaryrtolink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button 
                      variant="image" 
                      size="sm"
                      backgroundImage="/naz.png"
                      className="text-shadow-md"
                    >
                      REID Manu Info
                    </Button>
                  </a>
                )}

                {result.pt_design && (
                  <a 
                    href={result.pt_design} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Button variant="lightRed" size="sm">
                      View Design
                    </Button>
                  </a>
                )}
              </div>

              {/* Manufacturer Discounts */}
              {(result.p_login || result.logininfo) && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                  <strong>Manufacturer Discounts:</strong> {result.p_login || result.logininfo}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

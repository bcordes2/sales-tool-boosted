import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/clients'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { zipcode, trusstype } = body

    // Validate required parameters
    if (!zipcode || !trusstype) {
      return NextResponse.json(
        { error: 'Missing required parameters: zipcode and trusstype' },
        { status: 400 }
      )
    }

    // Validate zipcode is a number
    const zipcodeNum = parseInt(zipcode)
    if (isNaN(zipcodeNum)) {
      return NextResponse.json(
        { error: 'Zipcode must be a valid number' },
        { status: 400 }
      )
    }

    // Create server client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Call the trussfilter RPC function
    const { data, error } = await supabase.rpc('trussfilter', {
      zipcode_input: zipcodeNum,
      trusstype_input: trusstype
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch partner data', details: error.message },
        { status: 500 }
      )
    }

    // Return the results
    return NextResponse.json({ data }, { status: 200 })

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}


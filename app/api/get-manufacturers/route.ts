import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase/clients'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { manufacturer } = body

    // Validate required parameter
    if (!manufacturer) {
      return NextResponse.json(
        { error: 'Missing required parameter: manufacturer' },
        { status: 400 }
      )
    }

    // Create server client with service role key (bypasses RLS)
    const supabase = createServerClient()

    // Call the manufacturerfilter RPC function
    const { data, error } = await supabase.rpc('manufacturerfilter', {
      manufacturer_input: manufacturer
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch manufacturer data', details: error.message },
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


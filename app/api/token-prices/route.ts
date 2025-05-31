
// app/api/token-prices/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { addresses } = await request.json();
    
    console.log('Received addresses:', addresses);
    
    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json({ error: 'Addresses array required' }, { status: 400 });
    }

    const API_KEY = process.env.ONEINCH_API_KEY;
    console.log('API Key exists:', !!API_KEY);
    
    if (!API_KEY) {
      return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
    }

    const url = `https://api.1inch.dev/price/v1.1/1/${addresses.join(",")}?currency=USD`;
    console.log('Fetching from URL:', url);
    
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Accept": "application/json"
      }
    });

    console.log('1inch API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('1inch API error:', errorText);
      return NextResponse.json({ 
        error: `1inch API Error: ${response.status}`,
        details: errorText 
      }, { status: 500 });
    }
    
    const data = await response.json();
    console.log('Successfully fetched prices:', Object.keys(data).length, 'tokens');
    return NextResponse.json(data);
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json({ 
      error: 'Failed to fetch prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
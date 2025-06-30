import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return NextResponse.json({ error: 'Missing keyword' }, { status: 400 });
  }

  const apiKey = process.env.NEXT_PUBLIC_RAJAONGKIR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing RajaOngkir API key' }, { status: 500 });
  }

  const url = `https://api-sandbox.collaborator.komerce.id/tariff/api/v1/destination/search?keyword=${encodeURIComponent(keyword)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': apiKey,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from RajaOngkir', detail: (error as Error).message }, { status: 500 });
  }
} 
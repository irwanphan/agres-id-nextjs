import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { origin, destination, weight, courier } = await req.json();

  const response = await fetch('https://api.rajaongkir.com/starter/cost', {
    method: 'POST',
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      origin,
      destination,
      weight,
      courier,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data);
}

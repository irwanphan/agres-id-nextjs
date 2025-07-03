import { NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://api.rajaongkir.com/starter/province', {
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
    },
  });
  const data = await response.json();
  return NextResponse.json(data.rajaongkir.results);
}

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('provinceId');

  if (!provinceId) {
    return NextResponse.json({ error: 'Province ID is required' }, { status: 400 });
  }

  const response = await fetch(`https://api.rajaongkir.com/starter/city?province=${provinceId}`, {
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
    },
  });
  const data = await response.json();
  return NextResponse.json(data.rajaongkir.results);
}

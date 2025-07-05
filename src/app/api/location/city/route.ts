import { NextResponse } from 'next/server';
import { cities } from './cities.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('provinceId');
  
  if (!provinceId) {
    return NextResponse.json({ error: 'Province ID is required' }, { status: 400 });
  }
  const data = cities.filter((city) => city.province_id === provinceId);

  return NextResponse.json(data);
}

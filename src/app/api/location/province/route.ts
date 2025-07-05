import { NextResponse } from 'next/server';
import { provinces } from './provinces.json';

export async function GET() {
  return NextResponse.json(provinces);
}

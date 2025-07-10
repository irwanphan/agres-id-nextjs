import { NextResponse } from 'next/server';
import { provinces } from './provinces.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const provinceId = searchParams.get('provinceId');
  const provinceName = searchParams.get('provinceName');
  if (provinceId) {
    const province = provinces.find((p) => p.province_id === provinceId);
    return NextResponse.json(province);
  } 
  if (provinceName) {
    const province = provinces.find((p) => p.province === provinceName);
    return NextResponse.json(province?.province_id);
  }
  return NextResponse.json(provinces);
}

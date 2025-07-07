import { prisma } from '@/lib/prismaDB';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const points = await prisma.pickupPoint.findMany({ where: { isActive: true } });
    return NextResponse.json(points);
  } catch (error) {
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, address, city, province, phone } = await req.json();
    const point = await prisma.pickupPoint.create({ data: { name, address, city, province, phone } });
    return NextResponse.json(point);
  } catch (error) {
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}
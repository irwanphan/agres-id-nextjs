import { prisma } from '@/lib/prismaDB';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const points = await prisma.pickupPoint.findMany({ where: { isActive: true } });
    return NextResponse.json(points);
  } catch (error) {
    console.error("Error fetching pickup points:", error);
    return NextResponse.json(
      { error: 'Failed to fetch pickup points', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, address, city, province, phone } = await req.json();
    
    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' }, 
        { status: 400 }
      );
    }
    
    const point = await prisma.pickupPoint.create({ 
      data: { 
        name, 
        address: address || null, 
        city: city || null, 
        province: province || null, 
        phone: phone || null,
        isActive: true 
      } 
    });
    return NextResponse.json(point);
  } catch (error) {
    console.error("Error creating pickup point:", error);
    return NextResponse.json(
      { error: 'Failed to create pickup point', details: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}
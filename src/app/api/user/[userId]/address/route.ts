import { prisma } from '@/lib/prismaDB';
import type { AddressType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  const searchParams = req.nextUrl.searchParams;
  const addressType = searchParams.get('type');

  try {
    if (!addressType) {
      const data = await prisma.address.findMany({
        where: { userId },
      });

      return NextResponse.json(data);
    }
    const data = await prisma.address.findFirst({
      where: { userId, type: (addressType as AddressType) || undefined },
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const { addressBundle } = await req.json();
  const { address, city, province, zipCode, name, email, phone, type } = addressBundle;

  // add userId to addressBundle
  const submitData = {
    userId,
    ...addressBundle
  }
  // check if all fields are filled from addressBundle destructured
  if (!address || !city || !province || !zipCode || !name || !email || !phone || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const data = await prisma.address.create({
      data: {
        ...submitData,
      },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Prisma error:", error);
    return NextResponse.json('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    const { addressBundle, id } = await req.json();
    const { address, city, province, zipCode, name, email, phone, type } = addressBundle;

    // check if all fields are filled from addressBundle destructured
    if (!userId || !address || !id || !city || !province || !zipCode || !name || !email || !phone || !type) {
      return NextResponse.json('Missing Fields', { status: 400 });
    }
    // submitted data is addressBundle without userId
    const submitData = {
      ...addressBundle,
    }

    // userId amd id is used as condition to update address
    const updated = await prisma.address.update({
      where: { id, userId },
      data: {
        ...submitData,
      },
    });
    // console.log("Updated address:", updated);
  } catch (e) {
    console.error("Error di PATCH:", e);
  }

  return NextResponse.json('Address updated successfully', { status: 200 });
}

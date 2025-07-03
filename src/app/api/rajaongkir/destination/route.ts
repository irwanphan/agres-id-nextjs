import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${search}`, {
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
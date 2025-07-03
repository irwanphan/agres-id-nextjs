import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { 
    // origin, 
    destination, 
    weight, 
    courier,
  } = await req.json();

  // const origin = 155 // Rajaongkir ID for Jakarta Utara, API v1
  const origin = 17650 // Rajaongkir ID for Jakarta Utara, API v2
  
  console.log('origin: ', origin);
  console.log('destination: ', destination);
  console.log('weight: ', weight);
  console.log('courier: ', courier);

  const response = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
    method: 'POST',
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
      'Content-Type': 'application/json',
      accept: 'application/json'
    },
    body: JSON.stringify({
      origin,
      destination,
      weight,
      courier,
      price: 'lowest',
    }),
  });

  console.log('response: ', response);
  const data = await response.json();
  return NextResponse.json(data);
}
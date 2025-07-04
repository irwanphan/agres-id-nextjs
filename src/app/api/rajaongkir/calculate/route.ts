import { NextRequest, NextResponse } from 'next/server';

type RequestBodyParams = {
  destination: string;
  weight: string;
  courier: string;
}

export async function POST(req: NextRequest) {
  const { 
    // origin, 
    destination, 
    weight, 
    courier,
  }: RequestBodyParams = await req.json();

  // const origin = 155 // Rajaongkir ID for Jakarta Utara, API v1
  const origin = '17650' // Rajaongkir ID for Jakarta Utara, API v2
  
  console.log('origin: ', origin);
  console.log('destination: ', destination);
  console.log('weight: ', weight);
  console.log('courier: ', courier);

  const body = {
    origin,
    destination,
    weight,
    courier,
    price: 'lowest',
  }

  if (!process.env.RAJAONGKIR_API_KEY) {
    throw new Error('Raja Ongkir API Key is not exists. Please check the .env')
  }

  const response = await fetch('https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost', {
    method: 'POST',
    headers: {
      key: process.env.RAJAONGKIR_API_KEY,
      'Content-Type': 'application/x-www-form-urlencoded',
      accept: 'application/json'
    },
    body: new URLSearchParams(body),
  });

  console.log('response: ', response);
  const data = await response.json();
  console.log('data: ', data);
  return NextResponse.json(data);
}
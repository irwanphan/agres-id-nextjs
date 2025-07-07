import { ShippingDomesticDestinationResponse } from "@/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  const response = await fetch(`https://rajaongkir.komerce.id/api/v1/destination/domestic-destination?search=${search}`, {
    headers: {
      key: process.env.RAJAONGKIR_API_KEY!,
    },
  });

  const data: ShippingDomesticDestinationResponse = await response.json();
  return NextResponse.json(data);
}

const exampleResponse = {
    "meta": {
        "message": "Success Get Domestic Destinations",
        "code": 200,
        "status": "success"
    },
    "data": [
        {
            "id": 57853,
            "label": "BENUA MELAYU DARAT, PONTIANAK SELATAN, PONTIANAK, KALIMANTAN BARAT, 78122",
            "province_name": "KALIMANTAN BARAT",
            "city_name": "PONTIANAK",
            "district_name": "PONTIANAK SELATAN",
            "subdistrict_name": "BENUA MELAYU DARAT",
            "zip_code": "78122"
        },
        {
            "id": 58118,
            "label": "SEI/SUNGAI MELAYU, SUNGAI MELAYU RAYAK, KETAPANG, KALIMANTAN BARAT, 78874",
            "province_name": "KALIMANTAN BARAT",
            "city_name": "KETAPANG",
            "district_name": "SUNGAI MELAYU RAYAK",
            "subdistrict_name": "SEI/SUNGAI MELAYU",
            "zip_code": "78874"
        },
        {
            "id": 58119,
            "label": "SEI/SUNGAI MELAYU BARU, SUNGAI MELAYU RAYAK, KETAPANG, KALIMANTAN BARAT, 78874",
            "province_name": "KALIMANTAN BARAT",
            "city_name": "KETAPANG",
            "district_name": "SUNGAI MELAYU RAYAK",
            "subdistrict_name": "SEI/SUNGAI MELAYU BARU",
            "zip_code": "78874"
        },
        {
            "id": 58120,
            "label": "SEI/SUNGAI MELAYU JAYA, SUNGAI MELAYU RAYAK, KETAPANG, KALIMANTAN BARAT, 78874",
            "province_name": "KALIMANTAN BARAT",
            "city_name": "KETAPANG",
            "district_name": "SUNGAI MELAYU RAYAK",
            "subdistrict_name": "SEI/SUNGAI MELAYU JAYA",
            "zip_code": "78874"
        },
        {
            "id": 57854,
            "label": "BENUA MELAYU LAUT, PONTIANAK SELATAN, PONTIANAK, KALIMANTAN BARAT, 78123",
            "province_name": "KALIMANTAN BARAT",
            "city_name": "PONTIANAK",
            "district_name": "PONTIANAK SELATAN",
            "subdistrict_name": "BENUA MELAYU LAUT",
            "zip_code": "78123"
        }
    ]
}
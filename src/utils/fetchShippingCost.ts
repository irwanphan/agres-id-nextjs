export async function fetchShippingCost({
  origin,
  destination,
  weight,
  courier,
}: {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}) {
  const res = await fetch('/api/rajaongkir/cost', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, weight, courier }),
  });
  return res.json();
}

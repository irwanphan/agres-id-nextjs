"use client";
import { useState } from "react";
import { getPickupPoints } from "@/get-api-data/pickup-point";
import { revalidatePath } from "next/cache";

export default async function PickupPointsPage() {
  const [form, setForm] = useState({ name: "", address: "", city: "", province: "", phone: "" });

  const points = await getPickupPoints();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch("/api/pickup-point", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", address: "", city: "", province: "", phone: "" });
    // reload list
    revalidatePath("/admin/pickup-points", "page");
  };

  return (
    <div>
      <h2>Pickup Points</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input placeholder="Address" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
        <input placeholder="City" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
        <input placeholder="Province" value={form.province} onChange={e => setForm(f => ({ ...f, province: e.target.value }))} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <button type="submit">Add</button>
      </form>
      <ul>
        {points.map((p) => (
          <li key={p.id}>{p.name} - {p.address} ({p.city}, {p.province})</li>
        ))}
      </ul>
    </div>
  );
}

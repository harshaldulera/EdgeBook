"use client";
import { useState } from "react";

export default function TradesPage() {
  const [form, setForm] = useState({
    account_id: "", // will later become dropdown of user's accounts
    symbol: "",
    side: "long",
    entry_price: "",
    exit_price: "",
    size: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitTrade = async () => {
    const res = await fetch("/api/trades", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      alert("✅ Trade logged!");
      setForm({
        account_id: "",
        symbol: "",
        side: "long",
        entry_price: "",
        exit_price: "",
        size: "",
        notes: "",
      });
    } else {
      alert("❌ Error: " + data.error);
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Trades</h1>
      <p className="mb-6 text-gray-400">Log your trades for a specific account</p>

      <div className="space-y-3 max-w-md">
        <input
          name="account_id"
          placeholder="Account ID"
          value={form.account_id}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <input
          name="symbol"
          placeholder="Symbol (e.g. AAPL)"
          value={form.symbol}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <select
          name="side"
          value={form.side}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
        <input
          name="entry_price"
          placeholder="Entry Price"
          type="number"
          value={form.entry_price}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <input
          name="exit_price"
          placeholder="Exit Price"
          type="number"
          value={form.exit_price}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <input
          name="size"
          placeholder="Size"
          type="number"
          value={form.size}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="p-2 rounded bg-gray-800 w-full"
        />
        <button
          onClick={submitTrade}
          className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 w-full"
        >
          Log Trade
        </button>
      </div>
    </div>
  );
}

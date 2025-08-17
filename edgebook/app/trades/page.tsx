"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
// import { createClient } from "@/utils/supabase/client";

export default function TradesPage() {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [form, setForm] = useState({
        account_id: "",
        symbol: "",
        side: "long",
        entry_price: "",
        exit_price: "",
        size: "",
        notes: "",
    });

    useEffect(() => {
        const fetchAccounts = async () => {
            const res = await fetch("/api/accounts");
            const data = await res.json();
            if (data.accounts) {
                setAccounts(data.accounts);
                if (data.accounts.length > 0) {
                    setForm((prev) => ({ ...prev, account_id: data.accounts[0].id }));
                }
            }
        };
        fetchAccounts();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitTrade = async () => {
        const payload = {
            ...form,
            entry_price: form.entry_price ? Number(form.entry_price) : null,
            exit_price: form.exit_price ? Number(form.exit_price) : null,
            size: form.size ? Number(form.size) : null,
        };

        const res = await fetch("/api/trades", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (data.success) {
            alert("✅ Trade logged!");
        } else {
            alert("❌ Error: " + data.error);
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">Trades</h1>
            <p className="mb-6 text-gray-400">
                Log your trades for a specific account
            </p>

            <div className="space-y-3 max-w-md">
                <div className="flex justify-between items-center">
                    <label className="text-gray-300">Select Account</label>
                    <Link
                        href="/accounts"
                        className="text-sm bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
                    >
                        ➕ Add Account
                    </Link>
                </div>

                <select
                    name="account_id"
                    value={form.account_id}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 w-full"
                >
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>
                            {acc.name} ({acc.broker})
                        </option>
                    ))}
                </select>

                <input
                    name="symbol"
                    placeholder="Symbol"
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

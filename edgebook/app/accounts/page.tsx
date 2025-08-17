"use client";
import { useState, useEffect } from "react";

interface Account {
    id: string;
    user_id: string;
    name: string;
    broker?: string;
    created_at: string;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [form, setForm] = useState({ name: "", broker: "" });

    const fetchAccounts = async () => {
        const res = await fetch("/api/accounts");
        const data = await res.json();
        if (data.accounts) setAccounts(data.accounts);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submitAccount = async () => {
        const res = await fetch("/api/accounts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if (data.success) {
            alert("✅ Account created!");
            setForm({ name: "", broker: "" });
            fetchAccounts();
        } else {
            alert("❌ Error: " + data.error);
        }
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-3xl font-bold mb-4">Accounts</h1>
            <p className="mb-6 text-gray-400">Manage your trading accounts</p>

            <div className="space-y-3 max-w-md mb-8">
                <input
                    name="name"
                    placeholder="Account Name"
                    value={form.name}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 w-full"
                />
                <input
                    name="broker"
                    placeholder="Broker"
                    value={form.broker}
                    onChange={handleChange}
                    className="p-2 rounded bg-gray-800 w-full"
                />
                <button
                    onClick={submitAccount}
                    className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 w-full"
                >
                    Add Account
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-2">Your Accounts</h2>
            <ul className="space-y-2">
                {accounts.map((acc) => (
                    <li
                        key={acc.id}
                        className="bg-gray-800 p-3 rounded flex justify-between"
                    >
                        <span>{acc.name} ({acc.broker})</span>
                        <span className="text-gray-400 text-sm">{new Date(acc.created_at).toLocaleDateString()}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

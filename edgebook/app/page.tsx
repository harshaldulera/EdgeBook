"use client";
import { useEffect, useState } from "react";
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react";
import StatCard from "@/components/StatCard";
import { PieChart, Pie, Cell } from "recharts";
import Link from "next/link";

interface User {
  id: string;
  email: string;
}

interface Trade {
  id: string;
  account_id: string;
  user_id: string;
  symbol: string;
  side: "long" | "short";
  entry_price: number | null;
  exit_price: number | null;
  size: number | null;
  pnl: number | null;
  notes?: string | null;
  trade_date: string;
}


export default function Home() {
  const supabase = useSupabaseClient();
  const user = useUser();

  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTrades = async () => {
      setLoading(true);

      // Get trades for the logged-in user (and later account_id filter)
      const { data, error } = await supabase
        .from("trades")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching trades:", error.message);
      } else {
        setTrades(data || []);
      }
      setLoading(false);
    };

    fetchTrades();
  }, [user, supabase]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">You must log in first.</p>
        <Link href="/login" className="text-blue-500 hover:text-blue-400">
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <p>Loading your trades...</p>
      </div>
    );
  }

  // --- Metrics Calculation ---
  const totalPnL = trades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const wins = trades.filter((t) => (t.pnl ?? 0) > 0);
  const losses = trades.filter((t) => (t.pnl ?? 0) <= 0);

  const netPnl = totalPnL;
  const tradeExpectancy =
    trades.length > 0 ? totalPnL / trades.length : 0;
  const profitFactor =
    losses.length > 0
      ? wins.reduce((s, t) => s + (t.pnl ?? 0), 0) /
      Math.abs(losses.reduce((s, t) => s + (t.pnl ?? 0), 0))
      : wins.length > 0
        ? 999 // all wins, huge PF
        : 0;
  const winRate =
    trades.length > 0 ? (wins.length / trades.length) * 100 : 0;
  const avgWin =
    wins.length > 0
      ? wins.reduce((s, t) => s + (t.pnl ?? 0), 0) / wins.length
      : 0;

  const avgLoss =
    losses.length > 0
      ? losses.reduce((s, t) => s + (t.pnl ?? 0), 0) / losses.length
      : 0;


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Net P&L" value={`$${netPnl.toFixed(2)}`} />
        <StatCard
          title="Trade Expectancy"
          value={`$${tradeExpectancy.toFixed(2)}`}
        />
        <StatCard
          title="Profit Factor"
          value={profitFactor.toFixed(2)}
          chart={
            <PieChart width={100} height={60}>
              <Pie
                data={[
                  { name: "Value", value: profitFactor },
                  { name: "Rest", value: Math.max(0, 3 - profitFactor) },
                ]}
                startAngle={180}
                endAngle={0}
                innerRadius={25}
                outerRadius={35}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#4ade80" />
                <Cell fill="#374151" />
              </Pie>
            </PieChart>
          }
        />
        <StatCard
          title="Win %"
          value={`${winRate.toFixed(2)}%`}
          chart={
            <PieChart width={80} height={80}>
              <Pie
                data={[
                  { name: "Wins", value: wins.length },
                  { name: "Losses", value: losses.length },
                ]}
                innerRadius={25}
                outerRadius={35}
                dataKey="value"
              >
                <Cell fill="#4ade80" />
                <Cell fill="#ef4444" />
              </Pie>
            </PieChart>
          }
        />
        <StatCard
          title="Avg win/loss trade"
          value={`$${avgWin.toFixed(2)} / $${avgLoss.toFixed(2)}`}
          chart={
            <div className="flex justify-between text-sm">
              <span className="text-green-400">${avgWin.toFixed(2)}</span>
              <span className="text-red-400">${avgLoss.toFixed(2)}</span>
            </div>
          }
        />
      </div>

      {/* --- Trade History --- */}
      <div className="bg-gray-800 rounded-lg shadow p-4">
        <h3 className="text-xl font-semibold mb-3">Recent Trades</h3>
        {trades.length === 0 ? (
          <p className="text-gray-400">No trades logged yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="py-2">Symbol</th>
                <th className="py-2">Side</th>
                <th className="py-2">Profit</th>
              </tr>
            </thead>
            <tbody>
              {trades
                .slice(-5) // last 5 trades
                .reverse() // newest first
                .map((t) => (
                  <tr key={t.id} className="border-b border-gray-700 last:border-0">
                    <td className="py-2">{t.symbol}</td>
                    <td
                      className={`py-2 font-medium ${t.side === "long" ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      {t.side}
                    </td>
                    <td
                      className={`py-2 font-semibold ${t.pnl >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                    >
                      ${t.pnl?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

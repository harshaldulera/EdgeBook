"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import StatCard from "@/components/StatCard";
import { PieChart, Pie, Cell } from "recharts";
import Link from "next/link";


export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg">You must log in first.</p>
        <Link href="/login" className="text-blue-500 hover:text-blue-400">Go to login</Link>
      </div>
    )
  }

  const netPnl = 248.78;
  const tradeExpectancy = 248.78;
  const profitFactor = 1.24;
  const wins = 51;
  const losses = 23;
  const winRate = (wins / (wins + losses)) * 100;
  const avgWin = 34.82;
  const avgLoss = 51.32;


  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard title="Net P&L" value={`$${netPnl.toFixed(2)}`} />
        <StatCard title="Trade Expectancy" value={`$${tradeExpectancy.toFixed(2)}`} />
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
                  { name: "Wins", value: wins },
                  { name: "Losses", value: losses },
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
              <span className="text-red-400">${avgLoss}</span>
            </div>
          }
        />
      </div>
    </div>
  );
}

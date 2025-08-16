import Image from "next/image";

export default function Home() {
  return (
    <main className="p-10 space-y-8 min-h-screen bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold">📓 EdgeBook</h1>
      <p className="text-lg text-gray-400">
        Your personal trading journal & performance dashboard.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 bg-gray-800 rounded-xl shadow">Net P&L: $3,240</div>
        <div className="p-4 bg-gray-800 rounded-xl shadow">Win %: 62%</div>
        <div className="p-4 bg-gray-800 rounded-xl shadow">Profit Factor: 1.8</div>
        <div className="p-4 bg-gray-800 rounded-xl shadow">Day Win %: 58%</div>
        <div className="p-4 bg-gray-800 rounded-xl shadow">
          Avg Win/Loss: $120 / -$80
        </div>
      </div>
    </main>
  );
}
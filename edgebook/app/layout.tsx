import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "EdgeBook",
  description: "Trading Journal & Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-gray-900 text-gray-100">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 space-y-6">
          <h1 className="text-2xl font-bold">📓 EdgeBook</h1>
          <nav className="space-y-4">
            <Link href="/" className="block hover:text-blue-400">Dashboard</Link>
            <Link href="/trades" className="block hover:text-blue-400">Log Trades</Link>
            <Link href="/notes" className="block hover:text-blue-400">Notes</Link>
            <Link href="/settings" className="block hover:text-blue-400">Settings</Link>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-10">{children}</main>
      </body>
    </html>
  );
}

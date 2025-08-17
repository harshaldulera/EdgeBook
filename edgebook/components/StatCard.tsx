"use client";
import { ReactNode } from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon?: ReactNode;
    chart?: ReactNode;
}

export default function StatCard({ title, value, icon, chart }: StatCardProps) {
    return (
      <div className="p-4 bg-gray-800 rounded-2xl shadow flex flex-col gap-2">
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>{title}</span>
          {icon && <span className="text-gray-500">{icon}</span>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {chart && <div className="h-16">{chart}</div>}
      </div>
    );
  }
  
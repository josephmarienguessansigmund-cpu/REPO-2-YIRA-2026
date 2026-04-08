"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function EspaceConseiller() {
  const router = useRouter();
  const [tab, setTab] = useState("dashboard");
  const stats = [
    { label: "Beneficiaires", val: "28" },
    { label: "En formation", val: "12" },
    { label: "CQP obtenus", val: "7" },
    { label: "Insertions", val: "5" },
  ];
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/")} className="text-gray-400 text-sm">Accueil</button>
          <div className="font-semibold">Espace Conseiller</div>
        </div>
        <div className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700">Conseiller Junior</div>
      </header>
      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border">
            <div className="text-sm text-gray-500">{s.label}</div>
            <div className="text-3xl font-bold">{s.val}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
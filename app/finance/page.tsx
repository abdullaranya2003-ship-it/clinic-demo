"use client";

import { useState } from "react";
import { Search, Plus, X } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

function fmt(n: number) {
  return n.toLocaleString("en-US") + " د.ع";
}

function periodTotals(invoices: { amount: number; status: string; issuedAt: string }[], from: Date, to: Date) {
  const inRange = invoices.filter((i) => { const d = new Date(i.issuedAt); return d >= from && d < to; });
  const collected = inRange.filter((i) => i.status === "COLLECTED").reduce((s, i) => s + i.amount, 0);
  const notCollected = inRange.filter((i) => i.status === "NOT_COLLECTED").reduce((s, i) => s + i.amount, 0);
  return { collected, notCollected, total: collected + notCollected };
}

function PeriodTable({ title, data }: { title: string; data: { collected: number; notCollected: number; total: number } }) {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="border-b border-line px-5 py-3"><h3 className="font-kufi text-sm font-semibold text-ink">{title}</h3></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
        <tbody>
          <tr className="border-b border-line/60"><td className="px-5 py-3 text-ink/50">کۆکراوەتەوە</td><td className="px-5 py-3 text-left font-mono font-medium text-success" dir="ltr">{fmt(data.collected)}</td></tr>
          <tr className="border-b border-line/60"><td className="px-5 py-3 text-ink/50">کۆنەکراوەتەوە</td><td className="px-5 py-3 text-left font-mono font-medium text-accent" dir="ltr">{fmt(data.notCollected)}</td></tr>
          <tr><td className="px-5 py-3 font-medium text-ink">کۆی گشتی</td><td className="px-5 py-3 text-left font-mono font-bold text-ink" dir="ltr">{fmt(data.total)}</td></tr>
        </tbody>
      </table>
      </div>
    </Card>
  );
}

export default function FinancePage() {
  const { state, addInvoice } = useStore();
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"COLLECTED" | "NOT_COLLECTED">("NOT_COLLECTED");
  const [description, setDescription] = useState("");

  const now = new Date();
  const startOfDay = new Date(now); startOfDay.setHours(0, 0, 0, 0);
  const tomorrow = new Date(startOfDay); tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const nextYear = new Date(now.getFullYear() + 1, 0, 1);

  const daily = periodTotals(state.invoices, startOfDay, tomorrow);
  const monthly = periodTotals(state.invoices, startOfMonth, nextMonth);
  const annual = periodTotals(state.invoices, startOfYear, nextYear);

  const trend = Array.from({ length: 14 }).map((_, i) => {
    const day = new Date(now); day.setDate(day.getDate() - (13 - i));
    const from = new Date(day); from.setHours(0, 0, 0, 0);
    const to = new Date(from); to.setDate(to.getDate() + 1);
    const total = state.invoices.filter((inv) => { const d = new Date(inv.issuedAt); return d >= from && d < to; }).reduce((s, inv) => s + inv.amount, 0);
    return { date: from.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" }), total };
  });

  const invoicesWithNames = state.invoices.map((inv) => ({ ...inv, patientName: state.patients.find((p) => p.id === inv.patientId)?.name ?? null }));
  const filtered = invoicesWithNames.filter((inv) => !search || (inv.patientName ?? "").toLowerCase().includes(search.toLowerCase()));

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    addInvoice({ amount: Number(amount), status, description: description || undefined });
    setAmount(""); setDescription(""); setStatus("NOT_COLLECTED"); setShowAdd(false);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="دەرامەت و شیکاری">
    <div>
      <PageHeader title="داتای داهات و قازانج" back />

      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <PeriodTable title="ڕۆژانە" data={daily} />
          <PeriodTable title="مانگانە" data={monthly} />
          <PeriodTable title="ساڵانە" data={annual} />
        </div>

        <Card>
          <h3 className="mb-4 font-kufi text-sm font-semibold text-ink">ئاراستەی داهات (14 ڕۆژی ڕابردوو)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#146356" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#146356" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDE5E2" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#0F2A2E80" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#0F2A2E80" }} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #DDE5E2", fontSize: 12 }} formatter={(v: number) => [fmt(v), "داهات"]} />
                <Area type="monotone" dataKey="total" stroke="#146356" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <h2 className="font-kufi text-sm font-semibold text-ink">پسوڵەکان</h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2">
                <Search size={14} className="text-ink/30" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="گەڕان بەدوای ناوی نەخۆش..." className="bg-transparent text-sm outline-none" />
              </div>
              <button onClick={() => setShowAdd((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark">
                <Plus size={14} /> پسوڵەی نوێ
              </button>
            </div>
          </div>

          {showAdd && (
            <form onSubmit={handleAdd} className="grid gap-3 border-b border-line p-5 sm:grid-cols-4">
              <input required type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="بڕی پارە (د.ع)" className="rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
              <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary">
                <option value="NOT_COLLECTED">کۆنەکراوەتەوە</option>
                <option value="COLLECTED">کۆکراوەتەوە</option>
              </select>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وردەکاری (ئارەزوومەندانە)" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2" />
              <div className="flex gap-2 sm:col-span-4">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm text-ink/60"><X size={13} /> پاشگەزبوونەوە</button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">بەروار</th>
                <th className="px-5 py-2 font-normal">نەخۆش</th>
                <th className="px-5 py-2 font-normal">وردەکاری</th>
                <th className="px-5 py-2 font-normal">دۆخ</th>
                <th className="px-5 py-2 font-normal">بڕی پارە</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inv) => (
                <tr key={inv.id} className="border-t border-line/70">
                  <td className="px-5 py-3 font-mono text-xs text-ink/50">{new Date(inv.issuedAt).toLocaleDateString("en-GB")}</td>
                  <td className="px-5 py-3 text-ink">{inv.patientName ?? "—"}</td>
                  <td className="px-5 py-3 text-xs text-ink/60">{inv.description ?? "—"}</td>
                  <td className="px-5 py-3">
                    <span className={"rounded-full px-2.5 py-1 text-xs " + (inv.status === "COLLECTED" ? "bg-success/10 text-success" : "bg-accent/10 text-accent")}>
                      {inv.status === "COLLECTED" ? "کۆکراوەتەوە" : "کۆنەکراوەتەوە"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-left font-mono font-medium text-ink" dir="ltr">{fmt(inv.amount)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/40">هیچ پسوڵەیەک نەدۆزرایەوە</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
    </div>
    </RequireRole>
  );
}

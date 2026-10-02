"use client";

import Link from "next/link";
import { Phone, CalendarPlus, Activity, Wallet, CheckCircle2, CircleDollarSign } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PatientNumberBoard from "@/components/PatientNumberBoard";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";

function fmt(n: number) {
  return n.toLocaleString("en-US") + " د.ع";
}

export default function DashboardPage() {
  const { state, markVisitPaid } = useStore();
  const user = state.currentUser;
  const isDoctor = user?.role === "DOCTOR";
  const isSecretary = user?.role === "SECRETARY";

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const activeEntry = state.queue.find((q) => q.status === "IN_ROOM" && new Date(q.visitDate).toDateString() === today.toDateString());
  const activePatient = activeEntry ? state.patients.find((p) => p.id === activeEntry.patientId) : null;

  const recentPatients = [...state.patients].slice(0, 20);
  const fee = Number(state.settings.consultation_fee || "0");

  return (
    <div>
      <PageHeader title="کلینیکی ڕۆژهەڵات" />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <Card className="lg:col-span-3 flex items-center gap-4 overflow-hidden">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <Activity size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink/50">پاڵسی زیندووی کلینیک</p>
            <div className="mt-1 flex items-center gap-1 overflow-hidden">
              {Array.from({ length: 60 }).map((_, i) => (
                <span key={i} className="inline-block w-1 shrink-0 rounded-full bg-success/60" style={{ height: `${6 + Math.abs(Math.sin(i / 2.3)) * 22}px`, animation: `pulse-dot ${1.4 + (i % 5) * 0.15}s ease-in-out infinite`, animationDelay: `${i * 0.03}s` }} />
              ))}
            </div>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-3">
          <PatientNumberBoard number={activeEntry?.queueNumber ?? null} patientName={activePatient?.name} />

          {isDoctor && activeEntry && activePatient && (
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-ink">{activePatient.name}</span>
                {activeEntry.paid ? (
                  <span className="flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                    <CheckCircle2 size={12} /> دراوە
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                    <CircleDollarSign size={12} /> واسڵ نەکراوە
                  </span>
                )}
              </div>
              {!activeEntry.paid && (
                <button onClick={() => markVisitPaid(activeEntry.id)} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">
                  نیشانکردن وەک دراوە
                </button>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <a href={`tel:${state.settings.clinic_phone.replace(/\s/g, "")}`} className="flex items-center justify-between rounded-xl2 border border-line bg-surface p-4 shadow-card transition-colors hover:border-primary">
            <span className="font-kufi text-sm font-medium text-ink">ژ.م. کلینیک</span>
            <span className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 font-mono text-sm text-primary">
              <Phone size={15} /> {state.settings.clinic_phone}
            </span>
          </a>

          {isDoctor && (
            <Card className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={16} className="text-primary" />
                <span className="text-sm text-ink/70">نرخی چاوپێکەوتن</span>
              </div>
              <span className="font-mono text-sm font-semibold text-ink">{fmt(fee)}</span>
            </Card>
          )}

          {isSecretary && (
            <Link href="/appointments" className="flex items-center justify-between rounded-xl2 bg-accent p-4 text-white shadow-card transition-colors hover:bg-accent-dark">
              <span className="font-kufi text-sm font-medium">نۆڕە گرتن</span>
              <CalendarPlus size={18} />
            </Link>
          )}

          <Card className="text-xs leading-relaxed text-ink/60">
            <p className="font-kufi text-sm font-medium text-ink">ناونیشان</p>
            <p className="mt-1">{state.settings.clinic_address}</p>
          </Card>
        </div>

        <Card className="lg:col-span-3 overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-kufi text-sm font-semibold text-ink">لیستی نەخۆشان</h2>
            {isDoctor && (
              <Link href="/patients" className="text-xs font-medium text-primary hover:underline">
                بینینی هەموو
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">ژ.ناسنامە</th>
                <th className="px-5 py-2 font-normal">ناو</th>
                <th className="px-5 py-2 font-normal">مۆبایل</th>
              </tr>
            </thead>
            <tbody>
              {recentPatients.map((p, i) => (
                <tr key={p.id} className="border-t border-line/70">
                  <td className="px-5 py-3 font-mono text-ink/50">{String(i + 1).padStart(3, "0")}</td>
                  <td className="px-5 py-3 font-medium text-ink">{p.name}</td>
                  <td className="px-5 py-3 font-mono text-ink/60" dir="ltr">{p.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

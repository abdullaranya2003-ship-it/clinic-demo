"use client";

import { useState } from "react";
import { Send, AlertTriangle, ListChecks, CheckCircle2, CalendarDays } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import { todayISODate, maxBookingDateISO, monthYearLabel, monthKey } from "@/lib/date";
import RequireRole from "@/components/RequireRole";

interface Warning { aheadCount: number; estimatedWaitMinutes: number; message: string }

const STATUS_LABELS: Record<string, string> = {
  PENDING: "چاوەڕوان",
  IN_QUEUE: "لە ڕیزدا",
  COMPLETED: "تەواوبوو",
  CANCELLED: "هەڵوەشێنراوە",
};

export default function AppointmentsPage() {
  const { state, bookAppointment } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [visitDate, setVisitDate] = useState(todayISODate());
  const [visitTime, setVisitTime] = useState("");
  const [warning, setWarning] = useState<Warning | null>(null);
  const [addedToQueue, setAddedToQueue] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = bookAppointment({ name, phone, age: age ? Number(age) : undefined, visitDate, visitTime: visitTime || undefined, symptoms });
    setWarning(res.warning);
    setAddedToQueue(res.addedToQueue);
    setSuccess(true);
    setName(""); setPhone(""); setAge(""); setSymptoms(""); setVisitTime("");
    setVisitDate(todayISODate());
  }

  const sorted = [...state.appointments].sort((a, b) => a.visitDate.localeCompare(b.visitDate) || (a.visitTime ?? "").localeCompare(b.visitTime ?? ""));
  const today = todayISODate();

  // Group bookings by month so a 6-month booking window stays readable.
  const groups: { key: string; label: string; items: typeof sorted }[] = [];
  for (const b of sorted) {
    const key = monthKey(b.visitDate);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: monthYearLabel(b.visitDate), items: [] };
      groups.push(group);
    }
    group.items.push(b);
  }

  return (
    <RequireRole allow={["SECRETARY"]} title="نۆڕە گرتن">
    <div>
      <PageHeader title="نۆڕە گرتن" back />

      <div className="mx-auto max-w-2xl space-y-6 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="space-y-4">
            <h2 className="font-kufi text-sm font-semibold text-ink">زانیاری نەخۆش</h2>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ناوی نەخۆش</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="ناوی تەواو بنووسە" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink/60">ژمارە مۆبایل</label>
                <input required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" placeholder="07XX XXX XXXX" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink/60">تەمەن</label>
                <input type="number" min={0} max={130} value={age} onChange={(e) => setAge(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">جۆری نەخۆشی / نیشانەکان</label>
              <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="وردەکاری نەخۆشی بنووسە..." />
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 flex items-center gap-1.5 font-kufi text-sm font-semibold text-ink">
              <CalendarDays size={15} className="text-primary" /> بەروار و کاتی نۆرە
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <input
                required
                type="date"
                value={visitDate}
                min={todayISODate()}
                max={maxBookingDateISO()}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
              />
              <input
                type="time"
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-ink/35">دەتوانیت هەتا شەش مانگی داهاتوو نۆڕە بگریت</p>
          </Card>

          {addedToQueue && (
            <div className="flex items-start gap-3 rounded-xl2 border border-success/30 bg-success/10 p-4 text-success">
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
              <p className="text-sm">چونکە نۆڕەکە بۆ ئەمڕۆیە، ئەم نەخۆشە خۆیبەخۆ خرایە ناو <b>ڕیزی نەخۆشان</b>ەوە.</p>
            </div>
          )}
          {warning && (
            <div className="flex items-start gap-3 rounded-xl2 border border-accent/30 bg-accent-50 p-4 text-accent">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-kufi font-semibold">ئاگاداری کاتی</p>
                <p className="mt-1 text-accent-dark/90">{warning.message}</p>
              </div>
            </div>
          )}
          {success && !warning && !addedToQueue && (
            <div className="rounded-xl2 border border-success/30 bg-success/10 p-4 text-sm text-success">نۆڕەکە بە سەرکەوتوویی تۆمارکرا.</div>
          )}

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark">
            <Send size={16} /> ناردن
          </button>
        </form>

        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <ListChecks size={16} className="text-primary" />
            <h2 className="font-kufi text-sm font-semibold text-ink">نۆڕە تۆمارکراوەکان</h2>
          </div>

          {groups.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-ink/40">هێشتا هیچ نۆڕەیەک تۆمار نەکراوە</p>
          ) : (
            groups.map((group) => (
              <div key={group.key}>
                <div className="border-t border-line bg-paper px-5 py-2 font-kufi text-xs font-semibold text-ink/60">{group.label}</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                  <tbody>
                    {group.items.map((b) => {
                      const patient = state.patients.find((p) => p.id === b.patientId);
                      const isToday = b.visitDate.slice(0, 10) === today;
                      return (
                        <tr key={b.id} className="border-t border-line/70">
                          <td className="w-10 px-5 py-3 font-mono text-xs font-semibold text-primary">{String(b.queuePosition).padStart(2, "0")}</td>
                          <td className="px-5 py-3">
                            <p className="font-medium text-ink">{patient?.name}</p>
                            <p className="font-mono text-xs text-ink/40" dir="ltr">{patient?.phone}</p>
                          </td>
                          <td className="px-5 py-3">
                            <span className={"rounded-full px-2.5 py-1 text-xs font-mono " + (isToday ? "bg-primary-50 text-primary font-medium" : "bg-ink/5 text-ink/60")}>
                              {new Date(b.visitDate).toLocaleDateString("en-GB")}
                              {b.visitTime && ` — ${b.visitTime}`}
                              {isToday && " (ئەمڕۆ)"}
                            </span>
                            <p className="mt-1 text-[10px] text-ink/30">نووسراوە: {new Date(b.createdAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</p>
                          </td>
                          <td className="px-5 py-3 text-xs text-ink/60">{STATUS_LABELS[b.status] ?? b.status}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
    </RequireRole>
  );
}

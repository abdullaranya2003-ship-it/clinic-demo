"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, AlertTriangle, CheckCircle2, Stethoscope, Phone, ArrowLeft, CalendarDays } from "lucide-react";
import { useStore } from "@/lib/store";
import { todayISODate, maxBookingDateISO } from "@/lib/date";

interface Warning { aheadCount: number; estimatedWaitMinutes: number; message: string }

export default function BookingPage() {
  const { state, bookAppointment } = useStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [visitDate, setVisitDate] = useState(todayISODate());
  const [visitTime, setVisitTime] = useState("");
  const [warning, setWarning] = useState<Warning | null>(null);
  const [success, setSuccess] = useState(false);
  const [addedToQueue, setAddedToQueue] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = bookAppointment({ name, phone, age: age ? Number(age) : undefined, visitDate, visitTime: visitTime || undefined, symptoms });
    setWarning(res.warning);
    setAddedToQueue(res.addedToQueue);
    setSuccess(true);
    setName(""); setPhone(""); setAge(""); setSymptoms(""); setVisitTime("");
    setVisitDate(todayISODate());
  }

  return (
    <div className="min-h-screen bg-paper px-4 py-10">
      <div className="mx-auto max-w-xl">
        <Link href="/" className="mb-6 flex items-center gap-1.5 text-xs text-ink/40 hover:text-primary">
          <ArrowLeft size={13} /> گەڕانەوە بۆ سیستەمی بەڕێوەبردن
        </Link>

        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-card">
            <Stethoscope size={26} />
          </div>
          <h1 className="font-kufi text-xl font-bold text-ink">کلینیکی ڕۆژهەڵات</h1>
          <p className="mt-1 text-sm text-ink/50">نۆڕەی خۆت لێرەوە تۆمار بکە — پێویست بە هەژمار ناکات</p>
        </div>

        {success && addedToQueue && (
          <div className="mb-5 flex items-start gap-3 rounded-xl2 border border-success/30 bg-success/10 p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
            <p className="text-sm text-success">نۆڕەکەت تۆمارکرا! چونکە بۆ ئەمڕۆیە، ڕاستەوخۆ لە ڕیزی کلینیکدایت.</p>
          </div>
        )}
        {success && !addedToQueue && (
          <div className="mb-5 flex items-start gap-3 rounded-xl2 border border-success/30 bg-success/10 p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-success" />
            <p className="text-sm text-success">نۆڕەکەت بە سەرکەوتوویی تۆمارکرا. لە ڕۆژی هەڵبژێردراودا چاوەڕوانتین.</p>
          </div>
        )}
        {warning && (
          <div className="mb-5 flex items-start gap-3 rounded-xl2 border border-accent/30 bg-accent-50 p-4">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-accent" />
            <div className="text-sm">
              <p className="font-kufi font-semibold text-accent-dark">ئاگاداری کاتی چاوەڕوانی</p>
              <p className="mt-1 text-accent-dark/90">{warning.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 rounded-xl2 border border-line bg-surface p-6 shadow-card">
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
            <label className="mb-1.5 block text-xs font-medium text-ink/60">جۆری نەخۆشی / نیشانەکان (ئارەزوومەندانە)</label>
            <textarea value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={3} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="وردەکاری نەخۆشی بنووسە..." />
          </div>

          <div>
            <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-ink/60">
              <CalendarDays size={13} /> بەروار و کاتی نۆرە
            </label>
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
          </div>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white hover:bg-primary-dark">
            <Send size={16} /> ناردنی نۆڕە
          </button>
        </form>

        <a href={`tel:${state.settings.clinic_phone.replace(/\s/g, "")}`} className="mt-5 flex items-center justify-center gap-2 text-sm text-ink/50 hover:text-primary">
          <Phone size={14} /> یان پەیوەندیمان پێوە بکە: {state.settings.clinic_phone}
        </a>
      </div>
    </div>
  );
}

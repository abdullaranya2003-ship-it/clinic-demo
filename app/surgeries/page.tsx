"use client";

import { useState } from "react";
import { Scissors, Plus, X, Trash2, Users2, ImagePlus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";
import SignatureUpload from "@/components/SignatureUpload";

export default function SurgeriesPage() {
  const { state, addSurgery, deleteSurgery } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("");
  const [consentNote, setConsentNote] = useState("");
  const [consentSignature, setConsentSignature] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const scheduledAt = new Date(`${date}T${time || "00:00"}:00`).toISOString();
    addSurgery({ patientName, scheduledAt, type, consentNote: consentNote || undefined, consentSignature: consentSignature || undefined });
    setPatientName(""); setDate(""); setTime(""); setType(""); setConsentNote(""); setConsentSignature(null);
    setShowForm(false);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="نەشتەرگەری">
    <div>
      <PageHeader title="نەشتەرگەری" back />

      <div className="space-y-6 p-6">
        <div className="flex justify-end">
          <button onClick={() => setShowForm((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            <Plus size={15} /> زیادکردنی نەشتەرگەری
          </button>
        </div>

        {showForm && (
          <Card>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink/60">ناوی نەخۆش</label>
                <input required value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="ناوی تەواو بنووسە" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink/60">بەروار</label>
                  <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-ink/60">کات</label>
                  <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink/60">جۆری نەشتەرگەری</label>
                <input required value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="بۆ نموونە: نەشتەرگەری زگ" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink/60">ڕازیبوونی کەسوکار <span className="text-ink/30">(ئارەزوومەندانە)</span></label>
                <textarea value={consentNote} onChange={(e) => setConsentNote(e.target.value)} rows={2} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" placeholder="ناوی کەسوکار، پەیوەندی، و شێوازی ڕازیبوون..." />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-ink/60">
                  <ImagePlus size={13} /> وێنەی واژووی کەسوکار یان مۆری نەخۆش <span className="text-ink/30">(ئارەزوومەندانە)</span>
                </label>
                <SignatureUpload onChange={setConsentSignature} />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                <button type="button" onClick={() => setShowForm(false)} className="flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm text-ink/60"><X size={13} /> پاشگەزبوونەوە</button>
              </div>
            </form>
          </Card>
        )}

        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Scissors size={16} className="text-primary" />
            <h2 className="font-kufi text-sm font-semibold text-ink">نەشتەرگەری خشتەکراو</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">نەخۆش</th>
                <th className="px-5 py-2 font-normal">بەروار و کات</th>
                <th className="px-5 py-2 font-normal">جۆر</th>
                <th className="px-5 py-2 font-normal">ڕازیبوون</th>
                <th className="px-5 py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {state.surgeries.map((s) => (
                <tr key={s.id} className="border-t border-line/70">
                  <td className="px-5 py-3 font-medium text-ink">{s.patientName}</td>
                  <td className="px-5 py-3 font-mono text-xs text-ink/60">{new Date(s.scheduledAt).toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td className="px-5 py-3 text-ink/70">{s.type}</td>
                  <td className="px-5 py-3 text-xs text-ink/60">
                    <div className="flex items-center gap-2">
                      {s.consentNote && (
                        <span className="flex items-center gap-1 text-success">
                          <Users2 size={12} /> {s.consentNote}
                        </span>
                      )}
                      {s.consentSignature && (
                        <a href={s.consentSignature} target="_blank" rel="noreferrer" title="بینینی واژوو بە قەبارەی تەواو">
                          <img src={s.consentSignature} alt="واژوو" className="h-8 w-16 rounded border border-line bg-paper object-contain" />
                        </a>
                      )}
                      {!s.consentNote && !s.consentSignature && "—"}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button onClick={() => deleteSurgery(s.id)} className="rounded-lg border border-line p-1.5 text-ink/40 hover:border-danger hover:text-danger"><Trash2 size={13} /></button>
                  </td>
                </tr>
              ))}
              {state.surgeries.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/40">هیچ نەشتەرگەریەک خشتەنەکراوە</td></tr>
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

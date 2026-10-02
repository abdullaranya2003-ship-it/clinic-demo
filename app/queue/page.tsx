"use client";

import { useState } from "react";
import { UserPlus, PlayCircle, DoorOpen, X, Pencil } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import PatientNumberBoard from "@/components/PatientNumberBoard";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

export default function QueuePage() {
  const { state, callNext, addToQueue, enterRoom, updateQueueEntry, updateSetting } = useStore();
  const [banner, setBanner] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addAge, setAddAge] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editInsurance, setEditInsurance] = useState("");
  const [editXray, setEditXray] = useState("Pending");

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const todaysEntries = state.queue.filter((q) => new Date(q.visitDate).toDateString() === today.toDateString());
  const active = todaysEntries.find((e) => e.status === "IN_ROOM") ?? null;
  const waiting = todaysEntries.filter((e) => e.status === "WAITING").sort((a, b) => a.queueNumber - b.queueNumber);
  const activePatient = active ? state.patients.find((p) => p.id === active.patientId) : null;

  function handleCallNext() {
    const called = callNext();
    if (called) {
      const p = state.patients.find((pp) => pp.id === called.patientId);
      setBanner(`${p?.name} بانگکرا بۆ ژوورەوە.`);
    } else {
      setBanner("هیچ نەخۆشێک لە ڕیزدا نەماوە.");
    }
  }

  function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    addToQueue({ name: addName, phone: addPhone, age: addAge ? Number(addAge) : undefined });
    setAddName(""); setAddPhone(""); setAddAge("");
    setShowAddForm(false);
  }

  function openEdit(id: string, insuranceNo?: string, xrayStatus?: string) {
    setEditingId(id);
    setEditInsurance(insuranceNo ?? "");
    setEditXray(xrayStatus ?? "Pending");
  }

  function saveEdit(id: string) {
    updateQueueEntry(id, { insuranceNo: editInsurance || undefined, xrayStatus: editXray });
    setEditingId(null);
  }

  return (
    <RequireRole allow={["SECRETARY"]} title="ڕیزی نەخۆشان">
    <div>
      <PageHeader title="ڕیزی نەخۆشان" />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PatientNumberBoard number={active?.queueNumber ?? null} patientName={activePatient?.name} label="لە ژوورەوە" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleCallNext} className="flex flex-col items-center justify-center gap-2 rounded-xl2 bg-primary p-4 text-white shadow-card hover:bg-primary-dark">
            <DoorOpen size={20} />
            <span className="text-center text-xs font-kufi font-medium leading-tight">چوونە ژوورەوە نەخۆش</span>
          </button>
          <button onClick={() => setShowAddForm((s) => !s)} className="flex flex-col items-center justify-center gap-2 rounded-xl2 border border-line bg-surface p-4 text-ink shadow-card hover:border-primary">
            <UserPlus size={20} className="text-primary" />
            <span className="text-center text-xs font-kufi font-medium leading-tight">زیاد کردنی نەخۆش</span>
          </button>
          <button
            onClick={() => updateSetting("shift_active", !state.settings.shift_active)}
            className={"col-span-2 flex items-center justify-center gap-2 rounded-xl2 p-4 shadow-card border " + (state.settings.shift_active ? "border-success/40 bg-success/10 text-success" : "border-line bg-surface text-ink hover:border-primary")}
          >
            <PlayCircle size={20} />
            <span className="text-center text-xs font-kufi font-medium leading-tight">{state.settings.shift_active ? "لە کاردایە" : "خستە کار"}</span>
          </button>
        </div>

        {showAddForm && (
          <Card className="lg:col-span-3">
            <form onSubmit={handleAddPatient} className="grid gap-3 sm:grid-cols-4">
              <input required value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="ناوی نەخۆش" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2" />
              <input required dir="ltr" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} placeholder="ژمارە مۆبایل" className="rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
              <input type="number" value={addAge} onChange={(e) => setAddAge(e.target.value)} placeholder="تەمەن" className="rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
              <div className="flex gap-2 sm:col-span-4">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">زیادکردن بۆ ڕیز</button>
                <button type="button" onClick={() => setShowAddForm(false)} className="rounded-lg border border-line px-4 py-2 text-sm text-ink/60">پاشگەزبوونەوە</button>
              </div>
            </form>
          </Card>
        )}

        <Card className="lg:col-span-3 overflow-hidden p-0">
          <div className="border-b border-line px-5 py-4">
            <h2 className="font-kufi text-sm font-semibold text-ink">ڕیزی چاوەڕوانی</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">ژ.ڕیز</th>
                <th className="px-5 py-2 font-normal">ناو</th>
                <th className="px-5 py-2 font-normal">مۆبایل</th>
                <th className="px-5 py-2 font-normal">دڵنیایی</th>
                <th className="px-5 py-2 font-normal">تیشکی ئێکس</th>
                <th className="px-5 py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {waiting.map((r) => {
                const patient = state.patients.find((p) => p.id === r.patientId);
                return (
                  <tr key={r.id} className="border-t border-line/70">
                    <td className="px-5 py-3 font-mono font-semibold text-primary">{String(r.queueNumber).padStart(2, "0")}</td>
                    <td className="px-5 py-3 font-medium text-ink">{patient?.name}</td>
                    <td className="px-5 py-3 font-mono text-ink/60" dir="ltr">{patient?.phone}</td>
                    {editingId === r.id ? (
                      <>
                        <td className="px-5 py-2">
                          <input value={editInsurance} onChange={(e) => setEditInsurance(e.target.value)} className="w-28 rounded-md border border-line px-2 py-1 text-xs" placeholder="ژمارە" />
                        </td>
                        <td className="px-5 py-2">
                          <select value={editXray} onChange={(e) => setEditXray(e.target.value)} className="rounded-md border border-line px-2 py-1 text-xs">
                            <option value="Pending">چاوەڕوان</option>
                            <option value="Done">تەواو</option>
                            <option value="N/A">پێویست نییە</option>
                          </select>
                        </td>
                        <td className="px-5 py-2">
                          <div className="flex gap-1.5">
                            <button onClick={() => saveEdit(r.id)} className="rounded-lg bg-primary px-2.5 py-1.5 text-xs text-white">پاشەکەوت</button>
                            <button onClick={() => setEditingId(null)} className="rounded-lg border border-line p-1.5"><X size={13} /></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-5 py-3 text-xs text-ink/60 font-mono">{r.insuranceNo || "—"}</td>
                        <td className="px-5 py-3 text-xs text-ink/60">{r.xrayStatus === "Done" ? "تەواو" : r.xrayStatus === "N/A" ? "پێویست نییە" : "چاوەڕوان"}</td>
                        <td className="px-5 py-3">
                          <div className="flex gap-1.5">
                            <button onClick={() => enterRoom(r.id)} className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-primary hover:bg-primary-50">بچۆرە ژوورەوە</button>
                            <button onClick={() => openEdit(r.id, r.insuranceNo, r.xrayStatus)} className="rounded-lg border border-line p-1.5 text-ink/50 hover:border-primary"><Pencil size={13} /></button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
              {waiting.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-ink/40">هیچ نەخۆشێک لە ڕیزدا نییە</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </Card>

        {banner && <div className="lg:col-span-3 rounded-xl2 border border-primary/20 bg-primary-50 px-5 py-3 text-sm text-primary-dark">{banner}</div>}
      </div>
    </div>
    </RequireRole>
  );
}

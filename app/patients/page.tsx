"use client";

import { useState } from "react";
import { Search, UserPlus, Phone, Droplet, FileImage, Pill, Plus, X, Pencil, Trash2, Check, ClipboardPlus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

const RECORD_TYPE_LABELS: Record<string, string> = {
  BLOOD_TEST: "پشکنینی خوێن",
  XRAY: "تیشکی ئێکس",
  PRESCRIPTION: "دەرمانی نووسراو",
  OTHER: "پشکنینی تایبەت",
};

export default function PatientsPage() {
  const { state, addPatient, updatePatient, deletePatient, addMedicalRecord, addPatientNote } = useStore();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(state.patients[0]?.id ?? null);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAge, setNewAge] = useState("");

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordType, setRecordType] = useState<"BLOOD_TEST" | "XRAY" | "PRESCRIPTION" | "OTHER">("BLOOD_TEST");
  const [recordTitle, setRecordTitle] = useState("");
  const [recordResult, setRecordResult] = useState("");

  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editBloodGroup, setEditBloodGroup] = useState("");
  const [editIllness, setEditIllness] = useState("");
  const [editEmergencyContact, setEditEmergencyContact] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const filtered = state.patients.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search));
  const selected = state.patients.find((p) => p.id === selectedId) ?? null;
  const records = selected ? state.records.filter((r) => r.patientId === selected.id) : [];
  const notes = selected
    ? state.patientNotes.filter((n) => n.patientId === selected.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    : [];

  function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    const p = addPatient({ name: newName, phone: newPhone, age: newAge ? Number(newAge) : undefined });
    setNewName(""); setNewPhone(""); setNewAge("");
    setShowAddPatient(false);
    setSelectedId(p.id);
  }

  function startEdit() {
    if (!selected) return;
    setEditName(selected.name);
    setEditPhone(selected.phone);
    setEditAge(selected.age ? String(selected.age) : "");
    setEditBloodGroup(selected.bloodGroup ?? "");
    setEditIllness(selected.illness ?? "");
    setEditEmergencyContact(selected.emergencyContact ?? "");
    setIsEditing(true);
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    updatePatient(selectedId, {
      name: editName, phone: editPhone,
      age: editAge ? Number(editAge) : undefined,
      bloodGroup: editBloodGroup || undefined,
      illness: editIllness || undefined,
      emergencyContact: editEmergencyContact || undefined,
    });
    setIsEditing(false);
  }

  function handleDelete() {
    if (!selectedId) return;
    deletePatient(selectedId);
    setSelectedId(null);
    setConfirmingDelete(false);
  }

  function openAddRecord(type: "BLOOD_TEST" | "XRAY" | "PRESCRIPTION" | "OTHER") {
    setRecordType(type); setRecordTitle(""); setRecordResult("");
    setShowAddRecord(true);
  }

  function handleAddRecord(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    addMedicalRecord(selectedId, { type: recordType, title: recordTitle, result: recordResult || undefined });
    setShowAddRecord(false);
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !newNoteText.trim()) return;
    addPatientNote(selectedId, newNoteText.trim());
    setNewNoteText("");
    setShowAddNote(false);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="نەخۆشەکان">
    <div>
      <PageHeader title="نەخۆشەکان" back />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2.5">
              <Search size={16} className="text-ink/30" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="گەڕان..." className="w-full bg-transparent text-sm outline-none" />
            </div>
            <button onClick={() => setShowAddPatient((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-white hover:bg-primary-dark">
              <UserPlus size={15} />
            </button>
          </div>

          {showAddPatient && (
            <Card className="space-y-3">
              <form onSubmit={handleAddPatient} className="space-y-3">
                <input required value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="ناوی نەخۆش" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
                <input required dir="ltr" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="ژمارە مۆبایل" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary font-mono" />
                <input type="number" value={newAge} onChange={(e) => setNewAge(e.target.value)} placeholder="تەمەن (ئارەزوومەندانە)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary font-mono" />
                <div className="flex gap-2">
                  <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                  <button type="button" onClick={() => setShowAddPatient(false)} className="rounded-lg border border-line px-3 py-2 text-xs text-ink/60">پاشگەزبوونەوە</button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-2">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => { setSelectedId(p.id); setIsEditing(false); setConfirmingDelete(false); setShowAddNote(false); setShowAddRecord(false); }}
                className={"flex w-full items-center justify-between rounded-xl2 border p-3.5 text-right shadow-card transition-colors " + (selectedId === p.id ? "border-primary bg-primary-50" : "border-line bg-surface hover:border-primary/40")}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-kufi text-sm font-semibold text-primary">{p.name[0]}</div>
                  <div>
                    <p className="text-sm font-medium text-ink">{p.name}</p>
                    <p className="text-xs text-ink/40 font-mono" dir="ltr">{p.phone}</p>
                  </div>
                </div>
                <a href={`tel:${p.phone}`} onClick={(e) => e.stopPropagation()} className="rounded-full bg-success/10 p-2 text-success hover:bg-success/20">
                  <Phone size={14} />
                </a>
              </button>
            ))}
            {filtered.length === 0 && <p className="py-8 text-center text-sm text-ink/40">هیچ نەخۆشێک نەدۆزرایەوە</p>}
          </div>
        </div>

        <div className="space-y-4 lg:col-span-2">
          {!selected ? (
            <Card className="text-sm text-ink/40">نەخۆشێک هەڵبژێرە بۆ بینینی زانیاری</Card>
          ) : (
            <>
              <Card>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-kufi text-lg font-semibold text-ink">{selected.name}</h2>
                  <div className="flex items-center gap-2">
                    {selected.bloodGroup && !isEditing && <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-mono text-primary">{selected.bloodGroup}</span>}
                    {!isEditing && !confirmingDelete && (
                      <>
                        <button onClick={startEdit} className="rounded-lg border border-line p-2 text-ink/50 hover:border-primary hover:text-primary"><Pencil size={14} /></button>
                        <button onClick={() => setConfirmingDelete(true)} className="rounded-lg border border-line p-2 text-ink/50 hover:border-danger hover:text-danger"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </div>

                {confirmingDelete ? (
                  <div className="rounded-xl2 border border-danger/30 bg-danger/10 p-4">
                    <p className="text-sm text-danger">دڵنیایت لە سڕینەوەی <b>{selected.name}</b>؟</p>
                    <div className="mt-3 flex gap-2">
                      <button onClick={handleDelete} className="rounded-lg bg-danger px-4 py-2 text-xs font-medium text-white hover:bg-danger/90">بەڵێ، بسڕەوە</button>
                      <button onClick={() => setConfirmingDelete(false)} className="rounded-lg border border-line px-4 py-2 text-xs text-ink/60">پاشگەزبوونەوە</button>
                    </div>
                  </div>
                ) : isEditing ? (
                  <form onSubmit={handleSaveEdit} className="grid gap-3 sm:grid-cols-2">
                    <div><label className="mb-1 block text-xs text-ink/40">ناو</label><input required value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="mb-1 block text-xs text-ink/40">مۆبایل</label><input required dir="ltr" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm font-mono outline-none focus:border-primary" /></div>
                    <div><label className="mb-1 block text-xs text-ink/40">تەمەن</label><input type="number" value={editAge} onChange={(e) => setEditAge(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm font-mono outline-none focus:border-primary" /></div>
                    <div><label className="mb-1 block text-xs text-ink/40">جۆری خوێن</label><input value={editBloodGroup} onChange={(e) => setEditBloodGroup(e.target.value)} placeholder="O+" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="mb-1 block text-xs text-ink/40">نەخۆشی</label><input value={editIllness} onChange={(e) => setEditIllness(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" /></div>
                    <div><label className="mb-1 block text-xs text-ink/40">پەیوەندی نائاسایی</label><input dir="ltr" value={editEmergencyContact} onChange={(e) => setEditEmergencyContact(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2 text-sm font-mono outline-none focus:border-primary" /></div>
                    <div className="flex gap-2 sm:col-span-2">
                      <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-dark"><Check size={13} /> پاشەکەوتکردن</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="rounded-lg border border-line px-4 py-2 text-xs text-ink/60">پاشگەزبوونەوە</button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                    <div><p className="text-xs text-ink/40">تەمەن</p><p className="mt-0.5 font-medium text-ink">{selected.age ?? "—"}</p></div>
                    <div><p className="text-xs text-ink/40">مۆبایل</p><p className="mt-0.5 font-mono font-medium text-ink" dir="ltr">{selected.phone}</p></div>
                    <div><p className="text-xs text-ink/40">دوایین سەردان</p><p className="mt-0.5 font-medium text-ink">{selected.lastVisitDate ?? "—"}</p></div>
                    <div><p className="text-xs text-ink/40">نەخۆشی</p><p className="mt-0.5 font-medium text-ink">{selected.illness ?? "—"}</p></div>
                    <div className="col-span-2"><p className="text-xs text-ink/40">پەیوەندی نائاسایی</p><p className="mt-0.5 font-mono font-medium text-ink" dir="ltr">{selected.emergencyContact ?? "—"}</p></div>
                  </div>
                )}
              </Card>

              <Card>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-medium text-ink/50">زانیاری دەربارەی نەخۆش (تەنها خوێندنەوە)</p>
                  {!showAddNote && (
                    <button onClick={() => setShowAddNote(true)} className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs text-primary hover:border-primary">
                      <Plus size={12} /> زیادکردنی تێبینی
                    </button>
                  )}
                </div>

                {showAddNote && (
                  <form onSubmit={handleAddNote} className="mb-3 space-y-2 rounded-xl2 border border-line p-3">
                    <textarea
                      autoFocus
                      required
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      rows={3}
                      placeholder="تێبینیەکەت بنووسە..."
                      className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                      <button type="button" onClick={() => { setShowAddNote(false); setNewNoteText(""); }} className="flex items-center gap-1 rounded-lg border border-line px-3 py-1.5 text-xs text-ink/60"><X size={12} /> پاشگەزبوونەوە</button>
                    </div>
                  </form>
                )}

                {notes.length > 0 ? (
                  <div className="space-y-2">
                    {notes.map((n) => (
                      <div key={n.id} className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink/70">
                        <p>{n.text}</p>
                        <p className="mt-1 text-[11px] text-ink/35">{new Date(n.createdAt).toLocaleString("en-GB")}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  !showAddNote && <p className="rounded-lg border border-line bg-paper px-3 py-3 text-sm text-ink/40">هیچ تێبینیەک تۆمار نەکراوە</p>
                )}
              </Card>

              <Card>
                <h3 className="mb-3 font-kufi text-sm font-semibold text-ink">پشکنینە پزیشکییەکان</h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <button onClick={() => openAddRecord("BLOOD_TEST")} className="flex flex-col items-center gap-2 rounded-xl2 border border-line p-4 hover:border-primary"><Droplet size={18} className="text-danger" /><span className="text-xs text-ink/70">پشکنینی خوێن</span></button>
                  <button onClick={() => openAddRecord("XRAY")} className="flex flex-col items-center gap-2 rounded-xl2 border border-line p-4 hover:border-primary"><FileImage size={18} className="text-primary" /><span className="text-xs text-ink/70">تیشکی ئێکس</span></button>
                  <button onClick={() => openAddRecord("PRESCRIPTION")} className="flex flex-col items-center gap-2 rounded-xl2 border border-line p-4 hover:border-primary"><Pill size={18} className="text-accent" /><span className="text-xs text-ink/70">دەرمانی نووسراو</span></button>
                  <button onClick={() => openAddRecord("OTHER")} className="flex flex-col items-center gap-2 rounded-xl2 border border-line p-4 hover:border-primary"><ClipboardPlus size={18} className="text-ink/60" /><span className="text-xs text-ink/70">پشکنینی تایبەت</span></button>
                </div>

                {showAddRecord && (
                  <form onSubmit={handleAddRecord} className="mt-4 space-y-3 rounded-xl2 border border-line p-4">
                    <p className="text-xs font-medium text-ink/60">
                      {recordType === "OTHER" ? "زیادکردنی پشکنینی تایبەت — ناوی پشکنینەکەت بنووسە" : `زیادکردنی: ${RECORD_TYPE_LABELS[recordType]}`}
                    </p>
                    <input required value={recordTitle} onChange={(e) => setRecordTitle(e.target.value)} placeholder={recordType === "OTHER" ? "ناوی پشکنینەکە (بۆ نموونە: EKG, MRI...)" : "ناونیشان"} className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
                    <textarea value={recordResult} onChange={(e) => setRecordResult(e.target.value)} rows={2} placeholder="ئەنجام / تێبینی (ئارەزوومەندانە)" className="w-full rounded-lg border border-line px-3 py-2 text-sm outline-none focus:border-primary" />
                    <div className="flex gap-2">
                      <button type="submit" className="rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                      <button type="button" onClick={() => setShowAddRecord(false)} className="flex items-center gap-1 rounded-lg border border-line px-3 py-2 text-xs text-ink/60"><X size={12} /> پاشگەزبوونەوە</button>
                    </div>
                  </form>
                )}

                {records.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {records.map((rec) => (
                      <div key={rec.id} className="rounded-lg border border-line px-3 py-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-ink">{RECORD_TYPE_LABELS[rec.type]} — {rec.title}</span>
                          <span className="text-ink/40 font-mono">{new Date(rec.createdAt).toLocaleDateString("en-GB")}</span>
                        </div>
                        {rec.result && <p className="mt-1 text-ink/60">{rec.result}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
    </RequireRole>
  );
}

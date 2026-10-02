"use client";

import { useState } from "react";
import { KeyRound, Plus, Ban, Copy, Check, UserPlus, Building2 } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import RequireRole from "@/components/RequireRole";

export default function DevicesPage() {
  const { state, addDevice, revokeDevice, updateSetting } = useStore();

  const [label, setLabel] = useState("");
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [accName, setAccName] = useState("");
  const [accEmail, setAccEmail] = useState("");
  const [accPassword, setAccPassword] = useState("");
  const [accRole, setAccRole] = useState<Role>("SECRETARY");
  const [accSuccess, setAccSuccess] = useState<string | null>(null);

  const [clinicAddress, setClinicAddress] = useState(state.settings.clinic_address);
  const [clinicPhone, setClinicPhone] = useState(state.settings.clinic_phone);
  const [clinicSaved, setClinicSaved] = useState(false);

  function createDevice(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    const dev = addDevice(label);
    setNewKey(dev.key);
    setLabel("");
  }

  function createAccount(e: React.FormEvent) {
    e.preventDefault();
    // Demo note: there's no real accounts list to persist to (login accepts
    // any credentials), and calling the store's `register` here would
    // switch the current session to the new account — not what a doctor
    // adding a colleague wants. So this just shows a confirmation.
    setAccSuccess(`هەژماری ${accRole === "DOCTOR" ? "دکتۆر" : "سکرتێر"} بۆ "${accName}" دروستکرا (دیمۆیە — تۆمار نەکرا).`);
    setAccName(""); setAccEmail(""); setAccPassword("");
  }

  function saveClinicInfo(e: React.FormEvent) {
    e.preventDefault();
    updateSetting("clinic_address", clinicAddress);
    updateSetting("clinic_phone", clinicPhone);
    setClinicSaved(true);
    setTimeout(() => setClinicSaved(false), 1500);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="دیڤایسەکان">
    <div>
      <PageHeader title="بەڕێوەبردنی دیڤایسەکان" back />

      <div className="space-y-6 p-6">
        <Card>
          <div className="mb-4 flex items-center gap-2"><Building2 size={16} className="text-primary" /><h2 className="font-kufi text-sm font-semibold text-ink">زانیاری کلینیک</h2></div>
          <form onSubmit={saveClinicInfo} className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ناونیشان</label>
              <textarea value={clinicAddress} onChange={(e) => setClinicAddress(e.target.value)} rows={2} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ژمارە مۆبایل</label>
              <input dir="ltr" value={clinicPhone} onChange={(e) => setClinicPhone(e.target.value)} className="w-full rounded-lg border border-line px-3 py-2.5 text-sm font-mono outline-none focus:border-primary" />
            </div>
            <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">{clinicSaved ? <Check size={14} /> : "پاشەکەوتکردن"}</button>
          </form>
        </Card>

        <Card className="text-xs leading-relaxed text-ink/50">
          هەر کۆمپیوتەرێک کە دەتەوێت ئەم سیستەمە لەسەری کار بکات، پێویستی بە کۆدێکی تایبەتی دیڤایسە. کۆدەکە تەنها <b>یەک جار</b> پیشان دەدرێت.
        </Card>

        <Card>
          <form onSubmit={createDevice} className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ناوی کۆمپیوتەر</label>
              <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="بۆ نموونە: کۆمپیوتەری پێشوازی" className="w-full rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <button type="submit" className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark"><Plus size={15} /> دروستکردنی کۆد</button>
          </form>

          {newKey && (
            <div className="mt-4 rounded-xl2 border border-success/30 bg-success/10 p-4">
              <p className="mb-2 text-xs font-medium text-success">کۆدی نوێ (تەنها ئێستا پیشان دەدرێت):</p>
              <div className="flex items-center gap-2">
                <code dir="ltr" className="flex-1 overflow-x-auto rounded-lg bg-surface px-3 py-2 font-mono text-xs text-ink">{newKey}</code>
                <button onClick={() => { navigator.clipboard.writeText(newKey); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="rounded-lg border border-line p-2 hover:border-primary">
                  {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
                </button>
              </div>
            </div>
          )}
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="border-b border-line px-5 py-4"><h2 className="font-kufi text-sm font-semibold text-ink">دیڤایسە مۆڵەتدراوەکان</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">ناو</th>
                <th className="px-5 py-2 font-normal">دۆخ</th>
                <th className="px-5 py-2 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {state.devices.map((d) => (
                <tr key={d.id} className="border-t border-line/70">
                  <td className="px-5 py-3 font-medium text-ink flex items-center gap-2"><KeyRound size={14} className="text-ink/30" /> {d.label}</td>
                  <td className="px-5 py-3"><span className={"rounded-full px-2.5 py-1 text-xs " + (d.active ? "bg-success/10 text-success" : "bg-ink/5 text-ink/40")}>{d.active ? "چالاک" : "پاشگەزبووەوە"}</span></td>
                  <td className="px-5 py-3">
                    {d.active && <button onClick={() => revokeDevice(d.id)} className="flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs text-danger hover:bg-danger/10"><Ban size={12} /> پاشگەزبوونەوە</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center gap-2"><UserPlus size={16} className="text-primary" /><h2 className="font-kufi text-sm font-semibold text-ink">زیادکردنی هەژماری کارمەند</h2></div>
          <form onSubmit={createAccount} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={accName} onChange={(e) => setAccName(e.target.value)} placeholder="ناوی تەواو" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input required type="email" dir="ltr" value={accEmail} onChange={(e) => setAccEmail(e.target.value)} placeholder="email@clinic.local" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required type="password" dir="ltr" value={accPassword} onChange={(e) => setAccPassword(e.target.value)} placeholder="وشەی نهێنی" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setAccRole("DOCTOR")} className={"rounded-lg border py-2 text-sm font-medium " + (accRole === "DOCTOR" ? "border-primary bg-primary text-white" : "border-line text-ink/60")}>دکتۆر</button>
                <button type="button" onClick={() => setAccRole("SECRETARY")} className={"rounded-lg border py-2 text-sm font-medium " + (accRole === "SECRETARY" ? "border-primary bg-primary text-white" : "border-line text-ink/60")}>سکرتێر</button>
              </div>
            </div>
            {accSuccess && <p className="text-xs text-success">{accSuccess}</p>}
            <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark">دروستکردنی هەژمار</button>
          </form>
        </Card>
      </div>
    </div>
    </RequireRole>
  );
}

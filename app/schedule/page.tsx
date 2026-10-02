"use client";

import { useState } from "react";
import { Clock, BellRing, Wallet, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { WEEKDAY_LABELS, WEEKDAYS, WeekDay } from "@/lib/types";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

interface ShiftRow { start: string; end: string; notes: string; }
type ShiftMap = Record<WeekDay, ShiftRow>;

function emptyShifts(): ShiftMap {
  const map = {} as ShiftMap;
  for (const day of WEEKDAYS) map[day] = { start: "", end: "", notes: "" };
  // A couple of pre-filled example rows so the schedule doesn't look empty in the demo.
  map.SATURDAY = { start: "13:00", end: "18:00", notes: "" };
  map.MONDAY = { start: "09:00", end: "14:00", notes: "" };
  map.WEDNESDAY = { start: "13:00", end: "18:00", notes: "کۆبوونەوەی مانگانە" };
  return map;
}

export default function SchedulePage() {
  const { state, updateSetting } = useStore();
  const [shifts, setShifts] = useState<ShiftMap>(emptyShifts);
  const [fee, setFee] = useState(state.settings.consultation_fee);
  const [feeSaved, setFeeSaved] = useState(false);
  const [reminderHours, setReminderHours] = useState(state.settings.reminder_hours);
  const [reminderSaved, setReminderSaved] = useState(false);

  function updateShift(day: WeekDay, field: keyof ShiftRow, value: string) {
    setShifts((s) => ({ ...s, [day]: { ...s[day], [field]: value } }));
  }

  function saveFee() {
    updateSetting("consultation_fee", fee);
    setFeeSaved(true);
    setTimeout(() => setFeeSaved(false), 1500);
  }

  function saveReminder() {
    updateSetting("reminder_hours", reminderHours);
    setReminderSaved(true);
    setTimeout(() => setReminderSaved(false), 1500);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="خشتەی کار">
    <div>
      <PageHeader title="خشتەی کار" back />

      <div className="space-y-6 p-6">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Clock size={16} className="text-primary" />
            <h2 className="font-kufi text-sm font-semibold text-ink">خشتەی هەفتانە</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
              <tr className="text-right text-xs text-ink/40">
                <th className="px-5 py-2 font-normal">ڕۆژ</th>
                <th className="px-5 py-2 font-normal">لە</th>
                <th className="px-5 py-2 font-normal">بۆ</th>
                <th className="px-5 py-2 font-normal">تێبینی</th>
              </tr>
            </thead>
            <tbody>
              {WEEKDAYS.map((day) => (
                <tr key={day} className="border-t border-line/70">
                  <td className="px-5 py-2.5 font-kufi font-medium text-ink">{WEEKDAY_LABELS[day]}</td>
                  <td className="px-5 py-2.5"><input type="time" value={shifts[day].start} onChange={(e) => updateShift(day, "start", e.target.value)} className="rounded-md border border-line px-2 py-1 font-mono text-xs" /></td>
                  <td className="px-5 py-2.5"><input type="time" value={shifts[day].end} onChange={(e) => updateShift(day, "end", e.target.value)} className="rounded-md border border-line px-2 py-1 font-mono text-xs" /></td>
                  <td className="px-5 py-2.5"><input value={shifts[day].notes} onChange={(e) => updateShift(day, "notes", e.target.value)} placeholder="—" className="w-full rounded-md border border-line px-2 py-1 text-xs" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <div className="mb-3 flex items-center gap-2"><Wallet size={16} className="text-primary" /><h3 className="font-kufi text-sm font-semibold text-ink">نرخی چاوپێکەوتن</h3></div>
            <div className="flex items-center gap-2">
              <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="نرخ بنووسە" className="w-full rounded-lg border border-line px-3 py-2.5 font-mono text-sm outline-none focus:border-primary" />
              <span className="text-sm text-ink/50">د.ع</span>
              <button onClick={saveFee} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-white hover:bg-primary-dark">{feeSaved ? <Check size={14} /> : "پاشەکەوت"}</button>
            </div>
          </Card>

          <Card>
            <div className="mb-3 flex items-center gap-2"><BellRing size={16} className="text-primary" /><h3 className="font-kufi text-sm font-semibold text-ink">ئاگادارکردنەوەی خۆکار</h3></div>
            <div className="flex items-center gap-2">
              <input type="number" value={reminderHours} onChange={(e) => setReminderHours(e.target.value)} placeholder="ژمارەی کاتژمێر" className="w-full rounded-lg border border-line px-3 py-2.5 font-mono text-sm outline-none focus:border-primary" />
              <span className="whitespace-nowrap text-sm text-ink/50">کاتژمێر پێش سەردان</span>
              <button onClick={saveReminder} className="flex items-center gap-1 rounded-lg bg-primary px-3 py-2.5 text-xs font-medium text-white hover:bg-primary-dark">{reminderSaved ? <Check size={14} /> : "پاشەکەوت"}</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </RequireRole>
  );
}

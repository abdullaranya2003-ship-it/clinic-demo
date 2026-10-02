"use client";

import { useState } from "react";
import { CalendarClock, PackageX, Megaphone, Siren, Settings2, Check } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

const ICONS: Record<string, any> = {
  APPOINTMENT_REMINDER: CalendarClock,
  QUEUE_ALERT: Siren,
  LOW_STOCK: PackageX,
  SEMINAR: Megaphone,
  EMERGENCY: Siren,
  SYSTEM: Settings2,
};
const TONE: Record<string, string> = {
  APPOINTMENT_REMINDER: "bg-primary-50 text-primary",
  QUEUE_ALERT: "bg-accent-50 text-accent",
  LOW_STOCK: "bg-accent-50 text-accent",
  SEMINAR: "bg-primary-50 text-primary",
  EMERGENCY: "bg-danger/10 text-danger",
  SYSTEM: "bg-ink/5 text-ink/50",
};

export default function NotificationsPage() {
  const { state, markNotificationRead, updateSetting } = useStore();
  const [smsEnabled, setSmsEnabled] = useState(state.settings.sms_reminders);
  const [waEnabled, setWaEnabled] = useState(state.settings.whatsapp_reminders);
  const [reminderHours, setReminderHours] = useState(state.settings.reminder_hours);
  const [saved, setSaved] = useState(false);

  function saveSettings() {
    updateSetting("sms_reminders", smsEnabled);
    updateSetting("whatsapp_reminders", waEnabled);
    updateSetting("reminder_hours", reminderHours);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <RequireRole allow={["DOCTOR"]} title="ئاگادارکردنەوەکان">
    <div>
      <PageHeader title="ئاگادارکردنەوەکان" back />

      <div className="grid gap-6 p-6 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {state.notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Settings2;
            return (
              <Card key={n.id} className={"flex items-start gap-4 " + (!n.read ? "border-primary/30" : "opacity-70")}>
                <div className={"flex h-10 w-10 shrink-0 items-center justify-center rounded-full " + (TONE[n.type] ?? TONE.SYSTEM)}>
                  <Icon size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-kufi text-sm font-medium text-ink">{n.title}</p>
                  {n.body && <p className="mt-1 text-xs text-ink/50">{n.body}</p>}
                  <p className="mt-2 text-[11px] text-ink/30">{new Date(n.createdAt).toLocaleString("en-GB")}</p>
                </div>
                {!n.read && (
                  <button onClick={() => markNotificationRead(n.id)} className="flex shrink-0 items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs text-ink/60 hover:border-primary hover:text-primary">
                    <Check size={12} /> خوێندرایەوە
                  </button>
                )}
              </Card>
            );
          })}
          {state.notifications.length === 0 && <Card className="text-center text-sm text-ink/40">هیچ ئاگادارکردنەوەیەک نییە</Card>}
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="mb-3 font-kufi text-sm font-semibold text-ink">ڕێکخستنی ئاگادارکردنەوە</h3>
            <div className="space-y-3 text-sm">
              <label className="flex items-center justify-between">
                <span className="text-ink/70">ناردنی SMS پێش سەردان</span>
                <input type="checkbox" checked={smsEnabled} onChange={(e) => setSmsEnabled(e.target.checked)} className="h-4 w-4 accent-primary" />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-ink/70">ناردنی WhatsApp پێش سەردان</span>
                <input type="checkbox" checked={waEnabled} onChange={(e) => setWaEnabled(e.target.checked)} className="h-4 w-4 accent-primary" />
              </label>
              <div className="border-t border-line pt-3">
                <p className="mb-1.5 text-xs text-ink/50">کاتی بیرخستنەوە پێش سەردان</p>
                <div className="flex items-center gap-2">
                  <input type="number" value={reminderHours} onChange={(e) => setReminderHours(e.target.value)} placeholder="کاتژمێر" className="w-20 rounded-lg border border-line px-3 py-2 font-mono text-sm outline-none focus:border-primary" />
                  <span className="text-xs text-ink/50">کاتژمێر</span>
                </div>
              </div>
              <button onClick={saveSettings} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark">
                {saved ? <Check size={14} /> : "پاشەکەوتکردن"}
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </RequireRole>
  );
}

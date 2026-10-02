"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import {
  Patient, MedicalRecord, PatientNote, Appointment, QueueEntry, Invoice, InventoryItem,
  StaffMember, Surgery, NotificationItem, ClinicSettings, DeviceKeyDemo,
  CurrentUser, Role,
} from "./types";
import { nextDateForWeekday, uid, todayISODate } from "./date";

const STORAGE_KEY = "clinic_demo_state_v1";

interface State {
  currentUser: CurrentUser | null;
  deviceVerified: boolean;
  patients: Patient[];
  records: MedicalRecord[];
  patientNotes: PatientNote[];
  appointments: Appointment[];
  queue: QueueEntry[];
  invoices: Invoice[];
  inventory: InventoryItem[];
  staff: StaffMember[];
  surgeries: Surgery[];
  notifications: NotificationItem[];
  settings: ClinicSettings;
  devices: DeviceKeyDemo[];
}

function seedState(): State {
  const now = new Date();
  const today = new Date(now); today.setHours(0, 0, 0, 0);

  const p1: Patient = { id: uid("pt"), name: "کاروان محەمەد", phone: "0770 111 2233", age: 34, bloodGroup: "O+", illness: "فشاری خوێن بەرز", notes: "پێویستە هەردەم مۆنیتەر بکرێت.", lastVisitDate: today.toISOString().slice(0, 10), emergencyContact: "0770 999 8877" };
  const p2: Patient = { id: uid("pt"), name: "شنۆ عەبدوڵڵا", phone: "0750 222 3344", age: 27, bloodGroup: "A+", illness: "ئیمگرین", notes: "هەستیارە بۆ ئاسپرین.", emergencyContact: "0750 111 2233" };
  const p3: Patient = { id: uid("pt"), name: "هێمن ڕەشید", phone: "0771 333 4455", age: 45, bloodGroup: "B+", illness: "شەکرە", emergencyContact: "0771 555 6677" };
  const p4: Patient = { id: uid("pt"), name: "ڕۆژین کەریم", phone: "0781 444 5566", age: 22 };

  const patients = [p1, p2, p3, p4];

  const queue: QueueEntry[] = [
    { id: uid("q"), patientId: p1.id, queueNumber: 1, status: "IN_ROOM", xrayStatus: "Done", paid: false, visitDate: today.toISOString(), createdAt: now.toISOString() },
    { id: uid("q"), patientId: p2.id, queueNumber: 2, status: "WAITING", xrayStatus: "Pending", paid: false, visitDate: today.toISOString(), createdAt: now.toISOString() },
    { id: uid("q"), patientId: p3.id, queueNumber: 3, status: "WAITING", paid: false, visitDate: today.toISOString(), createdAt: now.toISOString() },
  ];

  const appointments: Appointment[] = [
    { id: uid("ap"), patientId: p1.id, visitDate: today.toISOString(), visitTime: "10:00", status: "IN_QUEUE", queuePosition: 1, createdAt: now.toISOString() },
    { id: uid("ap"), patientId: p2.id, visitDate: today.toISOString(), visitTime: "10:30", status: "IN_QUEUE", queuePosition: 2, createdAt: now.toISOString() },
    { id: uid("ap"), patientId: p4.id, visitDate: nextDateForWeekday("SATURDAY").toISOString(), visitTime: "13:00", status: "PENDING", queuePosition: 1, createdAt: now.toISOString() },
  ];

  const invoices: Invoice[] = [
    { id: uid("inv"), patientId: p3.id, amount: 15000, status: "COLLECTED", description: "چاوپێکەوتن", issuedAt: now.toISOString() },
    { id: uid("inv"), patientId: p2.id, amount: 10000, status: "NOT_COLLECTED", description: "پشکنین", issuedAt: now.toISOString() },
  ];

  const inventory: InventoryItem[] = [
    { id: uid("inv-item"), name: "Amoxicillin 500mg", batchNumber: "AMX-2026-01", stockLevel: 120, lowStockAt: 20 },
    { id: uid("inv-item"), name: "Pelastimol", batchNumber: "PLT-2026-04", stockLevel: 8, lowStockAt: 15 },
    { id: uid("inv-item"), name: "Ibuprofen 400mg", batchNumber: "IBU-2026-02", stockLevel: 60, lowStockAt: 20 },
  ];

  const staff: StaffMember[] = [
    { id: uid("st"), name: "کارمەند محەمەد", role: "پێشوازیکار", phone: "0770 123 4567", active: true },
    { id: uid("st"), name: "سارا ئەحمەد", role: "نەرس", phone: "0771 345 6789", active: true },
  ];

  const surgeries: Surgery[] = [
    { id: uid("sg"), patientName: "دڵشاد کەریم", scheduledAt: new Date(today.getTime() + 3 * 86400000 + 36000000).toISOString(), type: "نەشتەرگەری زگ", consentNote: "براستی، مامی نەخۆش، ڕازیبوونی زارەکی وەرگیرا" },
  ];

  const notifications: NotificationItem[] = [
    { id: uid("nt"), type: "LOW_STOCK", title: "کۆگای کەم: Pelastimol تەنها ٨ دانە ماوە", read: false, createdAt: now.toISOString() },
    { id: uid("nt"), type: "APPOINTMENT_REMINDER", title: "بیرخستنەوە: ڕۆژین کەریم — شەممەی داهاتوو", read: false, createdAt: now.toISOString() },
    { id: uid("nt"), type: "SEMINAR", title: "سیمینار: نوێترین شێوازەکانی چاودێری شەکرە", read: true, createdAt: now.toISOString() },
  ];

  const records: MedicalRecord[] = [
    { id: uid("rec"), patientId: p1.id, type: "BLOOD_TEST", title: "پشکنینی گشتی خوێن", result: "ئاسایی", createdAt: now.toISOString() },
  ];

  // The old single `notes` string on p1/p2 is migrated into the new
  // append-only, timestamped notes list — this is what the "زانیاری
  // دەربارەی نەخۆش" section reads from now.
  const patientNotes: PatientNote[] = [
    { id: uid("pn"), patientId: p1.id, text: "پێویستە هەردەم مۆنیتەر بکرێت.", createdAt: now.toISOString() },
    { id: uid("pn"), patientId: p2.id, text: "هەستیارە بۆ ئاسپرین.", createdAt: now.toISOString() },
  ];

  return {
    currentUser: null,
    deviceVerified: false,
    patients,
    records,
    patientNotes,
    appointments,
    queue,
    invoices,
    inventory,
    staff,
    surgeries,
    notifications,
    settings: {
      clinic_address: "ڕانیه - به‌رامبه‌ر بازاڕی لەنگە - نهۆمی یەکەم",
      clinic_phone: "0770 000 0000",
      consultation_fee: "10000",
      reminder_hours: "48",
      sms_reminders: true,
      whatsapp_reminders: true,
      shift_active: true,
    },
    devices: [{ id: uid("dev"), label: "دیڤایسی دیمۆ", key: "DEMO-0000-0000", active: true, createdAt: now.toISOString() }],
  };
}

function loadState(): State {
  if (typeof window === "undefined") return seedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState();
    const parsed = JSON.parse(raw) as State;
    // Basic shape check — if corrupted or from an older version, reseed.
    if (!parsed.patients || !parsed.settings) return seedState();
    // Migrate older saved states that predate the patientNotes list.
    if (!parsed.patientNotes) parsed.patientNotes = [];
    return parsed;
  } catch {
    return seedState();
  }
}

interface Warning { aheadCount: number; estimatedWaitMinutes: number; message: string }

interface StoreValue {
  state: State;
  // auth
  verifyDevice: (key: string) => boolean;
  login: (email: string, password: string, role: Role) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: Role) => void;
  // patients
  addPatient: (data: Partial<Patient> & { name: string; phone: string }) => Patient;
  updatePatient: (id: string, data: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  addMedicalRecord: (patientId: string, data: Omit<MedicalRecord, "id" | "patientId" | "createdAt">) => void;
  addPatientNote: (patientId: string, text: string) => void;
  findOrCreatePatient: (name: string, phone: string, age?: number) => Patient;
  // appointments
  bookAppointment: (data: { name: string; phone: string; age?: number; visitDate: string; visitTime?: string; symptoms?: string }) => { appointment: Appointment; warning: Warning | null; addedToQueue: boolean };
  // queue
  addToQueue: (data: { name: string; phone: string; age?: number; insuranceNo?: string; xrayStatus?: string }) => QueueEntry;
  callNext: () => QueueEntry | null;
  updateQueueEntry: (id: string, data: Partial<QueueEntry>) => void;
  enterRoom: (id: string) => void;
  markVisitPaid: (queueEntryId: string) => void;
  // finance
  addInvoice: (data: { amount: number; status: "COLLECTED" | "NOT_COLLECTED"; description?: string; patientId?: string }) => void;
  // inventory / staff
  addInventoryItem: (data: Omit<InventoryItem, "id">) => void;
  addStaffMember: (data: Omit<StaffMember, "id" | "active">) => void;
  // surgeries
  addSurgery: (data: Omit<Surgery, "id">) => void;
  deleteSurgery: (id: string) => void;
  // notifications
  markNotificationRead: (id: string) => void;
  // settings
  updateSetting: <K extends keyof ClinicSettings>(key: K, value: ClinicSettings[K]) => void;
  // devices
  addDevice: (label: string) => DeviceKeyDemo;
  revokeDevice: (id: string) => void;
  // demo utility
  resetDemo: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(seedState);
  const hydrated = useRef(false);

  useEffect(() => {
    setState(loadState());
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  function update(fn: (s: State) => State) {
    setState((s) => fn(s));
  }

  function findOrCreatePatient(name: string, phone: string, age?: number): Patient {
    let created: Patient | null = null;
    update((s) => {
      const existing = s.patients.find((p) => p.phone === phone);
      if (existing) {
        const updated = { ...existing, name, age: age ?? existing.age };
        created = updated;
        return { ...s, patients: s.patients.map((p) => (p.id === existing.id ? updated : p)) };
      }
      const np: Patient = { id: uid("pt"), name, phone, age };
      created = np;
      return { ...s, patients: [np, ...s.patients] };
    });
    return created as unknown as Patient;
  }

  function addToQueueInternal(s: State, patientId: string, extra?: { insuranceNo?: string; xrayStatus?: string }): { state: State; entry: QueueEntry } {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const todaysEntries = s.queue.filter((q) => new Date(q.visitDate).toDateString() === today.toDateString());
    const maxNum = todaysEntries.reduce((m, q) => Math.max(m, q.queueNumber), 0);
    const entry: QueueEntry = {
      id: uid("q"),
      patientId,
      queueNumber: maxNum + 1,
      status: "WAITING",
      paid: false,
      visitDate: today.toISOString(),
      createdAt: new Date().toISOString(),
      insuranceNo: extra?.insuranceNo,
      xrayStatus: extra?.xrayStatus,
    };
    return { state: { ...s, queue: [...s.queue, entry] }, entry };
  }

  const value: StoreValue = {
    state,

    verifyDevice: () => true, // demo: any key is accepted

    login: (email, _password, role) => {
      update((s) => ({ ...s, currentUser: { name: role === "DOCTOR" ? "دکتۆر" : "سکرتێر", email, role } }));
    },
    logout: () => update((s) => ({ ...s, currentUser: null })),
    register: (name, email, _password, role) => {
      update((s) => ({ ...s, currentUser: { name, email, role } }));
    },

    addPatient: (data) => {
      const p: Patient = { id: uid("pt"), ...data };
      update((s) => ({ ...s, patients: [p, ...s.patients] }));
      return p;
    },
    updatePatient: (id, data) => update((s) => ({ ...s, patients: s.patients.map((p) => (p.id === id ? { ...p, ...data } : p)) })),
    deletePatient: (id) =>
      update((s) => ({
        ...s,
        patients: s.patients.filter((p) => p.id !== id),
        records: s.records.filter((r) => r.patientId !== id),
        patientNotes: s.patientNotes.filter((n) => n.patientId !== id),
        appointments: s.appointments.filter((a) => a.patientId !== id),
        queue: s.queue.filter((q) => q.patientId !== id),
      })),
    addMedicalRecord: (patientId, data) =>
      update((s) => ({ ...s, records: [{ id: uid("rec"), patientId, createdAt: new Date().toISOString(), ...data }, ...s.records] })),
    addPatientNote: (patientId, text) =>
      update((s) => ({ ...s, patientNotes: [{ id: uid("pn"), patientId, text, createdAt: new Date().toISOString() }, ...s.patientNotes] })),
    findOrCreatePatient,

    bookAppointment: ({ name, phone, age, visitDate, visitTime, symptoms }) => {
      const patient = findOrCreatePatient(name, phone, age);
      // visitDate arrives as "YYYY-MM-DD" from a plain <input type="date">
      // — store it as a real Date (midnight) so it sorts/compares the same
      // way as every other date field in this app.
      const visitDateObj = new Date(`${visitDate}T00:00:00`);
      const isToday = visitDate === todayISODate();
      let result!: { appointment: Appointment; warning: Warning | null; addedToQueue: boolean };

      update((s) => {
        const sameDayCount = s.appointments.filter(
          (a) => a.visitDate.slice(0, 10) === visitDate && a.status !== "CANCELLED"
        ).length;
        const queuePosition = sameDayCount + 1;
        const appointment: Appointment = {
          id: uid("ap"), patientId: patient.id, visitDate: visitDateObj.toISOString(), visitTime,
          symptoms, status: "PENDING", queuePosition, createdAt: new Date().toISOString(),
        };

        let nextState: State = { ...s, appointments: [...s.appointments, appointment] };
        let addedToQueue = false;

        if (isToday) {
          const r = addToQueueInternal(nextState, patient.id);
          nextState = r.state;
          nextState = { ...nextState, appointments: nextState.appointments.map((a) => (a.id === appointment.id ? { ...a, status: "IN_QUEUE" } : a)) };
          addedToQueue = true;
        }

        let warning: Warning | null = null;
        if (queuePosition >= 2) {
          const aheadCount = queuePosition - 1;
          const estimatedWaitMinutes = aheadCount * 15;
          warning = {
            aheadCount, estimatedWaitMinutes,
            message: `ئاگاداری: ${aheadCount} نۆرەی تر لەپێش ئەم نۆرەیە هەیە. کاتی چاوەڕوانی نزیکەی ${estimatedWaitMinutes} خولەکە.`,
          };
        }

        result = { appointment, warning, addedToQueue };
        return nextState;
      });

      return result;
    },

    addToQueue: ({ name, phone, age, insuranceNo, xrayStatus }) => {
      const patient = findOrCreatePatient(name, phone, age);
      let created!: QueueEntry;
      update((s) => {
        const r = addToQueueInternal(s, patient.id, { insuranceNo, xrayStatus });
        created = r.entry;
        return r.state;
      });
      return created;
    },

    callNext: () => {
      let called: QueueEntry | null = null;
      update((s) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const isToday = (q: QueueEntry) => new Date(q.visitDate).toDateString() === today.toDateString();
        let queue = s.queue.map((q) => (isToday(q) && q.status === "IN_ROOM" ? { ...q, status: "DONE" as const } : q));
        const next = queue.filter((q) => isToday(q) && q.status === "WAITING").sort((a, b) => a.queueNumber - b.queueNumber)[0];
        if (next) {
          queue = queue.map((q) => (q.id === next.id ? { ...q, status: "IN_ROOM" as const } : q));
          called = { ...next, status: "IN_ROOM" };
        }
        return { ...s, queue };
      });
      return called;
    },

    updateQueueEntry: (id, data) => update((s) => ({ ...s, queue: s.queue.map((q) => (q.id === id ? { ...q, ...data } : q)) })),

    enterRoom: (id) =>
      update((s) => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const isToday = (q: QueueEntry) => new Date(q.visitDate).toDateString() === today.toDateString();
        const queue = s.queue.map((q) => {
          if (isToday(q) && q.status === "IN_ROOM" && q.id !== id) return { ...q, status: "DONE" as const };
          if (q.id === id) return { ...q, status: "IN_ROOM" as const };
          return q;
        });
        return { ...s, queue };
      }),

    markVisitPaid: (queueEntryId) =>
      update((s) => {
        const entry = s.queue.find((q) => q.id === queueEntryId);
        if (!entry || entry.paid) return s;
        const amount = Number(s.settings.consultation_fee || "0");
        const invoice: Invoice = { id: uid("inv"), patientId: entry.patientId, amount, status: "COLLECTED", description: "چاوپێکەوتن", issuedAt: new Date().toISOString() };
        return {
          ...s,
          queue: s.queue.map((q) => (q.id === queueEntryId ? { ...q, paid: true } : q)),
          invoices: [invoice, ...s.invoices],
        };
      }),

    addInvoice: (data) => update((s) => ({ ...s, invoices: [{ id: uid("inv"), issuedAt: new Date().toISOString(), ...data }, ...s.invoices] })),

    addInventoryItem: (data) => update((s) => ({ ...s, inventory: [{ id: uid("inv-item"), ...data }, ...s.inventory] })),
    addStaffMember: (data) => update((s) => ({ ...s, staff: [{ id: uid("st"), active: true, ...data }, ...s.staff] })),

    addSurgery: (data) => update((s) => ({ ...s, surgeries: [{ id: uid("sg"), ...data }, ...s.surgeries].sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt)) })),
    deleteSurgery: (id) => update((s) => ({ ...s, surgeries: s.surgeries.filter((sg) => sg.id !== id) })),

    markNotificationRead: (id) => update((s) => ({ ...s, notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),

    updateSetting: (key, value) => update((s) => ({ ...s, settings: { ...s.settings, [key]: value } })),

    addDevice: (label) => {
      const dev: DeviceKeyDemo = { id: uid("dev"), label, key: `DEMO-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`, active: true, createdAt: new Date().toISOString() };
      update((s) => ({ ...s, devices: [dev, ...s.devices] }));
      return dev;
    },
    revokeDevice: (id) => update((s) => ({ ...s, devices: s.devices.map((d) => (d.id === id ? { ...d, active: false } : d)) })),

    resetDemo: () => {
      const fresh = seedState();
      setState(fresh);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

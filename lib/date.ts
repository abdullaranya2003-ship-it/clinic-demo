const JS_DAY_TO_WEEKDAY = [
  "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY",
] as const;

export function weekDayOf(date: Date): string {
  return JS_DAY_TO_WEEKDAY[date.getDay()];
}

/** Start-of-day Date for the next calendar occurrence of the given
 * WeekDay, counting today as valid. Mirrors the backend's helper so
 * "how many patients are ahead of you" is scoped to one specific day,
 * not the recurring weekday name forever. */
export function nextDateForWeekday(weekDay: string): Date {
  const targetIndex = JS_DAY_TO_WEEKDAY.indexOf(weekDay as (typeof JS_DAY_TO_WEEKDAY)[number]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = (targetIndex - today.getDay() + 7) % 7;
  const result = new Date(today);
  result.setDate(result.getDate() + diff);
  return result;
}

export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(isoA: string, dateB: Date): boolean {
  const a = new Date(isoA);
  return a.getFullYear() === dateB.getFullYear() && a.getMonth() === dateB.getMonth() && a.getDate() === dateB.getDate();
}

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** "YYYY-MM-DD" for today — used as the `min` on the appointment date
 * picker, and to check "is this booking for today" by plain string
 * comparison (no timezone edge cases from constructing Date objects). */
export function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** "YYYY-MM-DD" six months from today — the `max` on the appointment date
 * picker, per the clinic's policy of booking up to 6 months ahead. */
export function maxBookingDateISO(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 6);
  return d.toISOString().slice(0, 10);
}

const GREGORIAN_MONTHS_CKB = [
  "کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران",
  "تەمووز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم",
];

/** "کانوونی دووەم ٢٠٢٦"-style label for grouping a list by month. Takes an
 * ISO date string (just the date part is used). */
export function monthYearLabel(isoDate: string): string {
  const d = new Date(isoDate);
  return `${GREGORIAN_MONTHS_CKB[d.getMonth()]} ${d.getFullYear()}`;
}

/** Sort key for grouping by month — "2026-03" — so groups sort correctly
 * regardless of display label. */
export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

"use client";

import { useEffect, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return now;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-GB");
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function PageHeader({ title, back }: { title: string; back?: boolean }) {
  const now = useClock();
  const router = useRouter();
  const { state, logout } = useStore();
  const user = state.currentUser;
  const isDoctor = user?.role === "DOCTOR";
  const unreadCount = isDoctor ? state.notifications.filter((n) => !n.read).length : 0;

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-surface/90 px-6 py-4 backdrop-blur">
      <div className="flex items-center gap-3">
        {back && (
          <Link href="/dashboard" className="rounded-lg border border-line px-3 py-1.5 text-sm text-ink/60 hover:bg-paper">
            گەڕانەوە
          </Link>
        )}
        <h1 className="font-kufi text-lg font-semibold text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-5 text-sm text-ink/70">
        {now && (
          <div className="hidden sm:flex flex-col items-end leading-tight font-mono">
            <span className="text-ink">{formatTime(now)}</span>
            <span className="text-xs text-ink/40">{formatDate(now)}</span>
          </div>
        )}

        {isDoctor && (
          <Link href="/notifications" className="relative rounded-full p-2 hover:bg-paper" aria-label="ئاگادارکردنەوەکان">
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </Link>
        )}

        <div className="hidden sm:block h-8 w-px bg-line" />
        <span className="hidden sm:inline font-medium text-ink">{user?.name}</span>

        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-ink/60 hover:border-danger hover:text-danger transition-colors"
        >
          <LogOut size={15} />
          دەرچوون
        </button>
      </div>
    </header>
  );
}

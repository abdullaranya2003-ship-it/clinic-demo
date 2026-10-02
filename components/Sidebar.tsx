"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarPlus, Users, Wallet, UserSquare2, CalendarClock,
  Boxes, BellRing, Stethoscope, KeyRound, Scissors, Phone, RotateCcw, Menu, X,
} from "lucide-react";
import clsx from "clsx";
import { useStore } from "@/lib/store";

const SECRETARY_NAV = [
  { href: "/dashboard", label: "داشبۆردی سەرەکی", icon: LayoutDashboard },
  { href: "/appointments", label: "نۆڕە گرتن", icon: CalendarPlus },
  { href: "/queue", label: "ڕیزی نەخۆشان", icon: Users },
];

const DOCTOR_NAV = [
  { href: "/dashboard", label: "داشبۆردی سەرەکی", icon: LayoutDashboard },
  { href: "/finance", label: "دەرامەت و شیکاری", icon: Wallet },
  { href: "/patients", label: "نەخۆشەکان", icon: UserSquare2 },
  { href: "/surgeries", label: "نەشتەرگەری", icon: Scissors },
  { href: "/schedule", label: "خشتەی کار", icon: CalendarClock },
  { href: "/inventory", label: "کارمەند و دەرمان", icon: Boxes },
  { href: "/notifications", label: "ئاگادارکردنەوەکان", icon: BellRing },
  { href: "/devices", label: "دیڤایسەکان", icon: KeyRound },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { state, resetDemo } = useStore();
  const user = state.currentUser;
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/" || pathname === "/book") return null; // auth screen + public booking have no nav
  if (!user) return null;

  const nav = user.role === "DOCTOR" ? DOCTOR_NAV : SECRETARY_NAV;

  function handleReset() {
    if (confirm("هەموو داتای دیمۆکە دەگەڕێتەوە بۆ دۆخی سەرەتایی. دڵنیایت؟")) resetDemo();
  }

  const brand = (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white">
        <Stethoscope size={20} />
      </div>
      <div>
        <p className="font-kufi text-sm font-semibold text-ink">کلینیکی ڕۆژهەڵات</p>
        <p className="text-xs text-ink/50">{user.role === "DOCTOR" ? "داشبۆردی دکتۆر" : "داشبۆردی سکرتێر"}</p>
      </div>
    </div>
  );

  const footer = (
    <div className="space-y-2 text-xs text-ink/40 leading-relaxed">
      <p>{state.settings.clinic_address}</p>
      <p className="flex items-center gap-1.5 font-mono" dir="ltr">
        <Phone size={12} className="shrink-0" /> {state.settings.clinic_phone}
      </p>
      <button onClick={handleReset} className="mt-2 flex items-center gap-1.5 text-primary hover:underline">
        <RotateCcw size={12} /> ڕیسێتکردنی دیمۆ
      </button>
    </div>
  );

  function navList(onNavigate: () => void) {
    return nav.map(({ href, label, icon: Icon }) => {
      const active = pathname === href;
      return (
        <Link
          key={href}
          href={href}
          onClick={onNavigate}
          className={clsx(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            active ? "bg-primary-50 text-primary font-semibold" : "text-ink/70 hover:bg-paper hover:text-ink"
          )}
        >
          <Icon size={18} className={active ? "text-primary" : "text-ink/40"} />
          {label}
        </Link>
      );
    });
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-l border-line bg-surface">
        <div className="px-6 py-6">{brand}</div>
        <nav className="flex-1 space-y-1 px-3">{navList(() => {})}</nav>
        <div className="px-6 py-5">{footer}</div>
      </aside>

      {/* Mobile: floating menu button, safe-area aware so it clears a
          phone's home-indicator */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="مینیو"
        className="fixed z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg md:hidden"
        style={{ bottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))", right: "1.25rem" }}
      >
        <Menu size={22} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col bg-surface shadow-xl"
            style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-5">
              {brand}
              <button onClick={() => setMobileOpen(false)} className="rounded-lg p-2 text-ink/50 hover:bg-paper" aria-label="داخستن">
                <X size={18} />
              </button>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">{navList(() => setMobileOpen(false))}</nav>
            <div className="border-t border-line px-5 py-4">{footer}</div>
          </div>
        </div>
      )}
    </>
  );
}

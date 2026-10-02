"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stethoscope, KeyRound, Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";

type Step = "device" | "login";

export default function LandingPage() {
  const router = useRouter();
  const { state, verifyDevice, login } = useStore();
  const [step, setStep] = useState<Step>("device");
  const [deviceKey, setDeviceKey] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("DOCTOR");

  function handleDeviceSubmit(e: React.FormEvent) {
    e.preventDefault();
    verifyDevice(deviceKey);
    setStep("login");
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    login(email || `${role.toLowerCase()}@demo.local`, password || "demo", role);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-paper px-4 py-10">
      <div className="mb-6 flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-xs font-medium text-primary">
        <Sparkles size={13} /> دیمۆی ئینتەراکتیڤ — بۆ نیشاندان، بەبێ داتای ڕاستی
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-card">
            <Stethoscope size={26} />
          </div>
          <h1 className="font-kufi text-xl font-bold text-ink">کلینیکی ڕۆژهەڵات</h1>
          <p className="mt-1 text-sm text-ink/50">سیستەمی بەڕێوەبردنی کلینیک</p>
        </div>

        {step === "device" ? (
          <form onSubmit={handleDeviceSubmit} className="space-y-4 rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <div className="mb-1 text-center">
              <p className="font-kufi text-sm font-semibold text-ink">چوونەژوورەوەی دیڤایس</p>
              <p className="mt-1 text-xs text-ink/40">لە سیستەمی ڕاستەقینەدا، تەنها کۆمپیوتەری کلینیک ڕێگەی پێدراوە</p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 focus-within:border-primary">
              <KeyRound size={16} className="text-ink/30" />
              <input
                value={deviceKey}
                onChange={(e) => setDeviceKey(e.target.value)}
                dir="ltr"
                autoFocus
                placeholder="هەر کۆدێک بنووسە (دیمۆیە)"
                className="w-full bg-transparent text-sm text-ink outline-none"
              />
            </div>
            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              پشکنین
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4 rounded-xl2 border border-line bg-surface p-6 shadow-card">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ڕۆڵ</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setRole("DOCTOR")} className={"rounded-lg border py-2.5 text-sm font-medium " + (role === "DOCTOR" ? "border-primary bg-primary text-white" : "border-line text-ink/60")}>
                  دکتۆر
                </button>
                <button type="button" onClick={() => setRole("SECRETARY")} className={"rounded-lg border py-2.5 text-sm font-medium " + (role === "SECRETARY" ? "border-primary bg-primary text-white" : "border-line text-ink/60")}>
                  سکرتێر
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">ئیمەیل</label>
              <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 focus-within:border-primary">
                <Mail size={16} className="text-ink/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" placeholder="هەر ئیمەیلێک (دیمۆیە)" className="w-full bg-transparent text-sm text-ink outline-none" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink/60">وشەی نهێنی</label>
              <div className="flex items-center gap-2 rounded-lg border border-line px-3 py-2.5 focus-within:border-primary">
                <Lock size={16} className="text-ink/30" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} dir="ltr" placeholder="هەر وشەیەک (دیمۆیە)" className="w-full bg-transparent text-sm text-ink outline-none" />
              </div>
            </div>

            <button type="submit" className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
              چوونەژوورەوە بۆ {role === "DOCTOR" ? "داشبۆردی دکتۆر" : "داشبۆردی سکرتێر"}
            </button>
          </form>
        )}

        <Link
          href="/book"
          className="mt-4 flex items-center justify-center gap-2 rounded-xl2 border border-line bg-surface py-3 text-sm font-medium text-ink/70 shadow-card hover:border-primary hover:text-primary"
        >
          <ArrowLeft size={15} />
          یان بڕۆ بۆ پەڕەی نۆڕەگرتنی نەخۆش (بەبێ چوونەژوورەوە)
        </Link>
      </div>
    </div>
  );
}

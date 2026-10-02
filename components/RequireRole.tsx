"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShieldOff } from "lucide-react";
import { useStore } from "@/lib/store";
import { Role } from "@/lib/types";
import PageHeader from "./PageHeader";

/** Wraps an entire page and only renders it for the given roles — a demo
 * nicety to show off how the real system's role separation looks, since
 * there's no backend here to enforce it independently. */
export default function RequireRole({ allow, title, children }: { allow: Role[]; title: string; children: ReactNode }) {
  const { state } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!state.currentUser) router.replace("/");
  }, [state.currentUser, router]);

  if (!state.currentUser) return <div className="min-h-screen" />;

  if (!allow.includes(state.currentUser.role)) {
    return (
      <div>
        <PageHeader title={title} />
        <div className="flex flex-col items-center justify-center gap-3 p-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 text-danger">
            <ShieldOff size={22} />
          </div>
          <p className="font-kufi text-sm font-medium text-ink">ئەم بەشە بۆ ڕۆڵی تۆ بەردەست نییە</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

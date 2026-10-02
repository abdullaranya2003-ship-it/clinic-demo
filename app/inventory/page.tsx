"use client";

import { useState } from "react";
import { Search, Plus, Package, Users2, AlertTriangle, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { useStore } from "@/lib/store";
import RequireRole from "@/components/RequireRole";

export default function InventoryPage() {
  const { state, addInventoryItem, addStaffMember } = useStore();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"staff" | "inventory">("inventory");
  const [showAdd, setShowAdd] = useState(false);

  const [itemName, setItemName] = useState("");
  const [itemBatch, setItemBatch] = useState("");
  const [itemStock, setItemStock] = useState("");
  const [itemLowAt, setItemLowAt] = useState("10");

  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffPhone, setStaffPhone] = useState("");

  function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    addInventoryItem({ name: itemName, batchNumber: itemBatch || undefined, stockLevel: itemStock ? Number(itemStock) : 0, lowStockAt: itemLowAt ? Number(itemLowAt) : 10 });
    setItemName(""); setItemBatch(""); setItemStock(""); setItemLowAt("10");
    setShowAdd(false);
  }

  function handleAddStaff(e: React.FormEvent) {
    e.preventDefault();
    addStaffMember({ name: staffName, role: staffRole, phone: staffPhone || undefined });
    setStaffName(""); setStaffRole(""); setStaffPhone("");
    setShowAdd(false);
  }

  const lowStockCount = state.inventory.filter((i) => i.stockLevel <= i.lowStockAt).length;
  const filteredInventory = state.inventory.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
  const filteredStaff = state.staff.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <RequireRole allow={["DOCTOR"]} title="کارمەند و دەرمان">
    <div>
      <PageHeader title="کارمەند و دەرمان" back />

      <div className="space-y-5 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-line bg-surface p-1">
            <button onClick={() => { setTab("inventory"); setShowAdd(false); }} className={"flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-colors " + (tab === "inventory" ? "bg-primary text-white" : "text-ink/60 hover:bg-paper")}>
              <Package size={14} /> کۆگای دەرمان
            </button>
            <button onClick={() => { setTab("staff"); setShowAdd(false); }} className={"flex items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition-colors " + (tab === "staff" ? "bg-primary text-white" : "text-ink/60 hover:bg-paper")}>
              <Users2 size={14} /> کارمەندان
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2">
              <Search size={15} className="text-ink/30" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="گەڕان..." className="bg-transparent text-sm outline-none" />
            </div>
            <button onClick={() => setShowAdd((s) => !s)} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary-dark">
              <Plus size={14} /> زیادکردن
            </button>
          </div>
        </div>

        {showAdd && tab === "inventory" && (
          <Card>
            <form onSubmit={handleAddItem} className="grid gap-3 sm:grid-cols-4">
              <input required value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="ناوی دەرمان" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2" />
              <input value={itemBatch} onChange={(e) => setItemBatch(e.target.value)} placeholder="ژمارەی Batch" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary font-mono" />
              <input type="number" value={itemStock} onChange={(e) => setItemStock(e.target.value)} placeholder="کۆگا (دانە)" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary font-mono" />
              <div className="flex gap-2 sm:col-span-4">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm text-ink/60"><X size={13} /> پاشگەزبوونەوە</button>
              </div>
            </form>
          </Card>
        )}

        {showAdd && tab === "staff" && (
          <Card>
            <form onSubmit={handleAddStaff} className="grid gap-3 sm:grid-cols-4">
              <input required value={staffName} onChange={(e) => setStaffName(e.target.value)} placeholder="ناوی کارمەند" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary sm:col-span-2" />
              <input required value={staffRole} onChange={(e) => setStaffRole(e.target.value)} placeholder="پیشە (نەرس، پێشوازیکار...)" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary" />
              <input dir="ltr" value={staffPhone} onChange={(e) => setStaffPhone(e.target.value)} placeholder="مۆبایل" className="rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:border-primary font-mono" />
              <div className="flex gap-2 sm:col-span-4">
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">زیادکردن</button>
                <button type="button" onClick={() => setShowAdd(false)} className="flex items-center gap-1 rounded-lg border border-line px-4 py-2 text-sm text-ink/60"><X size={13} /> پاشگەزبوونەوە</button>
              </div>
            </form>
          </Card>
        )}

        {tab === "inventory" && lowStockCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl2 border border-accent/30 bg-accent-50 px-4 py-3 text-sm text-accent-dark">
            <AlertTriangle size={16} className="shrink-0" /> {lowStockCount} دەرمان کۆگاکەیان کەمە و پێویستیان بە پڕکردنەوەیە.
          </div>
        )}

        {tab === "inventory" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInventory.map((item) => {
              const low = item.stockLevel <= item.lowStockAt;
              return (
                <Card key={item.id} className={low ? "border-accent/40" : ""}>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary"><Package size={18} /></div>
                    {low && <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">کۆگای کەم</span>}
                  </div>
                  <p className="font-kufi text-sm font-semibold text-ink">{item.name}</p>
                  {item.batchNumber && <p className="mt-0.5 text-xs text-ink/40 font-mono">Batch: {item.batchNumber}</p>}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-ink/50">کۆگا</span>
                    <span className={"font-mono font-semibold " + (low ? "text-accent" : "text-ink")}>{item.stockLevel} دانە</span>
                  </div>
                </Card>
              );
            })}
            {filteredInventory.length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink/40">هیچ دەرمانێک نەدۆزرایەوە</p>}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStaff.map((member) => (
              <Card key={member.id}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 font-kufi font-semibold text-primary">{member.name[0]}</div>
                  <div className="min-w-0">
                    <p className="truncate font-kufi text-sm font-semibold text-ink">{member.name}</p>
                    <p className="text-xs text-ink/50">{member.role}</p>
                  </div>
                </div>
                {member.phone && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-mono text-xs text-ink/50" dir="ltr">{member.phone}</span>
                    <span className={"rounded-full px-2 py-0.5 text-[10px] font-medium " + (member.active ? "bg-success/10 text-success" : "bg-ink/5 text-ink/40")}>{member.active ? "چالاک" : "ناچالاک"}</span>
                  </div>
                )}
              </Card>
            ))}
            {filteredStaff.length === 0 && <p className="col-span-full py-10 text-center text-sm text-ink/40">هیچ کارمەندێک نەدۆزرایەوە</p>}
          </div>
        )}
      </div>
    </div>
    </RequireRole>
  );
}

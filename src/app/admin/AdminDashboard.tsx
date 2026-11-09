"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { STATUSES, type Inquiry, type InquiryStatus } from "@/lib/validation";
import { logout } from "./actions";

const statusMeta: Record<InquiryStatus, { label: string; cls: string }> = {
  new: { label: "New", cls: "bg-violet/15 text-violet-soft border-violet/40" },
  contacted: { label: "Contacted", cls: "bg-sky-400/10 text-sky-300 border-sky-400/30" },
  in_progress: { label: "In progress", cls: "bg-amber-400/10 text-amber-300 border-amber-400/30" },
  won: { label: "Won", cls: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" },
  lost: { label: "Lost", cls: "bg-zinc-400/10 text-zinc-400 border-zinc-400/30" },
};

function StatusBadge({ status }: { status: InquiryStatus }) {
  const m = statusMeta[status] ?? statusMeta.new;
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${m.cls}`}>{m.label}</span>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

function toCsv(rows: Inquiry[]) {
  const cols: (keyof Inquiry)[] = ["created_at", "status", "name", "company", "email", "phone", "project_name", "requirements", "budget", "timeline", "services", "notes"];
  const esc = (v: unknown) => {
    const s = Array.isArray(v) ? v.join("; ") : v == null ? "" : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  };
  return [cols.join(","), ...rows.map((r) => cols.map((c) => esc(r[c])).join(","))].join("\n");
}

export function AdminDashboard({ initial, loadError }: { initial: Inquiry[]; loadError: string | null }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<InquiryStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, startRefresh] = useTransition();

  useEffect(() => setRows(initial), [initial]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: rows.length };
    for (const s of STATUSES) c[s] = rows.filter((r) => r.status === s).length;
    return c;
  }, [rows]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!q) return true;
      return [r.name, r.company, r.email, r.phone, r.project_name, r.requirements].some((v) => v?.toLowerCase().includes(q));
    });
  }, [rows, query, filter]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  async function update(id: string, patch: Partial<Pick<Inquiry, "status" | "notes">>) {
    const before = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!res.ok) {
      setRows(before);
      alertError(res);
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    if (res.ok) {
      setRows((rs) => rs.filter((r) => r.id !== id));
      setSelectedId(null);
    } else alertError(res);
  }

  function alertError(res: Response) {
    if (res.status === 401) router.push("/admin/login");
    else console.error("Admin request failed", res.status);
  }

  function exportCsv() {
    const blob = new Blob([toCsv(visible)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `renderlane-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const stats = [
    { label: "Total inquiries", value: counts.all },
    { label: "New", value: counts.new, accent: true },
    { label: "In progress", value: (counts.contacted ?? 0) + (counts.in_progress ?? 0) },
    { label: "Won", value: counts.won },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LogoMark className="h-8 w-auto text-paper" />
          <div>
            <h1 className="font-display text-xl uppercase tracking-[0.15em]">Inquiries</h1>
            <p className="text-xs text-mist">Everyone who asked about a project</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => startRefresh(() => router.refresh())}
            className="rounded-full border border-line px-4 py-2 text-sm text-mist hover:border-paper/40 hover:text-paper"
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" onClick={exportCsv} className="rounded-full border border-line px-4 py-2 text-sm text-mist hover:border-paper/40 hover:text-paper">
            Export CSV
          </button>
          <form action={logout}>
            <button type="submit" className="rounded-full bg-paper px-4 py-2 text-sm text-ink hover:bg-violet hover:text-paper">
              Log out
            </button>
          </form>
        </div>
      </header>

      {loadError && (
        <div role="alert" className="mt-6 rounded-2xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-300">
          <strong className="font-medium">Couldn&apos;t load inquiries:</strong> {loadError}
          <p className="mt-1 text-red-300/80">Check your Supabase keys in .env.local and that you ran supabase/schema.sql.</p>
        </div>
      )}

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Summary">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-line bg-ink-2 p-5">
            <p className="text-xs text-mist">{s.label}</p>
            <p className={`mt-2 font-display text-4xl font-light ${s.accent ? "text-violet" : ""}`}>{s.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by status">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={filter === s}
              onClick={() => setFilter(s)}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                filter === s ? "border-violet bg-violet text-paper" : "border-line text-mist hover:text-paper"
              }`}
            >
              {s === "all" ? "All" : statusMeta[s].label} <span className="opacity-60">{counts[s] ?? 0}</span>
            </button>
          ))}
        </div>
        <label className="relative md:w-80">
          <span className="sr-only">Search inquiries</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, company, email…" className="field !rounded-full !py-2.5" />
        </label>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-line">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 p-16 text-center">
            <LogoMark className="h-10 w-auto text-line" title="" />
            <p className="text-mist">{rows.length === 0 ? "No inquiries yet. They will appear here as soon as someone sends the form." : "No inquiries match your search."}</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="hidden bg-ink-2 text-xs uppercase tracking-wider text-mist md:table-header-group">
              <tr>
                <th className="px-5 py-3 font-normal">Client</th>
                <th className="px-5 py-3 font-normal">Project</th>
                <th className="px-5 py-3 font-normal">Contact</th>
                <th className="px-5 py-3 font-normal">Received</th>
                <th className="px-5 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {visible.map((r) => (
                <tr
                  key={r.id}
                  tabIndex={0}
                  onClick={() => setSelectedId(r.id)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setSelectedId(r.id))}
                  className="grid cursor-pointer grid-cols-[1fr_auto] gap-1 px-5 py-4 transition-colors hover:bg-ink-2 focus:bg-ink-2 focus:outline-none md:table-row md:px-0 md:py-0"
                >
                  <td className="md:px-5 md:py-4">
                    <div className="flex items-center gap-2">
                      {r.status === "new" && <span className="h-2 w-2 rounded-full bg-violet" aria-label="new" />}
                      <span className="font-medium text-paper">{r.name}</span>
                    </div>
                    <div className="text-xs text-mist">{r.company || "—"}</div>
                  </td>
                  <td className="col-span-2 row-start-2 text-paper/90 md:px-5 md:py-4">
                    <div className="line-clamp-1">{r.project_name}</div>
                    <div className="line-clamp-1 text-xs text-mist">{r.requirements}</div>
                  </td>
                  <td className="hidden md:table-cell md:px-5 md:py-4">
                    <div className="text-paper/90">{r.email}</div>
                    <div className="text-xs text-mist">{r.phone}</div>
                  </td>
                  <td className="hidden whitespace-nowrap text-mist md:table-cell md:px-5 md:py-4">{formatDate(r.created_at)}</td>
                  <td className="row-start-1 text-right md:px-5 md:py-4 md:text-left">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <AnimatePresence>
        {selected && (
          <DetailDrawer
            key={selected.id}
            inquiry={selected}
            onClose={() => setSelectedId(null)}
            onStatus={(status) => update(selected.id, { status })}
            onNotes={(notes) => update(selected.id, { notes })}
            onDelete={() => remove(selected.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailDrawer({
  inquiry: r,
  onClose,
  onStatus,
  onNotes,
  onDelete,
}: {
  inquiry: Inquiry;
  onClose: () => void;
  onStatus: (s: InquiryStatus) => void;
  onNotes: (n: string) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState(r.notes ?? "");
  const [confirming, setConfirming] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const wa = `https://wa.me/${r.phone.replace(/\D/g, "")}`;

  return (
    <>
      <motion.div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        role="dialog"
        aria-modal="true"
        aria-label={`Inquiry from ${r.name}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col overflow-y-auto border-l border-line bg-ink-2"
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-6">
          <div>
            <p className="font-mono text-xs text-mist">{formatDate(r.created_at)}</p>
            <h2 className="mt-1 font-display text-3xl font-light">{r.name}</h2>
            <p className="text-mist">{r.company || "No company given"}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-paper/40">
            <Icon name="plus" className="h-4 w-4 rotate-45" />
          </button>
        </div>

        <div className="flex flex-col gap-6 p-6">
          <div className="flex flex-wrap gap-2">
            <a href={`mailto:${r.email}?subject=${encodeURIComponent(`Your project: ${r.project_name}`)}`} className="inline-flex items-center gap-2 rounded-full bg-violet px-4 py-2 text-sm text-paper hover:bg-paper hover:text-ink">
              <Icon name="mail" className="h-4 w-4" /> Email
            </a>
            <a href={wa} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-paper/40">
              <Icon name="phone" className="h-4 w-4" /> WhatsApp
            </a>
            <a href={`tel:${r.phone}`} className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-paper/40">
              Call
            </a>
            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(r.email);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1500);
                } catch {}
              }}
              className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm hover:border-paper/40"
            >
              {copied ? "Copied!" : "Copy email"}
            </button>
          </div>

          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-sm">
            {[
              ["Email", r.email],
              ["Phone", r.phone],
              ["Budget", r.budget || "—"],
              ["Timeline", r.timeline || "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink p-4">
                <dt className="text-xs text-mist">{k}</dt>
                <dd className="mt-1 break-words text-paper">{v}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-mist">Project</h3>
            <p className="mt-2 font-display text-xl">{r.project_name}</p>
            {r.services && r.services.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {r.services.map((s) => (
                  <span key={s} className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs text-violet-soft">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-wider text-mist">Requirements</h3>
            <p className="mt-2 whitespace-pre-wrap rounded-2xl border border-line bg-ink p-4 leading-relaxed text-paper/90">{r.requirements}</p>
          </div>

          <div>
            <h3 className="mb-2 text-xs uppercase tracking-wider text-mist">Status</h3>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={r.status === s}
                  onClick={() => onStatus(s)}
                  className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                    r.status === s ? statusMeta[s].cls : "border-line text-mist hover:text-paper"
                  }`}
                >
                  {statusMeta[s].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-2 block text-xs uppercase tracking-wider text-mist">
              Internal notes
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Call summary, quote sent, follow-up date…"
              className="field min-h-[110px]"
            />
            <button
              type="button"
              disabled={notes === (r.notes ?? "")}
              onClick={() => onNotes(notes)}
              className="mt-2 rounded-full bg-paper px-4 py-2 text-sm text-ink hover:bg-violet hover:text-paper disabled:opacity-40"
            >
              Save notes
            </button>
          </div>

          <div className="mt-4 border-t border-line pt-6">
            {confirming ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-mist">Delete this inquiry for good?</span>
                <button type="button" onClick={onDelete} className="rounded-full bg-red-500 px-4 py-2 text-sm text-white">
                  Yes, delete
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="rounded-full border border-line px-4 py-2 text-sm">
                  Cancel
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-400 hover:underline">
                Delete inquiry
              </button>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

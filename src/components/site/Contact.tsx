"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Icon } from "@/components/ui/Icon";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { BUDGETS, SERVICES, TIMELINES, inquirySchema } from "@/lib/validation";

type Errors = Partial<Record<string, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const empty = {
  name: "",
  company: "",
  email: "",
  phone: "",
  project_name: "",
  requirements: "",
  budget: "",
  timeline: "",
  website: "",
};

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex items-center justify-between text-sm text-paper/90">
        <span>{label}</span>
        {optional && <span className="font-mono text-[11px] text-mist">optional</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
        active ? "border-violet bg-violet text-paper shadow-[0_0_24px_-6px_#7c5cff]" : "border-line text-mist hover:border-paper/40 hover:text-paper"
      }`}
    >
      {children}
    </button>
  );
}

export function Contact() {
  const [form, setForm] = useState(empty);
  const [services, setServices] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  const set = (key: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }));
  };

  const toggleService = (s: string) =>
    setServices((list) => (list.includes(s) ? list.filter((x) => x !== s) : [...list, s]));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    const payload = { ...form, services };
    const parsed = inquirySchema.safeParse(payload);
    if (!parsed.success) {
      const fe = parsed.error.flatten().fieldErrors;
      const next: Errors = {};
      for (const [k, v] of Object.entries(fe)) if (v?.[0]) next[k] = v[0];
      setErrors(next);
      const first = Object.keys(next)[0];
      if (first) document.getElementById(`f-${first}`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setStatus("sent");
      setForm(empty);
      setServices([]);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  const whatsapp = `https://wa.me/${site.phone.replace(/\D/g, "")}`;

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-violet/20 blur-[140px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 py-24 md:px-10 md:py-32 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionLabel index="06">Start a project</SectionLabel>
          <Reveal>
            <h2 className="font-display text-[clamp(2.6rem,6vw,5.2rem)] font-light uppercase leading-[0.92] tracking-tight">
              Let&apos;s build <br />
              something <span className="text-violet">unreal</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md text-mist">
              Tell us about your project. We reply within one business day with questions, ideas and next steps.
            </p>
          </Reveal>

          <Reveal delay={0.2} className="mt-10 flex flex-col gap-3">
            <a href={`mailto:${site.email}`} className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-violet">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-3 text-violet">
                <Icon name="mail" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-mist">Email</span>
                <span className="text-paper">{site.email}</span>
              </span>
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-line p-4 transition-colors hover:border-violet"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-3 text-violet">
                <Icon name="phone" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-mist">Call or WhatsApp</span>
                <span className="text-paper">{site.phone}</span>
              </span>
            </a>
            <div className="flex items-center gap-4 rounded-2xl border border-line p-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink-3 text-violet">
                <Icon name="pin" />
              </span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.15em] text-mist">Location</span>
                <span className="text-paper">{site.location}</span>
              </span>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative rounded-[28px] border border-line bg-ink-2/80 p-6 backdrop-blur md:p-10">
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[520px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <motion.div
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 160, damping: 14 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 -z-10 rounded-full bg-violet/40 blur-2xl" aria-hidden="true" />
                    <LogoMark className="h-20 w-auto text-violet" title="" />
                  </motion.div>
                  <h3 className="mt-8 font-display text-4xl font-light uppercase">Request received</h3>
                  <p className="mt-3 max-w-sm text-mist">
                    Thank you! We&apos;ll review your project and get back to you within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-8 rounded-full border border-line px-6 py-3 text-sm hover:border-violet"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-6">
                  {/* honeypot (hidden from people, bots fill it) */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={set("website")}
                    tabIndex={-1}
                    autoComplete="off"
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="f-name" label="Your name" error={errors.name}>
                      <input id="f-name" className="field" value={form.name} onChange={set("name")} autoComplete="name" placeholder="Jane Doe" aria-invalid={!!errors.name} />
                    </Field>
                    <Field id="f-company" label="Company name" error={errors.company} optional>
                      <input id="f-company" className="field" value={form.company} onChange={set("company")} autoComplete="organization" placeholder="Acme Inc." aria-invalid={!!errors.company} />
                    </Field>
                    <Field id="f-email" label="Email" error={errors.email}>
                      <input id="f-email" type="email" className="field" value={form.email} onChange={set("email")} autoComplete="email" placeholder="jane@company.com" aria-invalid={!!errors.email} />
                    </Field>
                    <Field id="f-phone" label="Phone / WhatsApp" error={errors.phone}>
                      <input id="f-phone" type="tel" className="field" value={form.phone} onChange={set("phone")} autoComplete="tel" placeholder="+20 100 000 0000" aria-invalid={!!errors.phone} />
                    </Field>
                  </div>

                  <Field id="f-project_name" label="Project name" error={errors.project_name}>
                    <input id="f-project_name" className="field" value={form.project_name} onChange={set("project_name")} placeholder="e.g. New website for our real estate launch" aria-invalid={!!errors.project_name} />
                  </Field>

                  <fieldset>
                    <legend className="mb-3 flex w-full items-center justify-between text-sm text-paper/90">
                      What do you need? <span className="font-mono text-[11px] text-mist">pick any</span>
                    </legend>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map((s) => (
                        <Pill key={s} active={services.includes(s)} onClick={() => toggleService(s)}>
                          {s}
                        </Pill>
                      ))}
                    </div>
                  </fieldset>

                  <Field id="f-requirements" label="Project requirements" error={errors.requirements}>
                    <textarea
                      id="f-requirements"
                      className="field min-h-[140px] resize-y"
                      value={form.requirements}
                      onChange={set("requirements")}
                      placeholder="Pages you need, features (3D, video, booking, payments…), websites you like, deadlines…"
                      aria-invalid={!!errors.requirements}
                    />
                  </Field>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <fieldset>
                      <legend className="mb-3 flex w-full items-center justify-between text-sm text-paper/90">
                        Budget <span className="font-mono text-[11px] text-mist">optional</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {BUDGETS.map((b) => (
                          <Pill key={b} active={form.budget === b} onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? "" : b }))}>
                            {b}
                          </Pill>
                        ))}
                      </div>
                    </fieldset>
                    <fieldset>
                      <legend className="mb-3 flex w-full items-center justify-between text-sm text-paper/90">
                        Timeline <span className="font-mono text-[11px] text-mist">optional</span>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {TIMELINES.map((t) => (
                          <Pill key={t} active={form.timeline === t} onClick={() => setForm((f) => ({ ...f, timeline: f.timeline === t ? "" : t }))}>
                            {t}
                          </Pill>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {serverError && (
                    <p role="alert" className="rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                      {serverError}
                    </p>
                  )}

                  <div className="flex flex-col items-start justify-between gap-4 pt-2 sm:flex-row sm:items-center">
                    <p className="text-xs text-mist">We only use your details to reply to this inquiry.</p>
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group inline-flex items-center gap-3 rounded-full bg-violet px-8 py-4 text-sm font-medium text-paper shadow-[0_0_40px_-8px_#7c5cff] transition-colors hover:bg-paper hover:text-ink disabled:cursor-wait disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-paper/30 border-t-paper" aria-hidden="true" />
                            Sending…
                          </>
                        ) : (
                          <>
                            Send inquiry
                            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

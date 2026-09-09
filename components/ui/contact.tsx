"use client";

import Image from "next/image";
import { useId, useState, type FormEvent, type FocusEvent, type ReactNode } from "react";
import { company, contact, contactPage } from "@/lib/content";
import { heroSequence } from "@/sections/Hero/hero.config";
import { Reveal } from "@/components/ui/Reveal";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { cn } from "@/lib/utils";

type FormState = "idle" | "submitting" | "success" | "error";

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof FormData, string>>;

const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-paper-dim";

function fieldClassName(hasError: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-void/50 px-4 text-sm text-paper placeholder:text-paper-faint",
    "transition-[border-color,background-color,box-shadow] duration-150 ease-out",
    "focus:bg-surface focus:outline-none focus:ring-2",
    hasError
      ? "border-signal focus:border-signal focus:ring-signal-dim"
      : "border-line focus:border-signal focus:ring-signal-dim",
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function SpinnerIcon() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7.5 12 13l8-5.5M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8.5 4.5h2l1.2 4.5-2 1.2a11 11 0 0 0 4.6 4.6l1.2-2 4.5 1.2v2A2.5 2.5 0 0 1 17 18.4 13.5 13.5 0 0 1 5.6 7 2.5 2.5 0 0 1 8.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 22s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ContactRow({
  href,
  label,
  value,
  icon,
}: {
  href?: string;
  label: string;
  value: string;
  icon: ReactNode;
}) {
  const inner = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface/60 text-signal-soft">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-paper-faint">
          {label}
        </span>
        <span className="mt-0.5 block font-display text-sm font-medium text-paper sm:text-base">
          {value}
        </span>
      </span>
      {href ? (
        <span
          className="shrink-0 font-mono text-sm text-paper-faint transition-[transform,color] duration-300 group-hover:translate-x-0.5 group-hover:text-signal-soft"
          aria-hidden="true"
        >
          →
        </span>
      ) : null}
    </>
  );

  const className =
    "group flex items-center gap-4 rounded-2xl border border-line/60 bg-surface/30 px-4 py-3.5 backdrop-blur-sm transition-all duration-300 hover:border-signal-soft/40 hover:bg-surface/50 sm:px-5 sm:py-4";

  if (href) {
    return (
      <li>
        <a href={href} className={className}>
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li>
      <div className={className}>{inner}</div>
    </li>
  );
}

function validateField(name: keyof FormData, value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return "This field is required.";
  if (name === "email" && !isValidEmail(trimmed)) return "Enter a valid email address.";
  return undefined;
}

export function ContactSection() {
  const statusId = useId();
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [state, setState] = useState<FormState>("idle");

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const key = name as keyof FormData;
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (touched[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const key = name as keyof FormData;
    setTouched((prev) => ({ ...prev, [key]: true }));
    setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, value) }));
  }

  function validateForm(): boolean {
    const nextErrors: FieldErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFieldErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    return !Object.values(nextErrors).some(Boolean);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    setState("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) throw new Error("Request failed");

      setState("success");
      setFormData({ name: "", email: "", message: "" });
      setFieldErrors({});
      setTouched({});
    } catch {
      setState("error");
    }
  }

  function resetForm() {
    setState("idle");
    setFormData({ name: "", email: "", message: "" });
    setFieldErrors({});
    setTouched({});
  }

  const liveMessage =
    state === "success"
      ? `${contactPage.form.successTitle} ${contactPage.form.successBody}`
      : state === "error"
        ? contactPage.form.errorBody
        : "";

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-void">
      <Image
        src={heroSequence.framePath(heroSequence.frameCount - 1)}
        alt=""
        fill
        priority
        aria-hidden="true"
        className="object-cover cta-media-opacity"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void via-void/88 to-void" />

      <div className="container-edge relative z-10 flex min-h-[100svh] items-center py-28 md:py-32">
        <div aria-live="polite" aria-atomic="true" id={statusId} className="sr-only">
          {liveMessage}
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,1fr)] lg:gap-14 xl:gap-20">
          <Reveal className="flex min-w-0 flex-col justify-center gap-10">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-signal-soft">
                {contactPage.eyebrow}
              </p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,5.4vw,4.25rem)] font-medium leading-[0.98] text-paper">
                <span className="block sm:whitespace-nowrap">{contactPage.headline[0]}</span>
                <span className="block text-signal sm:whitespace-nowrap">{contactPage.headline[1]}</span>
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-paper-dim">
                {company.shortName}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-paper-faint">
                {contactPage.directLabel}
              </p>
              <ul className="mt-4 space-y-3">
                <ContactRow
                  href={`mailto:${contact.email}`}
                  label="Email"
                  value={contact.email}
                  icon={<MailIcon />}
                />
                <ContactRow
                  href={`tel:${contact.phonePrimary}`}
                  label="Phone"
                  value={contact.phonePrimary}
                  icon={<PhoneIcon />}
                />
                <ContactRow
                  label="Location"
                  value={contactPage.locationLabel}
                  icon={<MapPinIcon />}
                />
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06} className="flex h-full w-full items-center">
            <div className="w-full rounded-2xl border border-line bg-surface/95 p-6 shadow-[0_20px_60px_-32px_rgba(10,14,23,0.14)] backdrop-blur-sm md:p-8 dark:bg-surface/90 dark:shadow-[0_24px_80px_-40px_rgba(0,0,0,0.55)]">
              {state === "success" ? (
                <div role="status">
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-signal-soft">
                    {contactPage.form.successTitle}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-paper-dim">
                    {contactPage.form.successBody}
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-paper-faint transition-colors hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-signal"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-name" className={labelClassName}>
                        {contactPage.form.nameLabel}
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        placeholder={contactPage.form.namePlaceholder}
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(fieldErrors.name) || undefined}
                        aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
                        className={fieldClassName(Boolean(fieldErrors.name))}
                      />
                      {fieldErrors.name ? (
                        <p id="contact-name-error" className="mt-1.5 text-[13px] text-signal">
                          {fieldErrors.name}
                        </p>
                      ) : null}
                    </div>
                    <div>
                      <label htmlFor="contact-email" className={labelClassName}>
                        {contactPage.form.emailLabel}
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={contactPage.form.emailPlaceholder}
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-invalid={Boolean(fieldErrors.email) || undefined}
                        aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
                        className={fieldClassName(Boolean(fieldErrors.email))}
                      />
                      {fieldErrors.email ? (
                        <p id="contact-email-error" className="mt-1.5 text-[13px] text-signal">
                          {fieldErrors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className={labelClassName}>
                      {contactPage.form.messageLabel}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      placeholder={contactPage.form.messagePlaceholder}
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      aria-invalid={Boolean(fieldErrors.message) || undefined}
                      aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
                      className={cn(
                        fieldClassName(Boolean(fieldErrors.message)),
                        "min-h-[120px] h-auto resize-y py-3.5",
                      )}
                    />
                    {fieldErrors.message ? (
                      <p id="contact-message-error" className="mt-1.5 text-[13px] text-signal">
                        {fieldErrors.message}
                      </p>
                    ) : null}
                  </div>

                  {state === "error" ? (
                    <p className="text-sm text-signal" role="alert">
                      {contactPage.form.errorBody}{" "}
                      <a
                        href={`mailto:${contact.email}`}
                        className="underline underline-offset-2 hover:text-signal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
                      >
                        {contact.email}
                      </a>
                    </p>
                  ) : null}

                  <MagneticButton
                    as="button"
                    type="submit"
                    disabled={state === "submitting"}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-signal text-sm font-semibold uppercase tracking-wide text-on-signal transition-[background-color,opacity,transform] duration-150 ease-out hover:bg-signal-soft active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === "submitting" ? (
                      <>
                        <SpinnerIcon />
                        {contactPage.form.submittingLabel}
                      </>
                    ) : (
                      contactPage.form.submitLabel
                    )}
                  </MagneticButton>

                  <p className="text-center text-xs leading-relaxed text-paper-faint">
                    {contactPage.form.privacyNote}
                  </p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

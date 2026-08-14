"use client";

import { useEffect, useState } from "react";
import { Dictionary } from "@/lib/i18n-dictionaries";

type Props = {
  dict: Dictionary;
  user: {
    name: string | null;
    phone: string | null;
    email: string | null;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
};

type Field = "email" | "phone";

type VerifyMsg = { text: string; kind: "ok" | "error" };

function verifyErrorText(dict: Dictionary, field: Field, json: { error?: string }) {
  switch (json.error) {
    case "no_email":
      return dict.account.errorNoEmail;
    case "no_phone":
      return dict.account.errorNoPhone;
    case "already_verified":
      return dict.account.errorAlreadyVerified;
    case "email_locked":
      return dict.account.errorEmailLocked;
    case "phone_locked":
      return dict.account.errorPhoneLocked;
    case "email_taken":
      return dict.account.errorEmailTaken;
    case "phone_taken":
      return dict.account.errorPhoneTaken;
    case "invalid_email":
      return dict.auth.errorInvalidEmail;
    case "invalid_phone":
      return dict.account.errorInvalidPhone;
    case "email_failed":
      return dict.auth.errorEmailFailed;
    default:
      return dict.account.errorSendFailed;
  }
}

function useVerification(field: Field, dict: Dictionary, initiallyVerified: boolean) {
  const [verified, setVerified] = useState(initiallyVerified);
  const [step, setStep] = useState<"idle" | "sent">("idle");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<VerifyMsg | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendCode = async (value: string) => {
    setMsg(null);
    setDevCode(null);
    setBusy(true);
    try {
      const res = await fetch("/api/account/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, value }),
      });
      const json = await res.json();
      if (!json.ok) {
        setMsg({ text: verifyErrorText(dict, field, json), kind: "error" });
        return;
      }
      setStep("sent");
      setCode("");
      setCooldown(Math.round(json.data?.cooldown ?? 60));
      if (json.data?.devCode) setDevCode(json.data.devCode);
    } catch {
      setMsg({ text: dict.account.errorSendFailed, kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async () => {
    setMsg(null);
    if (!/^[0-9]{5}$/.test(code)) {
      setMsg({ text: dict.account.errorInvalidCode, kind: "error" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/account/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field, code }),
      });
      const json = await res.json();
      if (!json.ok) {
        setMsg({
          text: json.error === "expired_code" ? dict.account.errorCodeExpired : dict.account.errorInvalidCode,
          kind: "error",
        });
        return;
      }
      setVerified(true);
      setStep("idle");
      setCode("");
      setDevCode(null);
      setMsg({
        text: field === "email" ? dict.account.emailVerifySuccess : dict.account.phoneVerifySuccess,
        kind: "ok",
      });
    } catch {
      setMsg({ text: dict.account.errorInvalidCode, kind: "error" });
    } finally {
      setBusy(false);
    }
  };

  return { verified, step, code, setCode, busy, msg, cooldown, devCode, sendCode, submitCode };
}

function Badge({ kind, label }: { kind: "ok" | "pending"; label: string }) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-[950] min-w-[118px] ${
        kind === "ok"
          ? "text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-soft-3)]"
          : "text-[var(--warning-text)] bg-[var(--warning-soft)] border border-[var(--warning-soft-2)]"
      }`}
    >
      {kind === "ok" ? (
        <svg viewBox="0 0 20 20" className="w-[14px] h-[14px]" fill="none">
          <circle cx="10" cy="10" r="9" fill="currentColor" />
          <path d="M6 10.2l2.6 2.6L14 7.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <span className="w-[14px] h-[14px] rounded-full flex items-center justify-center bg-current">
          <span className="text-[10px] leading-none font-black" style={{ color: "#fff" }}>
            !
          </span>
        </span>
      )}
      {label}
    </span>
  );
}

const FIELD_INPUT_CLASS =
  "w-full max-w-[340px] border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all disabled:opacity-60 disabled:bg-[var(--neutral-soft)] disabled:cursor-not-allowed";

function FieldBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[16px] border border-[var(--line-2)] bg-[var(--neutral-soft)] p-4 mt-2 max-w-[440px]">
      {children}
    </div>
  );
}

export default function ProfileForm({ dict, user }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [lastSavedName, setLastSavedName] = useState(user.name ?? "");
  const [nameBusy, setNameBusy] = useState(false);
  const [nameMsg, setNameMsg] = useState<VerifyMsg | null>(null);

  const [email, setEmail] = useState(user.email ?? "");
  const emailVer = useVerification("email", dict, !!user.emailVerified);
  const [phone, setPhone] = useState(user.phone ?? "");
  const phoneVer = useVerification("phone", dict, !!user.phoneVerified);

  const saveName = async () => {
    setNameMsg(null);
    setNameBusy(true);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const json = await res.json();
      if (!json.ok) {
        setNameMsg({ text: dict.account.errorSaveFailed, kind: "error" });
        return;
      }
      setLastSavedName(name);
      setNameMsg({ text: dict.account.saved, kind: "ok" });
    } catch {
      setNameMsg({ text: dict.account.errorSaveFailed, kind: "error" });
    } finally {
      setNameBusy(false);
    }
  };

  const nameDirty = name !== lastSavedName;

  const renderVerifyBox = (
    ver: ReturnType<typeof useVerification>,
    value: string,
    hint: string,
    devCodeHint: string,
  ) => (
    <FieldBox>
      {ver.step === "idle" ? (
        <button
          type="button"
          onClick={() => ver.sendCode(value)}
          disabled={ver.busy || !value.trim()}
          className="rounded-[12px] border border-[var(--primary)] text-[var(--primary)] font-[950] px-4 py-2.5 text-[13px] transition-all hover:bg-[var(--primary)]/5 disabled:opacity-60"
        >
          {ver.busy ? dict.common.loading : dict.account.sendCode}
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-[13px] font-[850] text-[var(--text-2)]">{hint}</p>
          {ver.devCode && (
            <p className="text-[12px] font-[900] text-[var(--muted-3)]" dir="ltr">
              {devCodeHint}: {ver.devCode}
            </p>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              maxLength={5}
              value={ver.code}
              onChange={(e) => ver.setCode(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder={dict.account.codePlaceholder}
              className="flex-1 border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[15px] font-[950] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all tracking-[0.4em] max-w-[150px]"
            />
            <button
              type="button"
              onClick={() => ver.submitCode()}
              disabled={ver.busy || ver.code.length !== 5}
              className="rounded-[12px] text-white font-[950] px-4 py-2.5 text-[13px] transition-all hover:-translate-y-0.5 disabled:opacity-60"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {ver.busy ? dict.common.loading : dict.account.confirmCode}
            </button>
          </div>
          <button
            type="button"
            onClick={() => ver.sendCode(value)}
            disabled={ver.busy || ver.cooldown > 0}
            className="text-[12.5px] font-[900] text-[var(--muted-3)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
          >
            {ver.cooldown > 0 ? `${dict.account.resend} (${ver.cooldown}s)` : dict.account.resend}
          </button>
        </div>
      )}
    </FieldBox>
  );

  const renderMsg = (msg: VerifyMsg | null) =>
    msg && (
      <p
        className={`mt-2 text-[13px] font-[850] rounded-[12px] px-3 py-2.5 max-w-[440px] ${
          msg.kind === "ok"
            ? "text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-soft-3)]"
            : "text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)]"
        }`}
      >
        {msg.text}
      </p>
    );

  return (
    <div className="mt-8 bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.05)] space-y-7">
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.account.profileTitle}</h2>

      <div>
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.name}</span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={dict.account.namePlaceholder}
            className={FIELD_INPUT_CLASS}
          />
          {nameDirty && (
            <button
              type="button"
              onClick={saveName}
              disabled={nameBusy}
              className="rounded-[12px] text-white font-[950] px-5 py-3 text-[13px] transition-all hover:-translate-y-0.5 disabled:opacity-60 shrink-0"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {nameBusy ? dict.common.loading : dict.account.save}
            </button>
          )}
        </div>
        {renderMsg(nameMsg)}
      </div>

      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.email}</span>
        </div>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="email"
            inputMode="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={emailVer.verified}
            className={FIELD_INPUT_CLASS}
          />
          <Badge
            kind={emailVer.verified ? "ok" : "pending"}
            label={emailVer.verified ? dict.account.verified : dict.account.notVerified}
          />
        </div>
        {emailVer.verified && (
          <p className="mt-2 text-[12px] font-[800] text-[var(--muted)]">{dict.account.lockHint}</p>
        )}
        {!emailVer.verified && renderVerifyBox(emailVer, email, dict.account.verifyEmailHint, "devCode")}
        {renderMsg(emailVer.msg)}
      </div>

      <div>
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.phone}</span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09123456789"
            disabled={phoneVer.verified}
            className={FIELD_INPUT_CLASS}
          />
          <Badge
            kind={phoneVer.verified ? "ok" : "pending"}
            label={phoneVer.verified ? dict.account.verified : dict.account.notVerified}
          />
        </div>
        {phoneVer.verified && (
          <p className="mt-2 text-[12px] font-[800] text-[var(--muted)]">{dict.account.lockHint}</p>
        )}
        {!phoneVer.verified && renderVerifyBox(phoneVer, phone, dict.account.verifyPhoneHint, "devCode")}
        {renderMsg(phoneVer.msg)}
      </div>
    </div>
  );
}

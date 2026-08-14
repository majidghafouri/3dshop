"use client";

import { useEffect, useState } from "react";
import { Dictionary } from "@/lib/i18n-dictionaries";

type Props = {
  dict: Dictionary;
  user: {
    name: string | null;
    phone: string | null;
    email: string | null;
    phoneVerified: boolean;
  };
};

function CheckBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[var(--success)]" dir="ltr">
      <svg viewBox="0 0 20 20" className="w-[16px] h-[16px]" fill="none">
        <circle cx="10" cy="10" r="9" fill="var(--success)" />
        <path d="M6 10.2l2.6 2.6L14 7.4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[12px] font-[900]">{label}</span>
    </span>
  );
}

export default function ProfileForm({ dict, user }: Props) {
  const [name, setName] = useState(user.name ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [verified, setVerified] = useState(!!user.phoneVerified);
  const [verifyStep, setVerifyStep] = useState<"idle" | "sent">("idle");
  const [code, setCode] = useState("");
  const [verifyBusy, setVerifyBusy] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ text: string; kind: "ok" | "error" } | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [devCode, setDevCode] = useState<string | null>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(
          json.error === "invalid_phone"
            ? dict.account.errorInvalidPhone
            : json.error === "phone_taken"
              ? dict.account.errorPhoneTaken
              : dict.account.errorSaveFailed,
        );
        return;
      }
      if (phone.trim() !== (user.phone ?? "")) setVerified(false);
      setSaved(true);
    } catch {
      setError(dict.account.errorSaveFailed);
    } finally {
      setBusy(false);
    }
  };

  const requestCode = async () => {
    setVerifyMsg(null);
    setDevCode(null);
    setVerifyBusy(true);
    try {
      const res = await fetch("/api/account/send-mobile-otp", { method: "POST" });
      const json = await res.json();
      if (!json.ok) {
        setVerifyMsg({
          text:
            json.error === "no_phone"
              ? dict.account.errorNoPhone
              : json.error === "already_verified"
                ? dict.account.errorAlreadyVerified
                : json.error === "sms_failed"
                  ? dict.account.errorSendFailed
                  : dict.account.errorSendFailed,
          kind: "error",
        });
        return;
      }
      setVerifyStep("sent");
      setCooldown(Math.round(json.data?.cooldown ?? 60));
      if (json.data?.devCode) setDevCode(json.data.devCode);
    } catch {
      setVerifyMsg({ text: dict.account.errorSendFailed, kind: "error" });
    } finally {
      setVerifyBusy(false);
    }
  };

  const submitCode = async () => {
    setVerifyMsg(null);
    if (!/^[0-9]{5}$/.test(code)) {
      setVerifyMsg({ text: dict.account.errorInvalidCode, kind: "error" });
      return;
    }
    setVerifyBusy(true);
    try {
      const res = await fetch("/api/account/verify-mobile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const json = await res.json();
      if (!json.ok) {
        setVerifyMsg({
          text:
            json.error === "expired_code"
              ? dict.account.errorCodeExpired
              : dict.account.errorInvalidCode,
          kind: "error",
        });
        return;
      }
      setVerified(true);
      setVerifyStep("idle");
      setCode("");
      setDevCode(null);
      setVerifyMsg({ text: dict.account.phoneVerifySuccess, kind: "ok" });
    } catch {
      setVerifyMsg({ text: dict.account.errorInvalidCode, kind: "error" });
    } finally {
      setVerifyBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 shadow-[0_12px_36px_rgba(20,45,90,0.05)] space-y-4">
      <h2 className="text-[18px] font-[1000] text-[var(--text)]">{dict.account.profileTitle}</h2>

      {user.email && (
        <div>
          <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.email}</span>
          <p className="mt-1.5 flex items-center gap-2 text-[14px] font-[900] text-[var(--text)]" dir="ltr">
            {user.email}
            <CheckBadge label={dict.account.phoneVerified} />
          </p>
        </div>
      )}

      <label className="block">
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.name}</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.account.namePlaceholder}
          className="mt-2 w-full border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
        />
      </label>

      <label className="block">
        <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.account.phone}</span>
        <div className="mt-2 flex items-center gap-3">
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            value={phone}
            onChange={(e) => {
              const v = e.target.value;
              setPhone(v);
              if (v.trim() !== (user.phone ?? "")) setVerified(false);
            }}
            placeholder="09123456789"
            className="w-full border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
          />
          {verified && <CheckBadge label={dict.account.phoneVerified} />}
        </div>
      </label>

      {!verified && user.phone && (
        <div className="rounded-[16px] border border-[var(--line-2)] bg-[var(--neutral-soft)] p-4">
          {verifyStep === "idle" ? (
            <div className="space-y-2">
              <p className="text-[13px] font-[850] text-[var(--text-2)]">{dict.account.verifyPhoneHint}</p>
              <button
                type="button"
                onClick={requestCode}
                disabled={verifyBusy}
                className="rounded-[12px] border border-[var(--primary)] text-[var(--primary)] font-[950] px-4 py-2.5 text-[13px] transition-all hover:bg-[var(--primary)]/5 disabled:opacity-60"
              >
                {verifyBusy ? dict.common.loading : dict.account.sendCode}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[13px] font-[850] text-[var(--text-2)]">{dict.account.verifyPhoneHint}</p>
              {devCode && (
                <p className="text-[12px] font-[900] text-[var(--muted-3)]" dir="ltr">
                  devCode: {devCode}
                </p>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  dir="ltr"
                  maxLength={5}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder={dict.account.codePlaceholder}
                  className="flex-1 border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[15px] font-[950] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all tracking-[0.4em]"
                />
                <button
                  type="button"
                  onClick={submitCode}
                  disabled={verifyBusy || code.length !== 5}
                  className="rounded-[12px] text-white font-[950] px-4 py-2.5 text-[13px] transition-all hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
                >
                  {verifyBusy ? dict.common.loading : dict.account.confirmCode}
                </button>
              </div>
              <button
                type="button"
                onClick={requestCode}
                disabled={verifyBusy || cooldown > 0}
                className="text-[12.5px] font-[900] text-[var(--muted-3)] hover:text-[var(--primary)] transition-colors disabled:opacity-50"
              >
                {cooldown > 0 ? `${dict.account.resend} (${cooldown}s)` : dict.account.resend}
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-[13px] font-[850] text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-soft-3)] rounded-[12px] px-3 py-2.5">
          {dict.account.saved}
        </p>
      )}
      {verifyMsg && (
        <p className={`text-[13px] font-[850] rounded-[12px] px-3 py-2.5 ${verifyMsg.kind === "ok" ? "text-[var(--success)] bg-[var(--success-soft)] border border-[var(--success-soft-3)]" : "text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)]"}`}>
          {verifyMsg.text}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-[16px] text-white font-[950] py-3.5 text-[15px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60"
        style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
      >
        {busy ? dict.common.loading : dict.account.saveProfile}
      </button>
    </form>
  );
}

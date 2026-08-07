"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dictionary } from "@/lib/i18n-dictionaries";

export default function AuthForm({ dict }: { dict: Dictionary }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState<string[]>(Array(5).fill(""));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const validatePhone = (v: string) => /^09\d{9}$/.test(v.replace(/[^\d]/g, ""));

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const normalized = phone.replace(/[^\d]/g, "");
    if (!validatePhone(normalized)) {
      setError(dict.auth.errorInvalidPhone);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: normalized }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(dict.auth.errorSendFailed);
        return;
      }
      setStep("code");
      setDigits(Array(5).fill(""));
      if (json.data?.devCode) setDevCode(json.data.devCode);
      setCooldown(60);
      setTimeout(() => inputsRef.current[0]?.focus(), 50);
    } catch {
      setError(dict.auth.errorSendFailed);
    } finally {
      setBusy(false);
    }
  };

  const handleDigit = (i: number, value: string) => {
    const v = value.replace(/[^\d]/g, "").slice(-1);
    if (!v) return;
    const next = [...digits];
    next[i] = v;
    setDigits(next);
    if (i < 4) inputsRef.current[i + 1]?.focus();
    else inputsRef.current[i]?.blur();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputsRef.current[i - 1]?.focus();
    }
  };

  const verify = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const value = digits.join("");
    if (value.length !== 5) {
      setError(dict.auth.errorInvalidCode);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.replace(/[^\d]/g, ""), code: value }),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(
          json.error === "expired_code"
            ? dict.auth.errorExpiredCode
            : dict.auth.errorInvalidCode
        );
        return;
      }
      const next = searchParams.get("next");
      router.push(next ?? "/");
      router.refresh();
    } catch {
      setError(dict.auth.errorInvalidCode);
    } finally {
      setBusy(false);
    }
  };

  const resend = async () => {
    await sendCode();
  };

  return (
    <div className="mx-auto w-full max-w-[440px]">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-[28px] p-8 shadow-[0_18px_54px_rgba(20,45,90,0.10)]">
        <div className="text-center">
          <div className="mx-auto w-[64px] h-[64px] rounded-[20px] flex items-center justify-center text-white text-[26px] shadow-[0_12px_30px_rgba(var(--primary-rgb),0.35)]"
            style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--teal))" }}>
            {step === "phone" ? "📱" : "🔐"}
          </div>
          <h1 className="mt-4 text-[clamp(22px,2.6vw,30px)] font-[1000] text-[var(--text)]">
            {dict.auth.title}
          </h1>
          <p className="mt-2 text-[13.5px] font-[750] text-[var(--muted)]">{dict.auth.subtitle}</p>
        </div>

        {step === "phone" ? (
          <form onSubmit={sendCode} className="mt-7 space-y-4">
            <label className="block">
              <span className="text-[12.5px] font-[900] text-[var(--text-2)]">{dict.auth.phonePlaceholder}</span>
              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09123456789"
                className="mt-2 w-full border border-[var(--line-2)] rounded-[16px] px-4 py-3.5 text-[15px] font-[850] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
              />
            </label>
            {error && (
              <p className="text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[16px] text-white font-[950] py-4 text-[15px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 shadow-[0_14px_34px_rgba(var(--primary-rgb),0.25)]"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {busy ? dict.common.loading : dict.auth.sendCode}
            </button>
            <p className="text-[12px] leading-[1.9] font-[750] text-[var(--muted)] text-center">
              {dict.auth.demoNote}
            </p>
          </form>
        ) : (
          <form onSubmit={verify} className="mt-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-[850] text-[var(--text-2)]" dir="ltr">
                {phone.replace(/[^\d]/g, "")}
              </span>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-[12.5px] font-[900] text-[var(--primary)] hover:underline"
              >
                {dict.auth.changePhone}
              </button>
            </div>

            <div className="flex justify-center gap-2" dir="ltr">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(i, e.target.value)}
                  onKeyDown={(e) => handleKey(i, e)}
                  className="w-[52px] h-[60px] text-center border border-[var(--line-2)] rounded-[14px] text-[22px] font-[1000] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all"
                />
              ))}
            </div>

            {devCode && (
              <p className="text-center text-[12.5px] font-[900] text-[var(--sky)] bg-[var(--soft)] border border-[var(--line-4)] rounded-[12px] px-3 py-2.5" dir="ltr">
                DEV CODE: {devCode}
              </p>
            )}

            {error && (
              <p className="text-[13px] font-[850] text-[var(--danger)] bg-[var(--danger-softer)] border border-[var(--danger-soft)] rounded-[12px] px-3 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || digits.some((d) => !d)}
              className="w-full rounded-[16px] text-white font-[950] py-4 text-[15px] transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 shadow-[0_14px_34px_rgba(var(--primary-rgb),0.25)]"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {busy ? dict.common.loading : dict.auth.verifyCode}
            </button>

            <div className="text-center">
              {cooldown > 0 ? (
                <span className="text-[12.5px] font-[850] text-[var(--muted)]">
                  {dict.auth.resendIn} {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={resend}
                  className="text-[12.5px] font-[900] text-[var(--primary)] hover:underline"
                >
                  {dict.auth.resend}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

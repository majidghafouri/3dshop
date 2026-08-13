"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OtpChannelDict = {
  title: string;
  subtitle: string;
  advertise: string;
  advertiseDesc: string;
  service: string;
  serviceDesc: string;
  sender: string;
  senderPlaceholder: string;
  senderHint: string;
  current: string;
  save: string;
  saved: string;
  error: string;
};

const OTP_METHOD_KEY = "otp_method";
const KAVENEGAR_SENDER_KEY = "kavenegar_sender";

export default function OtpChannelManager({ dict }: { dict: OtpChannelDict }) {
  const router = useRouter();
  const [channel, setChannel] = useState<"SERVICE" | "ADVERTISE">("ADVERTISE");
  const [sender, setSender] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        const json = await res.json();
        if (json.ok) {
          const rows: { key: string; value: string }[] = json.data.settings ?? [];
          const method = rows.find((r) => r.key === OTP_METHOD_KEY)?.value;
          const snd = rows.find((r) => r.key === KAVENEGAR_SENDER_KEY)?.value;
          if (method === "SERVICE" || method === "ADVERTISE") setChannel(method);
          if (snd) setSender(snd);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 3500);
  };

  const save = async () => {
    setBusy(true);
    try {
      const calls = [
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: OTP_METHOD_KEY,
            value: channel,
            group: "otp",
            isSecret: false,
          }),
        }),
        fetch("/api/admin/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: KAVENEGAR_SENDER_KEY,
            value: sender.trim(),
            group: "otp",
            isSecret: false,
          }),
        }),
      ];
      const results = await Promise.all(calls.map((c) => c.then((r) => r.json())));
      if (results.every((r) => r.ok)) {
        showMsg("ok", dict.saved);
        router.refresh();
      } else {
        const err = results.find((r) => !r.ok)?.error ?? "unknown";
        showMsg("err", `${dict.error}: ${err}`);
      }
    } catch {
      showMsg("err", dict.error);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  const option = (
    key: "SERVICE" | "ADVERTISE",
    title: string,
    desc: string,
  ) => (
    <button
      type="button"
      onClick={() => setChannel(key)}
      className={`flex-1 text-right rounded-[16px] border-2 p-4 transition-all ${
        channel === key
          ? "border-[var(--primary)] bg-[var(--primary)]/5"
          : "border-[var(--line)] hover:border-[var(--line-2)]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`grid place-items-center w-4 h-4 rounded-full border-2 ${
            channel === key ? "border-[var(--primary)]" : "border-[var(--muted)]"
          }`}
        >
          {channel === key && (
            <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
          )}
        </span>
        <span className="text-[13.5px] font-[1000] text-[var(--text)]">{title}</span>
      </div>
      <p className="mt-2 text-[12px] font-[850] text-[var(--muted)] leading-relaxed">
        {desc}
      </p>
    </button>
  );

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[14px] font-[1000] text-[var(--text)]">{dict.title}</h3>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      {loading ? (
        <p className="mt-4 text-[13px] font-[850] text-[var(--muted)]">...</p>
      ) : (
        <>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {option("ADVERTISE", dict.advertise, dict.advertiseDesc)}
            {option("SERVICE", dict.service, dict.serviceDesc)}
          </div>

          <label className="block mt-4">
            <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.sender}</span>
            <input
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              placeholder={dict.senderPlaceholder}
              dir="ltr"
              className={`${inputCls} mt-1.5`}
            />
            <span className="mt-1.5 block text-[11.5px] font-[800] text-[var(--muted)]">
              {dict.senderHint}
            </span>
          </label>

          <div className="mt-3.5 flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={save}
              disabled={busy}
              className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
              style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
            >
              {busy ? "..." : dict.save}
            </button>
            <span className="text-[12px] font-[850] text-[var(--muted)]">
              {dict.current}:{" "}
              <span className="font-[950] text-[var(--primary)]">
                {channel === "ADVERTISE" ? dict.advertise : dict.service}
              </span>
            </span>
          </div>
        </>
      )}

      {msg && (
        <p
          className={`mt-3 text-[12.5px] font-[850] ${
            msg.kind === "ok" ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}

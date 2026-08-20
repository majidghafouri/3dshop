"use client";

import { useState } from "react";

type SendEmailDict = {
  title: string;
  subtitle: string;
  to: string;
  toPlaceholder: string;
  subject: string;
  subjectPlaceholder: string;
  body: string;
  bodyPlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  failed: string;
  template: string;
  templatePlaceholder: string;
  templates: Record<string, string>;
};

type Template = {
  subject: string;
  body: string;
};

const TEMPLATES: Record<string, Record<string, Template>> = {
  fa: {
    welcome: {
      subject: "خوش آمدید به فیگرفورج! 🎉",
      body: `با سلام و احترام،

از اینکه فیگرفورج را انتخاب کردید سپاسگزاریم. 🙏

ما اینجاییم تا بهترین تجربه خرید آنلاین را برای شما فراهم کنیم. اگر سوالی دارید، تیم پشتیبانی ما همیشه آماده کمک است.

با آرزوی بهترین‌ها،
تیم فیگرفورج

🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "سفارش شما با موفقیت ثبت شد ✅",
      body: `با سلام،

سفارش شما با موفقیت در سیستم ثبت شد.

برای پیگیری سفارش و اطلاع از وضعیت ارسال، می‌توانید به بخش «سفارش‌های من» در حساب کاربری خود مراجعه کنید.

اگر سوالی دارید، با ما تماس بگیرید.

با تشکر،
تیم فیگرفورج

🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 تخفیف ویژه فقط برای شما!",
      body: `با سلام،

یک پیشنهاد ویژه برای شما داریم!

به مناسبت [مناسبت]، از [درصد]% تخفیف ویژه روی تمام محصولات بهره‌مند شوید.

 فرصت محدود است، همین الان اقدام کنید!

🌐 https://figureforge.ir
با احترام،
تیم فیگرفورج`,
    },
    newsletter: {
      subject: "خبرنامه فیگرفورج 📰",
      body: `با سلام،

آخرین اخبار و به‌روزرسانی‌های فیگرفورج:

📦 محصولات جدید: [نام محصول]
🎯 ویژگی جدید: [توضیح ویژگی]
💡 نکته ماه: [نکته]

برای اطلاعات بیشتر به سایت ما سر بزنید:
🌐 https://figureforge.ir

با تشکر،
تیم فیگرفورج`,
    },
  },
  en: {
    welcome: {
      subject: "Welcome to FigureForge! 🎉",
      body: `Hello and welcome!

Thank you for choosing FigureForge. We're thrilled to have you with us.

Our team is here to provide you with the best online shopping experience. If you have any questions, don't hesitate to reach out.

Best regards,
The FigureForge Team

🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "Your Order Has Been Confirmed ✅",
      body: `Hello,

Your order has been successfully placed.

You can track your order and check delivery status from the "My Orders" section in your account.

If you have any questions, feel free to contact us.

Thank you,
The FigureForge Team

🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 Exclusive Discount Just for You!",
      body: `Hello,

We have a special offer just for you!

Enjoy [X]% off on all products for [Occasion].

Limited time only — shop now!

🌐 https://figureforge.ir
Best regards,
The FigureForge Team`,
    },
    newsletter: {
      subject: "FigureForge Newsletter 📰",
      body: `Hello,

Here are the latest updates from FigureForge:

📦 New Arrivals: [Product Name]
🎯 New Feature: [Feature Description]
💡 Tip of the Month: [Tip]

Visit our website for more information:
🌐 https://figureforge.ir

Thank you,
The FigureForge Team`,
    },
  },
  ar: {
    welcome: {
      subject: "مرحباً بكم في فيگرفورج! 🎉",
      body: `مرحباً وتحية طيبة،

شكراً لاختياركم فيگرفورج. يسعدنا انضمامكم إلينا.

فريقنا هنا لتقديم أفضل تجربة تسوق إلكتروني لك. إذا كان لديك أي أسئلة، لا تتردد في التواصل معنا.

مع أطيب التحيات،
فريق فيگرفورج

🌐 https://figureforge.ir`,
    },
    orderConfirmation: {
      subject: "تم تأكيد طلبك بنجاح ✅",
      body: `مرحباً،

تم تسجيل طلبك بنجاح في النظام.

يمكنك متابعة طلبك والاطلاع على حالة التوصيل من قسم "طلباتي" في حسابك الشخصي.

إذا كان لديك أي سؤال، اتصل بنا.

مع الشكر،
فريق فيگرفورج

🌐 https://figureforge.ir`,
    },
    promotion: {
      subject: "🔥 خصم حصري خصيصاً لك!",
      body: `مرحباً،

لدينا عرض خاص لك!

استمتع بخصم [X]% على جميع المنتجات بمناسبة [المناسبة].

الفترة محدودة — توقف الآن!

🌐 https://figureforge.ir
مع أطيب التحيات،
فريق فيگرفورج`,
    },
    newsletter: {
      subject: "نشرة فيگرفورج الإخبارية 📰",
      body: `مرحباً،

إليك آخر الأخبار والتحديثات من فيگرفورج:

📦 وصل حديثاً: [اسم المنتج]
🎯 ميزة جديدة: [وصف الميزة]
💡 نصيحة الشهر: [النصيحة]

قم بزيارة موقعنا لمزيد من المعلومات:
🌐 https://figureforge.ir

مع الشكر،
فريق فيگرفورج`,
    },
  },
};

export default function SendEmailCard({ dict }: { dict: SendEmailDict }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const showMsg = (kind: "ok" | "err", text: string) => {
    setMsg({ kind, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const applyTemplate = (key: string) => {
    if (key === "custom" || !key) {
      setSubject("");
      setBody("");
      return;
    }
    const tpl = TEMPLATES.fa[key] ?? TEMPLATES.en[key];
    if (tpl) {
      setSubject(tpl.subject);
      setBody(tpl.body);
    }
  };

  const send = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: to.trim() || undefined,
          subject: subject.trim() || undefined,
          body: body.trim(),
        }),
      });
      const json = await res.json();
      if (json.ok) {
        showMsg("ok", `${dict.sent} ${json.to}`);
      } else {
        showMsg("err", `${dict.failed}: ${json.error ?? json.detail ?? "unknown"}`);
      }
    } catch {
      showMsg("err", dict.failed);
    } finally {
      setBusy(false);
    }
  };

  const inputCls =
    "w-full border border-[var(--line-2)] rounded-[12px] px-3 py-2.5 text-[13px] font-[800] text-[var(--text)] outline-none focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--primary)]/10 transition-all";

  return (
    <div className="mt-5 bg-[var(--surface)] border border-[var(--line)] rounded-[20px] p-5">
      <h3 className="text-[14px] font-[1000] text-[var(--text)]">{dict.title}</h3>
      <p className="mt-1 text-[12.5px] font-[850] text-[var(--muted)]">{dict.subtitle}</p>

      <label className="block mt-4">
        <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.template}</span>
        <select
          onChange={(e) => applyTemplate(e.target.value)}
          defaultValue=""
          className={`${inputCls} mt-1.5 appearance-none cursor-pointer`}
        >
          <option value="" disabled>
            {dict.templatePlaceholder}
          </option>
          {Object.entries(dict.templates).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <label className="block">
          <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.to}</span>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder={dict.toPlaceholder}
            dir="ltr"
            className={`${inputCls} mt-1.5`}
          />
        </label>
        <label className="block">
          <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.subject}</span>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={dict.subjectPlaceholder}
            className={`${inputCls} mt-1.5`}
          />
        </label>
      </div>

      <label className="block mt-3.5">
        <span className="text-[12px] font-[900] text-[var(--text-2)]">{dict.body}</span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={dict.bodyPlaceholder}
          rows={10}
          className={`${inputCls} mt-1.5 resize-y`}
        />
      </label>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={send}
          disabled={busy || !body.trim()}
          className="rounded-[12px] text-white font-[950] px-6 py-2.5 text-[13px] shadow-[0_8px_20px_rgba(var(--primary-rgb),0.25)] disabled:opacity-50"
          style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky))" }}
        >
          {busy ? dict.sending : dict.send}
        </button>
      </div>

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

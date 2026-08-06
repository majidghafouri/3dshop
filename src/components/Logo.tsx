import { Locale } from "@/lib/i18n";

export default function Logo({ locale }: { locale: Locale }) {
  const word =
    locale === "fa" ? "فیگورایز" : locale === "ar" ? "فيجورايز" : "Figurize";
  return (
    <a
      href={locale === "fa" ? "/" : `/${locale}`}
      aria-label="Figurize"
      className="flex items-center gap-2.5 shrink-0 group"
    >
      <span className="relative flex items-center justify-center w-[44px] h-[44px] max-sm:w-[38px] max-sm:h-[38px] rounded-[15px] text-white overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-[0_10px_24px_rgba(52,84,209,0.3)]"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--primary), var(--sky) 55%, var(--teal))",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="7" y="4" width="10" height="16" rx="2.5" />
          <circle cx="12" cy="10" r="1.8" fill="white" stroke="none" />
          <path d="M12 11.8v3.2" strokeWidth="1.6" />
          <path d="M9.5 15h5" strokeWidth="1.6" />
        </svg>
      </span>
      <span className="text-[26px] max-sm:text-[22px] font-[1000] tracking-tight text-[var(--text)]">
        {word}
      </span>
    </a>
  );
}

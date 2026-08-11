import { Locale } from "@/lib/i18n";

export default function Logo({ locale }: { locale: Locale }) {
  const word =
    locale === "fa" ? "فیگرفورج" : locale === "ar" ? "فيجرفورج" : "Figureforge";
  return (
    <a
      href={locale === "fa" ? "/" : `/${locale}`}
      aria-label="Figureforge"
      className="flex items-center gap-2.5 shrink-0 group"
    >
      <span className="relative flex items-center justify-center w-[44px] h-[44px] max-sm:w-[38px] max-sm:h-[38px] rounded-[15px] text-white overflow-hidden transition-transform duration-300 group-hover:scale-105 shadow-[0_10px_24px_rgba(var(--primary-rgb),0.3)]"
        style={{
          backgroundImage: "linear-gradient(135deg, var(--primary), var(--sky) 55%, var(--teal))",
        }}
      >
        <img src="/logo-icon.svg" alt={word} className="w-[28px] h-[28px]" />
      </span>
      <span className="text-[26px] max-sm:text-[22px] font-[1000] tracking-tight text-[var(--text)]">
        {word}
      </span>
    </a>
  );
}

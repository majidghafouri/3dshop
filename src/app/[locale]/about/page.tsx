import { notFound } from "next/navigation";
import { Locale, isLocale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n-dictionaries";
import Reveal from "@/components/Reveal";

export default async function AboutPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="relative overflow-hidden py-[40px] max-sm:py-[28px]"
      style={{
        background:
          "radial-gradient(circle_at_12%_8%,rgba(var(--teal-rgb),0.10),transparent_30%), radial-gradient(circle_at_90%_14%,rgba(var(--primary-rgb),0.08),transparent_26%), linear-gradient(180deg,var(--bg),var(--bg-grad))",
      }}
    >
      <div className="container-page">
        <div className="text-center">
          <span className="inline-block bg-[var(--soft)] text-[var(--primary)] border border-[var(--line-4)] rounded-full px-4 py-1.5 text-[12px] font-[950]">
            {dict.about.kicker}
          </span>
          <h1 className="mt-4 text-[clamp(28px,4vw,44px)] font-[1000] text-[var(--text)]">{dict.about.title}</h1>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-center">
          <Reveal>
            <div className="relative">
              <div className="aspect-[4/3] rounded-[28px] product-img-bg border border-[var(--line)] overflow-hidden shadow-[0_20px_54px_rgba(20,45,90,0.12)]"
                style={{ backgroundImage: "linear-gradient(135deg,var(--primary),var(--sky),var(--teal))" }}
              >
                <img
                  src="/logo-icon.svg"
                  alt={dict.about.title}
                  className="absolute inset-0 w-full h-full object-contain p-12"
                  style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
                />
                <div className="absolute -bottom-4 -right-4 bg-[var(--surface)] rounded-[18px] px-5 py-3 shadow-[0_12px_32px_rgba(20,45,90,0.15)] border border-[var(--line)]">
                  <span className="text-[20px] font-[1000] text-[var(--primary)]">500+</span>
                  <p className="text-[11px] font-[850] text-[var(--muted)]">{dict.hero.statText}</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 text-[15px] leading-[2] font-[750] text-[var(--text-2)]">
              <p>{dict.about.p1}</p>
              <p>{dict.about.p2}</p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12">
          <Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {dict.about.values.map((v) => (
                <div key={v.title} className="bg-[var(--surface)] border border-[var(--line)] rounded-[24px] p-6 text-center hover:shadow-[0_18px_48px_rgba(20,45,90,0.10)] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-[58px] h-[58px] mx-auto rounded-[16px] flex items-center justify-center text-[26px] product-img-bg border border-[var(--soft-line)]">
                    {v.icon}
                  </div>
                  <h3 className="mt-4 text-[16px] font-[1000] text-[var(--text)]">{v.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-[1.8] font-[750] text-[var(--muted)]">{v.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Image from 'next/image';
import { PageContent } from '../../content/page.types';
import { PublicationIssue } from '../../content/policy/content-policy.types';
import { hasErrorRule, isUnverifiedReview } from '../../content/policy/content-policy';
import { WhatsAppIntent } from '@/lib/whatsapp/whatsapp.types';
import ServerCatalog from './ServerCatalog';

type SectionData = PageContent['sections'][number];

interface Props {
  readonly sections: PageContent['sections'];
  readonly issues: readonly PublicationIssue[];
  readonly whatsapp: {
    readonly intent: WhatsAppIntent;
    readonly pageContext: string;
    readonly serverBrand?: string;
  };
}

function strip(text: string) {
  return text.replace(/\*\*/g, '').replace(/\\-/g, '-').replace(/\\\\/g, '').trim();
}

function filterValid(items: readonly string[], issues: readonly PublicationIssue[]) {
  return items.filter(t => !hasErrorRule(t) && !isUnverifiedReview(t, issues));
}

function isTestimonial(text: string) {
  return text.startsWith('"') || text.startsWith('\\"');
}

// ── Sub-components ──────────────────────────────────────

function SectionHeading({ level, text, dark }: { level: 2 | 3 | 4 | null; text: string; dark: boolean }) {
  const color = dark ? 'text-on-ink' : 'text-on-paper';
  const t = strip(text);
  if (level === 4) return <h4 className={`text-lg md:text-xl font-bold ${color} mb-6`}>{t}</h4>;
  if (level === 3) return <h3 className={`text-xl md:text-2xl font-bold ${color} mb-6`}>{t}</h3>;
  return <h2 className={`text-2xl md:text-3xl font-bold ${color} mb-6`}>{t}</h2>;
}

function BulletCards({ bullets, dark }: { bullets: string[]; dark: boolean }) {
  const count = bullets.length;
  const cols =
    count === 2 ? 'sm:grid-cols-2' :
      count === 3 ? 'sm:grid-cols-3' :
        'sm:grid-cols-2 lg:grid-cols-4';

  return (
    <div className={`grid ${cols} gap-4 mt-6`}>
      {bullets.map((b, i) => {
        const text = strip(b);
        const sep = text.indexOf(' : ');
        const title = sep > -1 ? text.slice(0, sep) : text;
        const desc = sep > -1 ? text.slice(sep + 3) : '';
        return (
          <div
            key={i}
            className={`rounded-2xl border p-5 ${dark ? 'bg-ink border-ink-3' : 'bg-paper-2 border-paper-2 shadow-sm'
              }`}
          >
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-signal/10 text-signal text-[0.6rem] font-black mb-3"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p className={`font-semibold text-sm mb-1.5 ${dark ? 'text-on-ink' : 'text-on-paper'}`}>
              {title}
            </p>
            {desc && (
              <p className={`text-xs leading-relaxed ${dark ? 'text-dim-ink' : 'text-dim-paper'}`}>
                {desc}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TestimonialCard({ text }: { text: string }) {
  const t = strip(text);
  // "quote text." \- *Author, Role, Date*
  const match = t.match(/^"([\s\S]+?)"\s*[-–—]\s*\*?([\s\S]+?)\*?\s*$/);
  const quote = match?.[1]?.trim() ?? t.replace(/^"/, '').replace(/"[^"]*$/, '').trim();
  const attr = match?.[2]?.replace(/\*/g, '').trim() ?? null;

  return (
    <blockquote className="mt-10 bg-paper border-l-4 border-signal rounded-r-2xl p-8">
      <p className="text-3xl text-signal font-serif leading-none mb-3 select-none" aria-hidden="true">
        &ldquo;
      </p>
      <p className="text-base md:text-lg italic text-on-paper leading-relaxed">{quote}</p>
      {attr && (
        <footer className="mt-4 text-sm font-mono text-dim-paper">— {attr}</footer>
      )}
    </blockquote>
  );
}

function StatsBand() {
  const stats = [
    { value: '20 000+', label: 'chaînes incluses' },
    { value: '30', label: 'serveurs B2B' },
    { value: '60%', label: 'marge max revendeur' },
    { value: '100%', label: 'panel en français' },
  ];
  return (
    <div className="bg-ink border-y border-ink-3 py-14 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map(s => (
          <div key={s.label}>
            <div className="text-4xl md:text-5xl font-black text-on-ink tracking-tight">{s.value}</div>
            <div className="text-[0.65rem] font-mono text-dim-ink uppercase tracking-[0.1em] mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Payment Methods ──────────────────────────────────────

function PaymentMethods() {
  const methods = [
    { src: '/payments/Visa_Inc._logo_(2021–present).svg.webp', alt: 'Visa' },
    { src: '/payments/Mastercard_2019_logo.webp', alt: 'Mastercard' },
    { src: '/payments/Binance_logo.svg.webp', alt: 'Binance' },
    { src: '/payments/Revolut-Logo.webp', alt: 'Revolut' },
    { src: '/payments/main_image6345588f938e9.webp', alt: 'Paiement Sécurisé' },
  ];

  return (
    <section className="bg-paper py-12 px-4 border-t border-ink-3">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-xs uppercase tracking-widest text-dim-paper font-bold mb-8">
          Méthodes de paiement acceptées & 100% sécurisées
        </p>
        <div className="flex justify-center items-center gap-6 sm:gap-10 md:gap-12 flex-wrap">
          {methods.map(m => (
            <img 
              key={m.alt}
              src={m.src} 
              alt={m.alt} 
              style={{ height: '24px', width: 'auto', objectFit: 'contain' }}
              title={m.alt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Section 0 — intro: pull-quote + feature cards ───────

const INTRO_FEATURES: Array<{ title: string; desc: string; icon: React.ReactNode }> = [
  {
    icon: (
      <svg className="w-7 h-7 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Panel 100% français',
    desc: 'Interface et support exclusivement en français, conçue pour les revendeurs exigeants.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d="M5 12.5c0 .828.895 1.5 2 1.5s2-.672 2-1.5V6.5C9 5.672 8.105 5 7 5s-2 .672-2 1.5v6zm7-3c0 .828.895 1.5 2 1.5s2-.672 2-1.5V4.5c0-.828-.895-1.5-2-1.5s-2 .672-2 1.5v5zm-7 6.5h14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 20h18" strokeLinecap="round" />
      </svg>
    ),
    title: 'Infrastructure robuste',
    desc: 'Stabilité irréprochable pour vos clients finaux, même pendant les grands matches live.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-signal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: 'Marges maximisées',
    desc: 'Achetez en volume, maîtrisez votre coût de revient et augmentez vos bénéfices nets.',
  },
];

function IntroSection({ section, issues }: { section: SectionData; issues: readonly PublicationIssue[] }) {
  const paragraphs = filterValid(section.paragraphs, issues).map(strip);
  if (!paragraphs.length) return null;

  const text = paragraphs[0] ?? '';
  const firstDot = text.indexOf('. ');
  const pullQuote = firstDot > -1 ? text.slice(0, firstDot + 1) : text;

  return (
    <section className="scrolly-section bg-paper py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-xl md:text-2xl font-semibold text-on-paper leading-relaxed max-w-3xl pl-6 border-l-2 border-signal mb-12">
          {pullQuote}
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mb-10">
          {INTRO_FEATURES.map(f => (
            <div key={f.title} className="bg-paper-2 border border-paper-2 rounded-2xl p-6 shadow-sm">
              <div className="mb-4">{f.icon}</div>
              <h3 className="font-bold text-on-paper mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-dim-paper leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Full paragraph text preserved for SEO */}
        {paragraphs.map((p, i) => (
          <p key={i} className="text-dim-paper leading-relaxed mb-4 max-w-3xl text-sm">{p}</p>
        ))}
      </div>
    </section>
  );
}

// ── Generic section 1–N ──────────────────────────────────

function ContentBlock({
  section,
  issues,
  dark = false,
}: {
  section: SectionData;
  issues: readonly PublicationIssue[];
  dark?: boolean;
}) {
  const paragraphs = filterValid(section.paragraphs, issues).map(strip);
  const bullets = filterValid(section.bullets, issues);

  const regular = paragraphs.filter(p => !isTestimonial(p));
  const testimonials = paragraphs.filter(isTestimonial);

  const hasContent = section.heading || regular.length || bullets.length || testimonials.length;
  if (!hasContent) return null;

  const bg = dark ? 'bg-ink-2' : 'bg-paper';
  const textColor = dark ? 'text-dim-ink' : 'text-dim-paper';

  return (
    <section className={`${bg} py-16 px-4`}>
      <div className="max-w-6xl mx-auto">
        {section.heading && (
          <SectionHeading level={section.headingLevel} text={section.heading} dark={dark} />
        )}

        {regular.map((p, i) => (
          <p key={i} className={`${textColor} leading-relaxed mb-4 max-w-3xl`}>{p}</p>
        ))}

        {bullets.length > 0 && <BulletCards bullets={bullets} dark={dark} />}

        {testimonials.map((t, i) => <TestimonialCard key={i} text={t} />)}
      </div>
    </section>
  );
}

// ── Root export ──────────────────────────────────────────

export default function HomeSections({ sections, issues }: Props) {
  if (!sections?.length) return null;

  const [intro, ...rest] = sections;
  if (!intro) return null;

  return (
    <>
      <IntroSection section={intro} issues={issues} />
      <StatsBand />
      <ServerCatalog />
      <PaymentMethods />
      {rest.map((section, i) => (
        <ContentBlock key={i} section={section} issues={issues} dark={i % 2 === 0} />
      ))}
    </>
  );
}

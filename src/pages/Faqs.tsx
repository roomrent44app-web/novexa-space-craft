import { useState, type ReactNode } from "react";
import { faqHeroAvif, faqHeroWebp, faqCtaAvif, faqCtaWebp } from "@/data/images";
import { ArrowRight, Bell, Clock, IndianRupee, Laptop, Phone, Plus, ShieldCheck, Star, Users } from "lucide-react";
import { FAQS, orderLink } from "@/data/fiveam";
import { useSeo } from "@/hooks/useSeo";
import { useImagePreload } from "@/hooks/useImagePreload";

function Rays() {
  return <span className="p-rays" aria-hidden="true"><i /><i /><i /></span>;
}

const ChartFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="13" width="4.5" height="8" rx="1" /><rect x="9.75" y="8.5" width="4.5" height="12.5" rx="1" /><rect x="16.5" y="4" width="4.5" height="17" rx="1" />
  </svg>
);

const UsersFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="7" r="3.4" /><circle cx="5" cy="9" r="2.5" /><circle cx="19" cy="9" r="2.5" />
    <path d="M5.5 20c0-3.9 2.9-6.6 6.5-6.6s6.5 2.7 6.5 6.6z" /><path d="M.8 19c0-2.8 1.7-4.6 4.2-4.6.8 0 1.5.2 2.1.5A8.3 8.3 0 0 0 4.4 19z" /><path d="M23.2 19c0-2.8-1.7-4.6-4.2-4.6-.8 0-1.5.2-2.1.5a8.3 8.3 0 0 1 2.7 4.1z" />
  </svg>
);

const faqIcons: ReactNode[] = [
  <Phone fill="currentColor" strokeWidth={1.2} />,
  <Star fill="currentColor" strokeWidth={1.2} />,
  <IndianRupee strokeWidth={2.6} />,
  <Laptop strokeWidth={2.6} />,
  <Clock strokeWidth={2.4} />,
  <UsersFilled />,
];

/** Renders "**bold**" markers and "\n" line breaks from the shared FAQ copy. */
function RichText({ text }: { text: string }) {
  return <>{text.split("\n").map((line, li) => <span key={li} className="block">
    {line.split(/(\*\*[^*]+\*\*)/g).map((part, pi) => part.startsWith("**") ? <b key={pi}>{part.slice(2, -2)}</b> : part)}
  </span>)}</>;
}

const heroBenefits = [
  { Icon: () => <Users />, label: <>Live<br />Study Sessions</> },
  { Icon: () => <Bell />, label: <>Daily<br />Wake-Up Calls</> },
  { Icon: () => <ShieldCheck />, label: <>Safe &amp; Positive<br />Environment</> },
  { Icon: ChartFilled, label: <>Build<br />Consistency</> },
];

export default function Faqs() {
  useSeo({ title: "FAQs", description: "Answers about 5AM wake-up calls, study sessions, community access and payments.", path: "/faqs" });
  useImagePreload(faqHeroAvif);
  const [open, setOpen] = useState<boolean[]>(() => FAQS.map(() => true));
  const toggle = (i: number) => setOpen(o => o.map((v, j) => j === i ? !v : v));
  /** Clicking anywhere on a row (except its own controls) shows or hides that answer. */
  const onRow = (i: number) => (e: React.MouseEvent) => { if (!(e.target as HTMLElement).closest("button")) toggle(i); };

  return <div className="plans-page faq-page">
    <section className="fq-hero" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.78) 0%, hsl(var(--ink)/.55) 34%, hsl(var(--ink)/0) 58%), image-set(url("${faqHeroAvif}") type("image/avif"), url("${faqHeroWebp}") type("image/webp"))` }}>
      <div className="p-shell">
        <span className="p-eyebrow">Frequently Asked Questions</span>
        <h1><span className="l1">Got Questions?</span><span className="l2">We've Got You<Rays /></span></h1>
        <p>Find answers to everything about wake-up calls,<br />study sessions and our community.</p>
        <div className="fq-hero-benefits">
          {heroBenefits.map(({ Icon, label }, i) => <div key={i}><span><Icon /></span><b>{label}</b></div>)}
        </div>
      </div>
    </section>

    <section className="fq-list">
      <div className="p-shell">
        <div className="p-section-heading">
          <span className="p-eyebrow light">FAQs</span>
          <h2>Everything You Need to Know<Rays /></h2>
          <p>Quick answers to help you get started with 5AM.co.in</p>
        </div>
        <div className="fq-items">
          {FAQS.map((f, i) => <article className="fq-item" key={f.q} onClick={onRow(i)}>
            <span className="fq-ico" aria-hidden="true">{faqIcons[i] ?? <Star fill="currentColor" />}</span>
            <div className="fq-body">
              <h3><button type="button" className="fq-q-btn" aria-expanded={open[i]} aria-controls={`fq-ans-${i}`} onClick={() => toggle(i)}>{f.q}</button></h3>
              <div id={`fq-ans-${i}`} className="fq-ans" hidden={!open[i]}><p><RichText text={f.a} /></p></div>
            </div>
            <button type="button" className="fq-plus" aria-expanded={open[i]} aria-controls={`fq-ans-${i}`} aria-label={open[i] ? `Hide answer: ${f.q}` : `Show answer: ${f.q}`} onClick={() => toggle(i)}><Plus /></button>
          </article>)}
        </div>
      </div>
    </section>

    <section className="fq-cta" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.8) 0%, hsl(var(--ink)/.55) 40%, hsl(var(--ink)/0) 62%), image-set(url("${faqCtaAvif}") type("image/avif"), url("${faqCtaWebp}") type("image/webp"))` }}>
      <div className="p-shell">
        <span className="p-eyebrow">Still Have Questions?</span>
        <h2>We're Here to Help!<Rays /></h2>
        <p>Join thousands of students and start your 5AM journey today.</p>
        <Link className="fq-btn" to="/account?mode=signup">Register to Community <ArrowRight /></Link>
      </div>
    </section>
  </div>;
}

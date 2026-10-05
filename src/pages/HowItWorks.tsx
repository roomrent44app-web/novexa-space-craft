import { ArrowRight, Bell, CalendarDays, ShieldCheck, Users } from "lucide-react";
import { hiwHeroAvif, hiwHeroWebp, hiwCtaAvif, hiwCtaWebp } from "@/data/images";
import { Link } from "react-router-dom";
import { orderLink } from "@/data/fiveam";
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

const steps = [
  { n: 1, Icon: () => <CalendarDays fill="hsl(var(--primary) / .18)" />, title: "Choose Your Plan", text: <>Pick a weekly or monthly<br />plan that fits your routine.</> },
  { n: 2, Icon: () => <Bell fill="currentColor" />, title: "Get Daily Wake-Up Calls", text: <>Receive a wake-up call at<br />5 AM on your selected days.</> },
  { n: 3, Icon: () => <Users fill="currentColor" strokeWidth={1.6} />, title: "Join the Study Room", text: <>Attend live study sessions<br />and stay consistent with a<br />supportive community.</> },
];

export default function HowItWorks() {
  useSeo({ title: "How It Works", description: "Start your 5AM journey in three simple steps: choose a plan, get wake-up calls and join the study room.", path: "/how-it-works" });
  useImagePreload(hiwHeroAvif);

  return <div className="plans-page hiw-page">
    <section className="hw-hero" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.6) 0%, hsl(var(--ink)/.38) 38%, hsl(var(--ink)/0) 60%), image-set(url("${hiwHeroAvif}") type("image/avif"), url("${hiwHeroWebp}") type("image/webp"))` }}>
      <div className="p-shell">
        <span className="p-eyebrow">How It Works</span>
        <h1>
          <span className="l1">Your 5AM</span>
          <span className="l2">Journey<Rays /></span>
          <span className="l3">In 3 Simple Steps</span>
        </h1>
        <p>Choose your plan, get your wake-up calls, and<br />join a supportive community to stay consistent<br />and achieve your goals.</p>
      </div>
    </section>

    <section className="hw-process">
      <div className="p-shell">
        <div className="p-section-heading">
          <span className="p-eyebrow light">The Process</span>
          <h2>Get Started in <em>3 Simple Steps</em><Rays /></h2>
        </div>
        <div className="hw-steps">
          {steps.map(({ n, Icon, title, text }, i) => <div className="hw-step-wrap" key={n}>
            {i > 0 && <ArrowRight className="hw-arrow" aria-hidden="true" />}
            <article className="hw-step">
              <span className="hw-num">{n}</span>
              <span className="hw-ico"><Icon /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          </div>)}
        </div>
      </div>
    </section>

    <section className="hw-cta-wrap">
      <div className="hw-cta" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.72) 0%, hsl(var(--ink)/.5) 36%, hsl(var(--ink)/0) 62%), image-set(url("${hiwCtaAvif}") type("image/avif"), url("${hiwCtaWebp}") type("image/webp"))` }}>
        <span className="p-eyebrow">Let's Do This</span>
        <h2>Same Time.<br />Better You.<Rays /></h2>
        <p>Take the first step towards a focused<br />and more productive you.</p>
        <a className="hw-btn hw-btn-orange" href={orderLink("Community Registration")} target="_blank" rel="noreferrer">Register to Community <ArrowRight /></a>
        <Link className="hw-btn hw-btn-light" to="/plans">View Plans</Link>
        <div className="hw-cta-feats">
          <div><Users /><span>Supportive<br />Community</span></div>
          <div><ShieldCheck /><span>Safe &amp; Positive<br />Environment</span></div>
          <div><ChartFilled /><span>Build<br />Consistency</span></div>
        </div>
      </div>
    </section>
  </div>;
}

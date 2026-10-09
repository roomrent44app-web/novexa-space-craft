import { Bell, BookOpen, ChartLine, Check, HeartHandshake, MessageCircle, Shield, ShieldCheck, Sunrise, Users } from "lucide-react";
import { aboutHeroAvif, aboutHeroWebp, studentAvif, studentWebp } from "@/data/images";
import { orderLink } from "@/data/fiveam";
import { useSeo } from "@/hooks/useSeo";
import { useImagePreload } from "@/hooks/useImagePreload";

const Rays = () => <span className="p-rays" aria-hidden="true"><i /><i /><i /></span>;

const heroBenefits = [
  { icon: Users, label: <>Live Study<br />Sessions</> },
  { icon: Bell, label: <>Daily Wake-Up<br />Calls</> },
  { icon: Shield, label: <>Safe & Positive<br />Environment</> },
  { icon: ChartLine, label: <>Build<br />Consistency</> },
];

const values = [
  { icon: Sunrise, title: "Start With Purpose", text: "Every morning begins with intention, not snooze." },
  { icon: Users, title: "Study Together", text: "A room full of focused students keeps you going." },
  { icon: ShieldCheck, title: "Safe & Positive", text: "A respectful space built for real study." },
  { icon: HeartHandshake, title: "Real Support", text: "Wake-up calls and accountability, every single day." },
];

const checklist = [
  "Daily wake-up calls at 4:55 AM and 5:10 AM",
  "Live study sessions with students across India",
  "A safe, positive and distraction-free community",
];

export default function About() {
  useSeo({ title: "About", description: "Meet 5AM, the supportive early-morning study community helping students build consistency.", path: "/about" });
  useImagePreload(aboutHeroAvif);
  return (
    <div className="plans-page about-page">
      <section className="ab-hero" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.72), hsl(var(--ink)/.42) 45%, hsl(var(--ink)/.12) 70%), image-set(url("${aboutHeroAvif}") type("image/avif"), url("${aboutHeroWebp}") type("image/webp"))` }}>
        <div className="p-shell">
          <span className="p-eyebrow">About 5AM</span>
          <h1><span className="l1">Same Time.</span><span className="l2">Better You.<Rays /></span></h1>
          <p>We help students turn early mornings into focused study,<br />strong habits and a brighter future.</p>
          <div className="fq-hero-benefits">
            {heroBenefits.map(({ icon: Icon, label }) => (
              <div key={String(label)}><span><Icon /></span><b>{label}</b></div>
            ))}
          </div>
        </div>
      </section>

      <section className="ab-purpose">
        <div className="p-shell">
          <div className="ab-purpose-grid">
            <picture><source srcSet={studentAvif} type="image/avif" /><img src={studentWebp} width={900} height={600} loading="eager" decoding="async" alt="A 5AM community student studying at sunrise" className="ab-photo" /></picture>
            <div className="ab-purpose-body">
              <span className="p-eyebrow light">Our Purpose</span>
              <h2>Disciplined Students Build <em>Brighter Futures</em><Rays /></h2>
              <p>5AM.co.in brings students together before the day gets busy. With wake-up calls, live sessions and genuine accountability, we make it easier to start — and keep going.</p>
              <ul>
                {checklist.map((item) => (
                  <li key={item}><span><Check /></span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="ab-values">
        <div className="p-shell">
          <div className="p-section-heading">
            <span className="p-eyebrow light">Why 5AM</span>
            <h2>A Community That <em>Cares</em><Rays /></h2>
            <p>Simple support designed to help you become more consistent every day.</p>
          </div>
          <div className="ab-value-grid">
            {values.map(({ icon: Icon, title, text }) => (
              <article className="ab-value" key={title}>
                <span className="ab-value-ico"><Icon /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="fq-cta ab-cta" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.85), hsl(var(--ink)/.55) 45%, hsl(var(--ink)/.2) 75%), image-set(url("${aboutHeroAvif}") type("image/avif"), url("${aboutHeroWebp}") type("image/webp"))` }}>
        <div className="p-shell">
          <span className="p-eyebrow">Join the Community</span>
          <h2>Wake Up. Show Up. Grow.<Rays /></h2>
          <p>Your brighter future starts at 5 AM tomorrow morning.</p>
          <Link className="fq-btn" to="/account?mode=signup"><MessageCircle />Register to Community</Link>
        </div>
      </section>

      <section className="p-benefit-strip ab-strip">
        <div className="p-shell">
          {[
            { icon: Users, title: "Supportive Community", text: "Study with like-minded students" },
            { icon: Bell, title: "Daily Wake-Up Calls", text: "Never miss your 5 AM start" },
            { icon: BookOpen, title: "Live Study Sessions", text: "Focus together every morning" },
            { icon: ShieldCheck, title: "Safe & Positive", text: "A respectful study space" },
          ].map(({ icon: Icon, title, text }) => (
            <div className="p-benefit" key={title}>
              <span className="p-benefit-icon"><Icon /></span>
              <div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

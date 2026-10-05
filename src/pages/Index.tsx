import { useState } from "react";
import { heroAvif, heroWebp, communityAvif, communityWebp, ctaAvif, ctaWebp, priyaAvif, priyaWebp, ananyaAvif, ananyaWebp, rohitAvif, rohitWebp } from "@/data/images";
import { ArrowRight, Bell, BookOpen, CalendarDays, ClipboardList, Gift, HeartHandshake, ShieldCheck, Star, Users, Video, Zap } from "lucide-react";
import { MONTHLY_PLANS, orderLink, WEEKLY_PLANS } from "@/data/fiveam";
import { useSeo } from "@/hooks/useSeo";
import { useImagePreload } from "@/hooks/useImagePreload";
import { Link } from "react-router-dom";

const UsersFilled = () => <Users fill="currentColor" strokeWidth={1.6} />;
const ChartFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="3" y="14" width="4" height="7" rx="1" /><rect x="10" y="10" width="4" height="11" rx="1" /><rect x="17" y="6" width="4" height="15" rx="1" />
    <path d="M3 10.5 9 5.5l3.5 3L19 3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.5 2.6H20v4.4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  { Icon: Users, title: <>Live<br />Study Sessions</>, text: <>Study together<br />with a community</> },
  { Icon: Bell, title: <>Daily<br />Wake-Up Calls</>, text: <>Get a wakeup call<br />and never miss 5 AM</> },
  { Icon: ChartFilled, title: <>Stay Consistent</>, text: <>Track progress<br />and build habits</> },
  { Icon: UsersFilled, title: <>Supportive<br />Community</>, text: <>Surround yourself<br />with like-minded students</> },
  { Icon: BookOpen, title: <>Be a Better You</>, text: <>Daily motivation<br />and study support</> },
];

const stats = [["10K+", "Students Joined"], ["Daily", "Live Study Sessions"], ["High", "Consistency Rate"], ["100%", "Student Support"]];

const steps = [
  { Icon: ClipboardList, title: "Choose Your Plan", text: <>Pick a weekly or monthly plan<br />that suits you.</> },
  { Icon: Bell, title: "Get Daily Wake-Up Calls", text: <>Receive a wake-up call at 5 AM<br />on your selected days.</> },
  { Icon: UsersFilled, title: "Join the Study Community", text: <>Attend live study sessions and stay consistent with like-minded students.</> },
];

const stories = [
  { name: "Priya S.", role: "NEET Aspirant", quote: "5AM.co.in helped me build a study routine. Now I never miss my 5 AM ever again!", avif: priyaAvif, webp: priyaWebp },
  { name: "Ananya K.", role: "UPSC Aspirant", quote: "The wake-up calls and live study sessions keep me consistent and motivated.", avif: ananyaAvif, webp: ananyaWebp },
  { name: "Rohit M.", role: "JEE Aspirant", quote: "Such a supportive community! I feel more productive and focused every day.", avif: rohitAvif, webp: rohitWebp },
];

function Rays({ className = "" }: { className?: string }) {
  return <svg className={`h-rays ${className}`} viewBox="0 0 40 44" aria-hidden="true"><path d="M8 18 L30 4 M6 26 L36 24 M8 34 L30 42" /></svg>;
}
function Underline() {
  return <svg className="h-underline" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 8 Q60 1 117 6" /></svg>;
}
function Tag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={dark ? "h-tag h-tag-dark" : "h-tag"}>{children}</span>;
}

export default function Index() {
  useSeo({ title: "5AM Study Community", description: "Join India's 5AM study community for live study sessions, daily wake-up calls and consistent progress.", path: "/" });
  useImagePreload(heroAvif);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const plans = period === "weekly" ? WEEKLY_PLANS : MONTHLY_PLANS;

  return <div className="home">
    {/* HERO */}
    <section className="h-hero" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.92) 0%, hsl(var(--ink)/.72) 28%, hsl(var(--ink)/.15) 50%, hsl(var(--ink)/0) 62%), image-set(url("${heroAvif}") type("image/avif"), url("${heroWebp}") type("image/webp"))` }}>
      <div className="h-in">
        <Tag dark>Study Together at 5 AM</Tag>
        <h1 className="h-hero-title">JOIN THE<br />STUDY ROOM<br />AT <span className="h-5am">5AM</span><Rays className="h-hero-rays" /></h1>
        <p className="h-hero-tag">Same Time. Better You.</p>
        <p className="h-hero-text">Get daily wake-up calls, live study sessions and a supportive community to stay consistent in your study journey.</p>
        <div className="h-hero-btns">
          <a className="h-btn h-btn-orange h-btn-big" href={orderLink()} target="_blank" rel="noreferrer"><Video className="h-btn-ico" fill="currentColor" /><span>Join the Study Room<br />at 5 AM <ArrowRight /></span></a>
          <a className="h-btn h-btn-white h-btn-big" href={orderLink("Community Registration")} target="_blank" rel="noreferrer"><Users className="h-btn-ico" /><span>Register to<br />Community <ArrowRight /></span></a>
        </div>
        <div className="h-proof"><span><Users /> Students All Over India</span><span><ShieldCheck /> Safe &amp; Supportive</span><span><Zap /> Build Consistency</span></div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="h-features"><div className="h-in">
      {features.map((f, i) => <div className="h-feature" key={i}><span className="h-feature-ico"><f.Icon /></span><h3>{f.title}</h3><p>{f.text}</p></div>)}
    </div></section>

    {/* PLANS */}
    <section className="h-plans"><div className="h-in">
      <div className="h-center"><Tag>Our Plans</Tag></div>
      <h2 className="h-title h-center">Choose <span className="h-u">Your<Underline /></span> Plan<Rays className="h-title-rays" /></h2>
      <p className="h-sub">Stay consistent with daily wake-up calls and access to our study community.</p>
      <div className="h-tabs" role="tablist" aria-label="Plan period">
        <button role="tab" aria-selected={period === "weekly"} className={period === "weekly" ? "active" : ""} onClick={() => setPeriod("weekly")}>Weekly Plans</button>
        <button role="tab" aria-selected={period === "monthly"} className={period === "monthly" ? "active" : ""} onClick={() => setPeriod("monthly")}>Monthly Plans</button>
      </div>
      <div className={`h-cards ${plans.length === 3 ? "three" : ""}`}>
        {plans.map(p => <article key={p.days} className={p.freeTrial ? "h-card trial" : p.popular ? "h-card popular" : "h-card"}>
          {p.popular && <span className="h-badge"><Star fill="currentColor" /> Most Popular</span>}
          {p.freeTrial && <span className="h-badge trial"><Gift /> Free Trial</span>}
          <span className="h-card-ico">{p.freeTrial ? <Gift /> : p.popular ? <HeartHandshake /> : <CalendarDays />}</span>
          <h3>{p.days} Days</h3>
          <p>{p.calls} Wake-Up Calls</p>
          <strong>{p.freeTrial ? "Free" : `₹${p.price.toLocaleString("en-IN")}`}</strong>
          <Link className="h-btn h-btn-orange h-card-btn" to={p.freeTrial ? "/account?plan=trial-3d" : `/account?plan=${p.days}d-${p.price}`}>Get Started</Link>
        </article>)}
      </div>
    </div></section>

    {/* COMMUNITY */}
    <section className="h-community">
      <div className="h-community-img"><picture><source srcSet={communityAvif} type="image/avif" /><img src={communityWebp} alt="Disciplined students build brighter futures — student studying at sunrise" loading="eager" decoding="async" width={1264} height={848} /></picture></div>
      <div className="h-community-body">
        <Tag>A Community That Cares</Tag>
        <h2 className="h-title">More Than Just<br /><span className="h-comm-u">Wake-Up Calls<Underline /></span><Rays className="h-comm-rays" /></h2>
        <p className="h-comm-text">5AM.co.in is a platform where students from all over India come together to study, stay consistent and grow with a supportive community.</p>
        <div className="h-stats">{stats.map(([v, l]) => <div key={l}><strong>{v}</strong><span>{l}</span></div>)}</div>
      </div>
    </section>

    {/* STEPS */}
    <section className="h-steps"><div className="h-in">
      <div className="h-center"><Tag>How It Works</Tag></div>
      <h2 className="h-title h-center">Get Started <span className="h-u">in 3<Underline /></span> Simple Steps</h2>
      <div className="h-steps-grid">
        {steps.map((s, i) => <article key={s.title} className="h-step">
          <span className="h-step-num">{i + 1}</span>
          <div><span className="h-step-ico"><s.Icon /></span><h3>{s.title}</h3><p>{s.text}</p></div>
        </article>)}
      </div>
    </div></section>

    {/* STORIES */}
    <section className="h-stories"><div className="h-in">
      <Tag>What Our Students Say</Tag>
      <h2 className="h-title">Real <span className="h-u">Stories.<Underline /></span> Real Progress.<Rays className="h-title-rays" /></h2>
      <div className="h-story-grid">
        {stories.map(s => <article key={s.name} className="h-story">
          <picture><source srcSet={s.avif} type="image/avif" /><img src={s.webp} alt={`${s.name}, ${s.role}`} loading="eager" decoding="async" width={256} height={256} /></picture>
          <div>
            <p>“{s.quote}”</p>
            <div className="h-story-foot"><div><h3>{s.name}</h3><span>{s.role}</span></div><div className="h-stars">{[1, 2, 3, 4, 5].map(n => <Star key={n} fill="currentColor" />)}</div></div>
          </div>
        </article>)}
      </div>
    </div></section>

    {/* CTA */}
    <section className="h-cta" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.97) 0%, hsl(var(--ink)/.85) 35%, hsl(var(--ink)/.1) 62%, hsl(var(--ink)/0) 75%), image-set(url("${ctaAvif}") type("image/avif"), url("${ctaWebp}") type("image/webp"))` }}>
      <div className="h-in">
        <Tag dark>It's Time</Tag>
        <h2 className="h-cta-title">Join the Study Room<br /><span className="h-cta-l2">at <span className="h-5am">5AM</span><Rays className="h-cta-rays" /></span></h2>
        <p className="h-cta-text">Be part of a supportive community and take one step<br />towards a more focused and productive you.</p>
        <div className="h-cta-btns">
          <a className="h-btn h-btn-orange" href={orderLink()} target="_blank" rel="noreferrer"><Video fill="currentColor" /> Join the Study Room at 5 AM <ArrowRight /></a>
          <a className="h-btn h-btn-white" href={orderLink("Community Registration")} target="_blank" rel="noreferrer"><Users /> Register to Community <ArrowRight /></a>
        </div>
      </div>
    </section>
  </div>;
}

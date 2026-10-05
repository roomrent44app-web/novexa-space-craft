import { ArrowRight, Bell, BookOpen, CalendarDays, Check, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURES, MONTHLY_PLANS, orderLink, WEEKLY_PLANS } from "@/data/fiveam";
import hero from "@/assets/5am-hero.jpg";

const icons = { Users, Bell, Chart: TrendingUp, Shield: ShieldCheck, Book: BookOpen };

export function Eyebrow({children}:{children: React.ReactNode}) { return <p className="section-eyebrow">{children}</p>; }

export function Hero({ eyebrow, title, accent, text, compact=false, home=false }: { eyebrow:string; title:string; accent:string; text:string; compact?:boolean; home?:boolean }) {
  return <section className={`${compact ? "page-hero compact" : "page-hero"}${home ? " home-hero" : ""}`} style={{backgroundImage:`linear-gradient(90deg, hsl(var(--foreground)/.93) 0%, hsl(var(--foreground)/.63) 47%, hsl(var(--foreground)/.04) 100%), url(${hero})`}}>
    <div className="site-container relative z-10 py-16 md:py-24">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="hero-title mt-4">{title}<br/><span>{accent}</span></h1>
      {home && <p className="home-tagline">Same Time. Better You.</p>}
      <p className="mt-4 max-w-lg text-base leading-7 text-primary-foreground/90 md:text-lg">{text}</p>
      {!compact && <div className="mt-7 flex flex-wrap gap-3"><Button asChild size="lg"><a href={orderLink()} target="_blank" rel="noreferrer">Join the Study Room at 5 AM <ArrowRight /></a></Button><Button asChild size="lg" variant="secondary"><a href={orderLink("Community Registration")} target="_blank" rel="noreferrer"><Users /> Register to Community <ArrowRight /></a></Button></div>}
      <div className="home-proof mt-8 flex flex-wrap gap-6 text-xs font-bold text-primary-foreground/90"><span><Users /> Students All Over India</span><span><ShieldCheck /> Safe &amp; Supportive</span><span><TrendingUp /> Build Consistency</span></div>
    </div>
  </section>;
}

export function FeatureStrip({limit=5}:{limit?:number}) { return <section className="bg-background"><div className={limit === 4 ? "site-container grid py-6 sm:grid-cols-2 md:grid-cols-4" : "site-container grid py-6 sm:grid-cols-2 md:grid-cols-5"}>{FEATURES.slice(0,limit).map((f) => { const Icon=icons[f.icon as keyof typeof icons]; return <div key={f.title} className="feature-item"><span className="feature-icon"><Icon /></span><div><h3>{f.title}</h3><p>{f.text}</p></div></div>})}</div></section>; }

function PlanCard({plan}:{plan:{days:number;calls:number;price:number;popular?:boolean}}) { return <article className={plan.popular ? "plan-card popular" : "plan-card"}>{plan.popular && <span className="popular-label">★ Most Popular</span>}<span className="plan-icon"><CalendarDays /></span><h3>{plan.days} Days</h3><p>{plan.calls} Wake-Up Calls</p><strong>₹{plan.price.toLocaleString("en-IN")}</strong><Button asChild className="mt-4 w-full"><a href={orderLink(`${plan.days} Days Plan - ₹${plan.price}`)} target="_blank" rel="noreferrer">Get Started <ArrowRight /></a></Button></article>; }

export function PlansSection({full=false,home=false}:{full?:boolean;home?:boolean}) { const weekly=full?[{days:3,calls:3,price:149},{days:4,calls:4,price:199},{days:6,calls:6,price:249}]:WEEKLY_PLANS; return <section className={`section-cream py-16 md:py-20${home ? " home-plans" : ""}`}><div className="site-container text-center"><Eyebrow>{home ? "Our Plans" : "Choose Your Plan"}</Eyebrow><h2 className="section-title mt-2">{full ? "Weekly Plans" : "Choose Your Plan"}</h2><p className="section-subtitle">Stay consistent with daily wake-up calls and access to our study community.</p>{home&&<div className="plan-tabs" aria-label="Plan period"><span className="active">Weekly Plans</span><span>Monthly Plans</span></div>}<div className={weekly.length===4?"mt-8 grid gap-4 md:grid-cols-4":"mt-8 grid gap-4 md:grid-cols-3"}>{weekly.map(p=><PlanCard key={p.days} plan={p}/>)}</div>{full&&<><h2 className="section-title mt-12">Monthly Plans</h2><p className="section-subtitle">Stay consistent for longer and make real progress.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{MONTHLY_PLANS.map(p=><PlanCard key={p.days} plan={p}/>)}</div></>}</div></section>; }

export function Steps({home=false}:{home?:boolean}) { const steps=[{icon:CalendarDays,title:"Choose Your Plan",text:"Pick a weekly or monthly plan that suits you."},{icon:Bell,title:"Get Daily Wake-Up Calls",text:"Receive a wake-up call at 5 AM on your selected days."},{icon:Users,title:"Join the Study Community",text:"Attend live study sessions and stay consistent with like-minded students."}]; return <section className={`py-16 md:py-20${home ? " home-steps" : ""}`}><div className="site-container text-center"><Eyebrow>How It Works</Eyebrow><h2 className="section-title mt-2">Get Started in 3 Simple Steps</h2><div className="mt-10 grid gap-5 md:grid-cols-3">{steps.map((s,i)=><article className="step-card" key={s.title}><span className="step-number">{i+1}</span><span className="feature-icon mx-auto"><s.icon /></span><h3>{s.title}</h3><p>{s.text}</p></article>)}</div></div></section>; }

export function StudyCta({title="Join the Study Room at 5AM",home=false}:{title?:string;home?:boolean}) { return <section className={home ? "home-cta" : "site-container pb-16"}><div className="study-cta" style={{backgroundImage:`linear-gradient(90deg,hsl(var(--foreground)/.96),hsl(var(--foreground)/.55)),url(${hero})`}}><div><Eyebrow>It's Time</Eyebrow><h2>{title}</h2><p>Be part of a supportive community and take one step towards a more focused and productive you.</p><div className="mt-6 flex flex-wrap gap-3"><Button asChild size="lg"><a href={orderLink()} target="_blank" rel="noreferrer">Join the Study Room at 5 AM <ArrowRight /></a></Button><Button asChild variant="secondary" size="lg"><a href={orderLink("Community Registration")} target="_blank" rel="noreferrer"><Users /> Register to Community <ArrowRight /></a></Button></div></div></div></section>; }

export function Checklist() { return <ul className="mt-5 grid gap-3">{["Wake up at 5 AM","Study with 5AM.co.in","Be consistent","Make progress","Be proud"].map(x=><li key={x} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></span>{x}</li>)}</ul>; }

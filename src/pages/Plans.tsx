import { ArrowRight, Bell, CalendarDays, ShieldCheck, Star, TrendingUp, Users } from "lucide-react";
import plansHero from "@/assets/plans-hero-ref.jpg";
import { MONTHLY_PLANS, orderLink } from "@/data/fiveam";
import { useSeo } from "@/hooks/useSeo";

const weeklyPlans = [
  { days: 3, calls: 3, price: 149 },
  { days: 4, calls: 4, price: 199 },
  { days: 6, calls: 6, price: 249 },
];

const benefits = [
  { Icon: Users, title: "Live Study Sessions", text: "Study together with a community" },
  { Icon: Bell, title: "Daily Wake-Up Calls", text: "Get a wake-up call and never miss 5 AM" },
  { Icon: TrendingUp, title: "Stay Consistent", text: "Track progress and build habits" },
  { Icon: ShieldCheck, title: "Supportive Community", text: "Surround yourself with like-minded students" },
];

function Rays() {
  return <span className="p-rays" aria-hidden="true"><i /><i /><i /></span>;
}

function PlanCard({ plan }: { plan: { days: number; calls: number; price: number; popular?: boolean } }) {
  return <article className={plan.popular ? "p-card popular" : "p-card"}>
    {plan.popular && <span className="p-popular"><Star fill="currentColor" /> Most Popular</span>}
    <span className="p-calendar"><CalendarDays /></span>
    <h3>{plan.days} Days</h3>
    <p>{plan.calls} Wake-Up Calls</p>
    <strong>₹{plan.price.toLocaleString("en-IN")}</strong>
    <a className="p-card-button" href={orderLink(`${plan.days} Days Plan - ₹${plan.price}`)} target="_blank" rel="noreferrer">Get Started <ArrowRight /></a>
  </article>;
}

export default function Plans() {
  useSeo({ title: "Plans", description: "Choose a weekly or monthly 5AM plan with wake-up calls and study community access.", path: "/plans" });

  return <div className="plans-page">
    <section className="p-hero" style={{ backgroundImage: `linear-gradient(90deg, hsl(var(--ink)/.92) 0%, hsl(var(--ink)/.72) 36%, hsl(var(--ink)/.08) 66%, hsl(var(--ink)/0) 100%), url(${plansHero})` }}>
      <div className="p-shell">
        <span className="p-eyebrow">Our Plans</span>
        <h1>Invest in a<br /><span>Better You</span><Rays /></h1>
        <p>Choose a plan, get daily wake-up calls and<br />join a supportive study community to stay<br />consistent and achieve your goals.</p>
        <div className="p-hero-benefits">
          {benefits.slice(0, 3).map(({ Icon, title }) => <div key={title}><span><Icon /></span><b>{title}</b></div>)}
        </div>
      </div>
    </section>

    <section className="p-pricing">
      <div className="p-shell">
        <div className="p-section-heading">
          <span className="p-eyebrow light">Choose Your Plan</span>
          <h2>Weekly Plans<Rays /></h2>
          <p>Short-term plans to build your routine and get started.</p>
        </div>
        <div className="p-grid">
          {weeklyPlans.map(plan => <PlanCard key={plan.days} plan={plan} />)}
        </div>

        <div className="p-section-heading monthly">
          <h2>Monthly Plans<Rays /></h2>
          <p>Stay consistent for longer and make real progress.</p>
        </div>
        <div className="p-grid">
          {MONTHLY_PLANS.map(plan => <PlanCard key={plan.days} plan={plan} />)}
        </div>
      </div>
    </section>

    <section className="p-benefit-strip">
      <div className="p-shell">
        {benefits.map(({ Icon, title, text }) => <div className="p-benefit" key={title}>
          <span className="p-benefit-icon"><Icon /></span>
          <div><h3>{title}</h3><p>{text}</p></div>
        </div>)}
      </div>
    </section>
  </div>;
}
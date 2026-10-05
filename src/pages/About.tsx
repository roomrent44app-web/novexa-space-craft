import { HeartHandshake, ShieldCheck, Sunrise, Users } from "lucide-react";
import student from "@/assets/5am-student.jpg";
import { Checklist, Eyebrow, Hero, StudyCta } from "@/components/site/FiveAmSections";
import { useSeo } from "@/hooks/useSeo";

export default function About(){
 useSeo({title:"About",description:"Meet 5AM, the supportive early-morning study community helping students build consistency.",path:"/about"});
 return <><Hero compact eyebrow="About 5AM" title="Same Time." accent="Better You." text="We help students turn early mornings into focused study, strong habits and a brighter future."/>
 <section className="py-16 md:py-20"><div className="site-container grid items-center gap-10 md:grid-cols-2"><img src={student} width={1440} height={960} loading="lazy" alt="A 5AM community student studying at sunrise" className="rounded-md object-cover shadow-elegant"/><div><Eyebrow>Our Purpose</Eyebrow><h2 className="section-title mt-3">Disciplined Students Build Brighter Futures</h2><p className="mt-4 leading-7 text-muted-foreground">5AM.co.in brings students together before the day gets busy. With wake-up calls, live sessions and genuine accountability, we make it easier to start—and keep going.</p><Checklist/></div></div></section>
 <section className="section-cream py-16"><div className="site-container text-center"><Eyebrow>Why 5AM</Eyebrow><h2 className="section-title mt-2">A Community That Cares</h2><div className="mt-8 grid gap-4 md:grid-cols-4">{[[Sunrise,"Start With Purpose"],[Users,"Study Together"],[ShieldCheck,"Safe & Positive"],[HeartHandshake,"Real Support"]].map(([Icon,title])=>{const I=Icon as typeof Sunrise;return <article className="value-card" key={String(title)}><span className="feature-icon mx-auto"><I/></span><h3>{String(title)}</h3><p>Simple support designed to help you become more consistent every day.</p></article>})}</div></div></section>
 <StudyCta title="Wake Up. Show Up. Grow."/></>;
}
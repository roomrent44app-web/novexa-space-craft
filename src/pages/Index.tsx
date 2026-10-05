import { CheckCircle2, Heart, Star, Users } from "lucide-react";
import student from "@/assets/5am-student.jpg";
import { FeatureStrip, Hero, PlansSection, Steps, StudyCta, Eyebrow } from "@/components/site/FiveAmSections";
import { useSeo } from "@/hooks/useSeo";

const stories=[
  ["Priya S.","NEET Aspirant","5AM.co.in helped me build a study routine. Now I never miss my 5 AM ever again!"],
  ["Ananya K.","UPSC Aspirant","The wake-up calls and live study sessions keep me consistent and motivated."],
  ["Rohit M.","JEE Aspirant","Such a supportive community! I feel more productive and focused every day."],
];

export default function Index(){
  useSeo({title:"5AM Study Community",description:"Join India's 5AM study community for live study sessions, daily wake-up calls and consistent progress.",path:"/"});
  return <>
    <Hero eyebrow="Study Together at 5 AM" title="Join the Study Room" accent="at 5AM" text="Get daily wake-up calls, live study sessions and a supportive community to stay consistent in your study journey." />
    <FeatureStrip />
    <PlansSection />
    <section className="grid md:grid-cols-2"><img src={student} width={1440} height={960} loading="lazy" alt="Student building a consistent early morning study routine" className="h-full min-h-[420px] w-full object-cover"/><div className="flex items-center bg-background p-8 md:p-14"><div><Eyebrow>A Community That Cares</Eyebrow><h2 className="section-title mt-3">More Than Just<br/>Wake-Up Calls</h2><p className="mt-4 max-w-xl leading-7 text-muted-foreground">5AM.co.in is a platform where students from all over India come together to study, stay consistent and grow with a supportive community.</p><div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">{[["10K+","Students Joined"],["Daily","Live Study Sessions"],["High","Consistency Rate"],["100%","Student Support"]].map(x=><div key={x[1]}><strong className="text-2xl text-primary">{x[0]}</strong><p className="text-xs text-muted-foreground">{x[1]}</p></div>)}</div></div></div></section>
    <Steps />
    <section className="section-cream py-16"><div className="site-container"><Eyebrow>What Our Students Say</Eyebrow><h2 className="section-title mt-2">Real Stories. Real Progress.</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{stories.map(([name,role,quote],i)=><article className="testimonial" key={name}><div className="flex items-center gap-3"><span className="avatar">{i===2?<Users/>:<Heart/>}</span><div><h3>{name}</h3><p>{role}</p></div></div><p className="mt-4">“{quote}”</p><div className="mt-4 flex text-accent">{[1,2,3,4,5].map(n=><Star key={n} className="h-4 w-4 fill-current"/>)}</div></article>)}</div></div></section>
    <StudyCta />
  </>;
}
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Stethoscope, GraduationCap, Heart, Users, Sun, BarChart3, Quote } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";
import {
  foundersHeroWebp, foundersJourneyWebp, foundersSunriseWebp, foundersBannerWebp,
} from "@/data/images";

const BADGES = [
  { icon: Stethoscope, tone: "orange", title: "MBBS", sub: "Both Doctors" },
  { icon: GraduationCap, tone: "green", title: "Doctors by Profession", sub: "Educators by Passion" },
  { icon: Heart, tone: "red", title: "Lifelong Learners", sub: "Still Learning, Still Growing" },
];

const PILLARS = [
  { icon: Users, tone: "orange", title: "Study Together", sub: "Live sessions &\naccountability" },
  { icon: Sun, tone: "orange", title: "Build Better Habits", sub: "Consistency through\nwake-up calls" },
  { icon: BarChart3, tone: "orange", title: "Stay Motivated", sub: "With a supportive\ncommunity" },
  { icon: Heart, tone: "red", title: "Become Your Best Self", sub: "One morning\nat a time" },
];

export default function FoundersStory() {
  useSeo({
    title: "Our Founders Story — The People Behind 5AM.CO.IN",
    description: "The story of Dr. Avi Bindal & Dr. Manya Gupta — two doctors building a community where every student becomes a better version of themselves, one morning at a time.",
    path: "/blog/founders-story",
  });

  return (
    <div className="fs-page">
      <div className="fs-shell">
        <Link to="/blog" className="fs-back"><ArrowLeft /> Back to Blogs</Link>

        {/* Hero */}
        <section className="fs-hero">
          <div className="fs-hero-copy">
            <span className="fs-eyebrow">Our Founders Story</span>
            <h1>The People<br />Behind<br /><span>5AM.CO.IN</span></h1>
            <p>A story of two doctors, a shared dream and a belief that every student can become a better version of themselves — one morning at a time.</p>
          </div>
          <div className="fs-hero-photo">
            <span className="fs-note">Same<br />Students<br />Brighter<br />Mornings ♡</span>
            <img src={foundersHeroWebp} alt="Dr. Avi Bindal and Dr. Manya Gupta" width={1408} height={896} fetchPriority="high" />
            <span className="fs-tag fs-tag-avi">
              <strong>Dr. Avi Bindal</strong>
              <em>MBBS<br />Doctor</em>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4c8 2 12 8 14 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M14.5 17.5 18 19.5l1-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="fs-tag fs-tag-manya">
              <strong>Dr. Manya Gupta</strong>
              <em>MBBS<br />Doctor</em>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-8 2-12 8-14 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M9.5 17.5 6 19.5l-1-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span className="fs-spark fs-spark-1">✦</span>
            <span className="fs-spark fs-spark-2">✦</span>
            <span className="fs-spark fs-spark-3">✦</span>
          </div>
        </section>

        {/* Badge strip */}
        <section className="fs-strip">
          {BADGES.map((b, i) => (
            <div className="fs-badge" key={b.title}>
              {i > 0 && <span className="fs-divider" aria-hidden="true" />}
              <span className={`fs-badge-ic ${b.tone}`}><b.icon strokeWidth={1.8} /></span>
              <div><strong>{b.title}</strong><small>{b.sub}</small></div>
            </div>
          ))}
        </section>

        {/* Our Journey */}
        <section className="fs-row">
          <div className="fs-copy">
            <span className="fs-eyebrow">Our Journey</span>
            <h2>From Medical Aspirants<br />to Lifelong Learners</h2>
            <p>Our journey started just like many of you — as students with big dreams, long study hours, self-doubt and countless distractions. We were once NEET aspirants too, and we know exactly how confusing, overwhelming and lonely this journey can feel.</p>
            <p>Through our own preparation days, we realised that success is not just about studying more, but also about having the right environment, consistency and the right people around you.</p>
          </div>
          <div className="fs-photo">
            <img src={foundersJourneyWebp} alt="Study desk with notebook and coffee mug" width={1024} height={1024} loading="lazy" />
          </div>
        </section>

        {/* Why 5AM */}
        <section className="fs-row fs-row-rev">
          <div className="fs-photo">
            <img src={foundersSunriseWebp} alt="Sunrise over the mountains from a study desk" width={1024} height={1024} loading="lazy" />
          </div>
          <div className="fs-copy">
            <span className="fs-eyebrow">Why 5AM.CO.IN</span>
            <h2>Turning Our Experience<br />Into a Purpose</h2>
            <p>After becoming doctors, we wanted to give back to the student community in a meaningful way. We created 5AM.CO.IN — a space where students can wake up, study together, stay consistent and become the best version of themselves, one morning at a time.</p>
            <p>We know how powerful the early hours are. The quiet, distraction-free time before the world wakes up can change your focus, productivity and mindset — and that's exactly what we want to help you build.</p>
            <div className="fs-quote"><Quote /> If we could do it, you can too. <Heart className="fs-heart" /></div>
          </div>
        </section>

        {/* Our Vision */}
        <section className="fs-row">
          <div className="fs-copy">
            <span className="fs-eyebrow">Our Vision</span>
            <h2>A Community That<br />Grows Together</h2>
            <p>5AM.CO.IN is more than just wake-up calls. It's a community of like-minded students from all over India who support, motivate and push each other to stay consistent.</p>
            <p>We believe in discipline, good habits, focused study sessions and a positive environment where you feel accountable and never alone.</p>
          </div>
          <div className="fs-pillars">
            {PILLARS.map((p) => (
              <div className="fs-pillar" key={p.title}>
                <span className={`fs-pillar-ic ${p.tone}`}><p.icon strokeWidth={1.8} /></span>
                <strong>{p.title}</strong>
                <small>{p.sub.split("\n").map((l, i) => <span key={i}>{l}<br /></span>)}</small>
              </div>
            ))}
          </div>
        </section>

        {/* Belief banner */}
        <section className="fs-banner">
          <img className="fs-banner-img" src={foundersBannerWebp} alt="Our Biggest Belief — Brighter Students. Brighter Futures." loading="lazy" />
          <div className="fs-banner-left">
            <span className="fs-eyebrow light">Our Biggest Belief</span>
            <h2>Brighter Students.<br />Brighter Futures.</h2>
          </div>
          <span className="fs-banner-sep" aria-hidden="true" />
          <div className="fs-banner-right">
            <p>A healthier, more focused and happier generation — starting with 5 AM.</p>
            <Heart className="fs-heart" />
          </div>
        </section>

        <div className="fs-more">
          <Link to="/blog" className="fs-btn">Back to all blogs <ArrowRight /></Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { ChevronDown, ShieldCheck } from "lucide-react";

const RULES = [
  "Be kind and respectful to every student — no bullying, abuse or hate speech.",
  "No bad language, adult content, or personal attacks in posts or comments.",
  "Share only study, motivation and progress related content — no spam or promotions.",
  "Do not share anyone's personal details (phone numbers, addresses, photos) without permission.",
  "Do not post misleading or false information.",
  "Breaking these rules can get your post or comment removed, and your account banned from the app.",
];

export default function CommunityGuidelines() {
  const [open, setOpen] = useState(false);
  return (
    <div className="dash-guidelines">
      <button type="button" className="dash-guidelines-toggle" aria-expanded={open} onClick={() => setOpen(!open)}>
        <ShieldCheck />
        <span>Community Guidelines — please read before posting</span>
        <ChevronDown className={open ? "rot" : ""} />
      </button>
      {open && (
        <ol className="dash-guidelines-list">
          {RULES.map((rule) => <li key={rule}>{rule}</li>)}
        </ol>
      )}
    </div>
  );
}

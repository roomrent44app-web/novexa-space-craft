import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Plus, Share2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DASHBOARD_PREVIEW } from "@/data/dashboardPreview";
import { dashboardStudentsWebp } from "@/data/images";
import CommunityGuidelines from "./CommunityGuidelines";

export default function DashboardPreviewCommunity() {
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState<string[]>([]);
  const posts = filter === "All" ? DASHBOARD_PREVIEW.posts : DASHBOARD_PREVIEW.posts.filter(p => p.category === filter);
  const loop = posts.length > 1 ? [...posts, ...posts] : posts;
  return <section className="dash-card dash-community">
    <header className="dash-card-head"><span className="dash-chip chip-orange"><UsersRound /></span><div className="dash-card-name"><h3>Community</h3><small>Share your progress, doubts and stay motivated together.</small></div><Button className="dash-post-btn" asChild><Link to="/account"><Plus />Post</Link></Button></header>
    <div className="dash-cat-row" role="tablist" aria-label="Post categories">{["All", "Progress", "Doubts", "Motivation", "Study Tips"].map(c => <Button variant="ghost" role="tab" aria-selected={filter === c} className={filter === c ? "on" : ""} key={c} onClick={() => setFilter(c)}>{c}</Button>)}</div>
    <div className="dash-feed-window"><ul className={loop.length > posts.length ? "dash-feed dash-feed-loop" : "dash-feed"}>{loop.map((p, i) => <li key={`${p.id}-${i}`}><span className="dash-feed-avatar dash-portrait portrait-1"><img src={dashboardStudentsWebp} alt="Illustrative student portrait" loading="lazy" width={1000} height={333} /></span><div className="dash-feed-body"><div className="dash-feed-top"><b>{p.author}</b><small>{p.time} · Sample</small></div><p className="dash-preview-post-text">{p.content}</p><div className="dash-feed-actions"><Button variant="ghost" className={liked.includes(p.id) ? "liked" : ""} aria-label={`Like ${p.author}'s sample post`} aria-pressed={liked.includes(p.id)} onClick={() => setLiked(cur => cur.includes(p.id) ? cur.filter(id => id !== p.id) : [...cur, p.id])}><Heart />{p.likes + (liked.includes(p.id) ? 1 : 0)}</Button><Button variant="ghost" asChild><Link to="/account" aria-label="View community comments"><MessageSquare />{p.comments}</Link></Button><Button variant="ghost" asChild><Link to="/account" aria-label="Share with the community"><Share2 /></Link></Button></div></div></li>)}</ul></div>
  </section>;
}
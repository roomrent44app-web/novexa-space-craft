import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function Logo({ className = "h-11" }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center gap-2" aria-label="Atlastrip home">
      <Compass className={`${className} w-auto text-primary`} strokeWidth={2.4} />
      <span className="text-xl font-bold text-foreground">Atlas<span className="text-primary">trip</span></span>
    </Link>
  );
}

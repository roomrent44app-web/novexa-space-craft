import { Link } from "react-router-dom";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`brand-logo ${className}`} aria-label="5AM home">
      <span className="brand-five">5AM</span><span className="brand-domain">.CO.IN</span><span className="brand-sun" aria-hidden="true">☀</span>
    </Link>
  );
}

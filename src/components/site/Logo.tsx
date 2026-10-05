import { Link } from "react-router-dom";
import logo from "@/assets/5am-logo.png";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`brand-logo ${className}`} aria-label="5AM.co.in home">
      <img src={logo} alt="5AM.co.in" width={1007} height={773} />
    </Link>
  );
}

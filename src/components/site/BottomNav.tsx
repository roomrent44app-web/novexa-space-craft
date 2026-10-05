import { Home, CalendarCheck, Images, Newspaper, UserRound } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/plans", label: "Plans", Icon: CalendarCheck },
  { to: "/gallery", label: "Gallery", Icon: Images },
  { to: "/blog", label: "Blog", Icon: Newspaper },
  { to: "/account", label: "Account", Icon: UserRound },
];

export default function BottomNav() {
  return (
    <nav className="bottom-nav md:hidden" aria-label="Bottom navigation">
      {items.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) => cn("bottom-nav-item", isActive && "active")}
        >
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="reveal">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <li className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-1 hover:text-primary">
            <Home className="h-3.5 w-3.5" /> Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-2">
            <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            {i === items.length - 1 ? (
              <span className="font-medium text-foreground" aria-current="page">{item.name}</span>
            ) : (
              <Link to={item.path} className="hover:text-primary">{item.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

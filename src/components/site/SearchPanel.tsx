import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Minus, Plus, Search, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_TABS } from "@/data/travel";

export default function SearchPanel() {
  const [tab, setTab] = useState(SEARCH_TABS[0]);
  const [where, setWhere] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-border bg-background p-4 shadow-elegant md:p-6">
      <div className="flex flex-wrap gap-2">
        {SEARCH_TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              tab === t ? "bg-primary text-primary-foreground" : "bg-surface-muted text-muted-foreground hover:text-primary"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/contact");
        }}
        className="mt-5 grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto]"
      >
        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="sr-only">Where to</span>
          <input
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            placeholder={`Where to? (${tab})`}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <label className="flex items-center gap-3 rounded-xl border border-border px-4 py-3">
          <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="sr-only">Travel date</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-transparent text-sm outline-none"
          />
        </label>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3">
          <span className="flex items-center gap-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" aria-hidden="true" />
            {guests} {guests === 1 ? "Guest" : "Guests"}
          </span>
          <span className="flex items-center gap-1">
            <button type="button" aria-label="Fewer guests" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-7 w-7 place-items-center rounded-full border border-border hover:border-primary hover:text-primary">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button type="button" aria-label="More guests" onClick={() => setGuests((g) => Math.min(20, g + 1))} className="grid h-7 w-7 place-items-center rounded-full border border-border hover:border-primary hover:text-primary">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </span>
        </div>

        <button type="submit" className="btn-primary justify-center rounded-xl px-7">
          <Search className="h-4 w-4" /> Search
        </button>
      </form>
    </div>
  );
}

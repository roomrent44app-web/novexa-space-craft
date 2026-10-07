// Shared helpers for the student dashboard (all date logic uses India time).

export const istDateStr = () => new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

export const addDays = (dateStr: string, days: number) => {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
};

export const istMonday = (today = istDateStr()) => {
  const [y, m, d] = today.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dt.getUTCDay();
  return addDays(today, dow === 0 ? -6 : 1 - dow);
};

export const greeting = (): { label: string; icon: string } => {
  const h = Number(new Date().toLocaleString("en-IN", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }));
  if (h >= 5 && h < 12) return { label: "Good Morning", icon: "☀️" };
  if (h >= 12 && h < 17) return { label: "Good Afternoon", icon: "🌤️" };
  if (h >= 17 && h < 21) return { label: "Good Evening", icon: "🌆" };
  return { label: "Good Night", icon: "🌙" };
};

export const timeAgo = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" });
};

// Best available name for a signed-in student: profile row, then auth metadata, then email.
export const fallbackName = (user: { user_metadata?: Record<string, unknown> | null; email?: string | null }) => {
  const meta = user.user_metadata ?? {};
  const metaName = [meta.full_name, meta.name, meta.display_name].find((v) => typeof v === "string" && (v as string).trim());
  if (metaName) return (metaName as string).trim();
  if (user.email) return user.email.split("@")[0].replace(/[._-]+/g, " ").trim();
  return "";
};

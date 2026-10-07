import { useCallback, useEffect, useState } from "react";
import { BookText, NotebookPen, Plus, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Note = { id: string; title: string; body: string; created_at: string };

export default function DashboardNotes({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("student_notes").select("id,title,body,created_at")
      .eq("user_id", userId).order("created_at", { ascending: false }).limit(20);
    setNotes((data ?? []) as Note[]);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const { error } = await supabase.from("student_notes").insert({ user_id: userId, title: title.trim(), body: body.trim() });
    setBusy(false);
    if (!error) { setTitle(""); setBody(""); setOpen(false); await load(); }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this note?")) return;
    await supabase.from("student_notes").delete().eq("id", id);
    await load();
  };

  return (
    <section className="dash-card dash-notes">
      <header className="dash-card-head">
        <span className="dash-chip chip-pink"><BookText /></span>
        <div className="dash-card-name"><h3>My Notes</h3><small>Save, organize and access your notes</small></div>
        <span className="dash-card-arrow" aria-hidden="true">›</span>
      </header>

      {open && (
        <form className="dash-note-form" onSubmit={save}>
          <input className="dash-input" placeholder="Note title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="dash-input" rows={3} placeholder="Write your note…" value={body} onChange={(e) => setBody(e.target.value)} />
           <Button type="submit" disabled={busy}><NotebookPen /> {busy ? "Saving…" : "Save Note"}</Button>
        </form>
      )}

      <ul className="dash-note-list">
        {notes.map((note) => (
          <li key={note.id}>
            <span className="dash-note-icon"><BookText /></span>
            <div className="dash-note-body">
              <b>{note.title}</b>
              {note.body && <p>{note.body}</p>}
              <small>{new Date(note.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" })}</small>
            </div>
            <Button variant="ghost" size="icon" type="button" aria-label={`Delete ${note.title}`} onClick={() => remove(note.id)}><Trash2 /></Button>
          </li>
        ))}
        {!notes.length && <li className="dash-empty"><BookText /> No notes yet</li>}
      </ul>
      <Button variant="secondary" type="button" className="dash-new-note" onClick={() => setOpen(!open)}>{open ? <X /> : <Plus />}{open ? "Close" : "Create New Note"}</Button>
    </section>
  );
}

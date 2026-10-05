import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/useSeo";

type Img = { id: string; url: string; caption: string };

export default function Gallery() {
  useSeo({ title: "Gallery", description: "Moments from the 5AM study community — early mornings, focused study and growing together.", path: "/gallery" });
  const [items, setItems] = useState<Img[] | null>(null);
  const [open, setOpen] = useState<Img | null>(null);
  useEffect(() => {
    supabase.from("gallery_images").select("id,url,caption").order("created_at", { ascending: false }).then(({ data }) => setItems(data ?? []));
  }, []);
  return (
    <div className="cms-page">
      <section className="cms-head"><div className="p-shell">
        <span className="p-eyebrow">5AM Gallery</span>
        <h1>Our <em>Mornings</em> Together</h1>
        <p>Moments from our early-morning study community.</p>
      </div></section>
      <section className="p-shell cms-body">
        {items === null ? <p className="cms-empty">Loading…</p> : items.length === 0 ? <p className="cms-empty">No photos yet. Check back soon!</p> :
          <div className="cms-gallery">
            {items.map((i) => (
              <button key={i.id} type="button" onClick={() => setOpen(i)} aria-label={i.caption || "Open photo"}>
                <img src={i.url} alt={i.caption || "5AM gallery photo"} loading="lazy" />
                {i.caption && <span>{i.caption}</span>}
              </button>
            ))}
          </div>}
      </section>
      {open && <div className="cms-lightbox" role="dialog" aria-modal="true" onClick={() => setOpen(null)}>
        <button type="button" aria-label="Close photo"><X /></button>
        <img src={open.url} alt={open.caption || "5AM gallery photo"} onClick={(e) => e.stopPropagation()} />
        {open.caption && <p>{open.caption}</p>}
      </div>}
    </div>
  );
}

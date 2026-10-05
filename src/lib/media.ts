import { supabase } from "@/integrations/supabase/client";

// Uploads to the private "media" bucket and returns a long-lived signed URL for public display.
export async function uploadMedia(file: File, folder: "blog" | "gallery") {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { contentType: file.type, upsert: false });
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 20);
  if (e2 || !data) throw e2 ?? new Error("Could not create image link");
  return data.signedUrl;
}

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || `post-${Date.now()}`;

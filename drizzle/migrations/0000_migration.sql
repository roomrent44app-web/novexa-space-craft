create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.blog_posts to anon;
grant select, insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "Public reads published posts" on public.blog_posts for select to anon, authenticated using (published or public.has_role(auth.uid(),'admin'));
create policy "Admin inserts posts" on public.blog_posts for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admin updates posts" on public.blog_posts for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admin deletes posts" on public.blog_posts for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text not null default '',
  created_at timestamptz not null default now()
);
grant select on public.gallery_images to anon;
grant select, insert, update, delete on public.gallery_images to authenticated;
grant all on public.gallery_images to service_role;
alter table public.gallery_images enable row level security;
create policy "Public reads gallery" on public.gallery_images for select to anon, authenticated using (true);
create policy "Admin inserts gallery" on public.gallery_images for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "Admin updates gallery" on public.gallery_images for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admin deletes gallery" on public.gallery_images for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "Public reads media" on storage.objects for select using (bucket_id = 'media');
create policy "Admin uploads media" on storage.objects for insert to authenticated with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "Admin updates media" on storage.objects for update to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
create policy "Admin deletes media" on storage.objects for delete to authenticated using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
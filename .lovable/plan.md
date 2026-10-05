# Admin panel for Blog and Gallery

## What you get
- **Blog page** (/blog): a list of posts with cover image, title, date and short intro. Clicking a post opens the full article (/blog/your-post).
- **Gallery page** (/gallery): a photo grid. Clicking a photo opens it larger.
- **Admin panel** (/admin): a login page using your fixed email and password. After signing in you can:
  - Write, edit, publish or delete blog posts (title, cover image, text).
  - Upload photos with an optional caption to the Gallery, and delete them.
  - Sign out.
- **Footer link**: an "Admin Panel" link in the footer. The footer will also be shown on every page (it is currently hidden on all five pages) so the link is always reachable. Blog and Gallery are added to the top menu and footer links.

## Login
- One admin account only, created with: brandhousstudio@gma.com and the password you gave.
- Public sign-up is turned off, so nobody else can create an account.
- Only this admin can add, change or delete posts and photos; visitors can only view them.
- The password is stored securely by the login system, never written in the website code.

## Design
Same 5AM style as the other pages: cream background, orange highlights, the same menu and fonts.

## Technical details
- Enable Lovable Cloud: tables `blog_posts` (title, slug, excerpt, content, cover_url, published, created_at) and `gallery_images` (url, caption, created_at); a public `media` storage bucket.
- Roles in a separate `user_roles` table with `has_role()`; RLS: public read of published posts and gallery, admin-only insert/update/delete; storage writes admin-only.
- Admin user created server-side with email auto-confirm; email sign-up disabled afterwards.
- New routes: /blog, /blog/:slug, /gallery, /admin; sitemap updated with Blog and Gallery.

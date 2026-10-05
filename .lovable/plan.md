# Premium 5AM Admin Operations Panel

## Goal

Replace the basic three-tab admin page with a polished, responsive control center for the whole 5AM website. Keep the existing secure admin login and preserve Blog and Gallery management.

## Admin experience

- Build a dedicated admin shell with a desktop sidebar, compact mobile navigation, a top bar, clear page titles, search, filters, status chips, loading/empty/error states, and confirmation dialogs.
- Use the existing 5AM orange, cream, white, and dark visual system in a more restrained operations-dashboard style. Keep tables dense and readable, avoid oversized elements, and make every screen usable on phones, tablets, and desktops.
- Sections: **Dashboard, Orders, Students, Attendance, Classes, Blog, Gallery**.

## Dashboard

- Show total verified revenue, this month's revenue, total orders, pending orders, active students, expiring plans, today's attendance, and monthly attendance rate.
- Add revenue and attendance charts with useful date ranges.
- Show recent orders, plans expiring soon, and quick actions for class links, student lookup, blog creation, and gallery upload.
- Calculate revenue only from verified paid plan purchases and completed/paid physical orders; cancelled, failed, or pending records will not inflate revenue.

## Orders

- Create one unified order view with filters for order type, status, date, and student/customer search.
- Include existing Razorpay plan purchases and admin-created physical orders.
- Show order number, customer, item/plan, amount, payment state, operational status, purchase date, and relevant delivery details.
- Allow admin status changes: **Pending, Processing, Delivered, Cancelled**. Keep payment verification separate so changing a label cannot activate a student subscription or fabricate revenue.
- Provide an order detail panel, admin notes, and CSV export.
- Physical orders can be created and managed from the admin panel; this scope does not add a public physical-product storefront or checkout.

## Students

- List every registered student with name, email, mobile, joined date, current plan, expiry, days remaining, and attendance summary.
- Add search, plan/status filters, pagination, detail view, and CSV export.
- Include important admin actions: edit name/mobile, manually activate or extend a plan, expire/cancel access, inspect payment history, inspect attendance history, and correct attendance after confirmation.
- Keep student data private and available only to authenticated admins; students continue seeing only their own information.

## Attendance

- Add daily and monthly summaries, present/absent counts, attendance percentage, trends, and a date-based student table.
- Support student search, month navigation, status filters, individual detail history, correction of mistaken records, and CSV export.
- Continue using India time for attendance dates and prevent duplicate attendance for the same student and day.

## Google Meet classes

- Replace the single link form with two saved options: **Temporary Link** and **Full Month Link**, each with its own schedule/label.
- Add an active-link selector. Only the selected link appears as the student's **Join Class** action.
- Validate Google Meet URLs and clearly show which option is currently live.

## Existing content tools

- Move the current Blog and Gallery tools into the new admin shell without removing their current create, edit, upload, publish, or delete capabilities.
- Improve their layout and feedback so they match the premium admin design.

## Technical details

- Apply additive database changes only: enrich protected profiles for admin listing, add a unified order record/status model, add admin notes and audit timestamps, and extend class settings for both link modes.
- Backfill existing subscription purchases into the unified order view without deleting or renaming current payment records.
- Add protected admin-only backend actions for sensitive mutations such as plan activation, attendance corrections, order updates, and student exports. Every action re-validates the signed-in user's admin role server-side.
- Keep Razorpay signature verification as the only automatic payment activation path. Manual admin plan changes are explicit audited actions, not fake payment confirmations.
- Record admin actions in an audit log with actor, action, target, timestamp, and non-secret change details.
- Keep all table access protected by row-level rules and explicit grants; no student emails, payment references, attendance, or delivery details become public.
- Reuse the existing chart and interface components where practical and keep all admin-specific styles scoped to the admin shell.

## Verification

- Test admin authorization, dashboard totals, revenue exclusions, order filtering/status updates, physical-order creation, student search/edit/plan actions, attendance reports/corrections, CSV exports, active class-link switching, and existing Blog/Gallery workflows.
- Verify that non-admin users cannot read or change admin data, and that one student cannot access another student's records.
- Test the complete admin experience at phone, tablet, and desktop widths with no sideways movement, overlap, or broken tables.
- Re-test the student panel to confirm plan expiry, attendance, and the selected Join Class link still work.

## Current dependency

Razorpay checkout code already exists, but live automatic payments remain blocked until the secure Razorpay credentials are supplied. The admin panel and manual operational controls can still be completed and tested independently.
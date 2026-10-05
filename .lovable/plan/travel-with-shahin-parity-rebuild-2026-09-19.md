# Travel With Shahin parity rebuild

## Goal
Rebuild the current travel site around the visible structure, wording, navigation, spacing, and blue/white visual language of `travelwithshahin.com`, while using locally owned or generated assets rather than copying purchased source files.

## What will change
- Replace the current oversized mountain hero with the reference layout: compact two-row header, rounded destination banner, centered headline, and overlapping six-tab booking panel.
- Reorder the home page to match the live site’s sequence, including offers, trust rating, partners, popular packages, destinations, services, experiences, transport, visa choices, reviews, articles, and footer content.
- Expand navigation and routes to mirror the live site’s page families: destination, package/tours, hotels, flights, transport, experiences, visas, about, blog, contact, and relevant detail views.
- Restyle shared cards, filters, buttons, tabs, page banners, lists, and footer with the reference’s compact Manrope typography, bright blue accents, white surfaces, soft gray borders, and modest corner radii.
- Replace repeated placeholder imagery with a cohesive local travel image set, keeping the site fast and avoiding broken external assets.
- Align visible page copy and sample travel data with the reference site where it describes the user’s own business; clearly retain sample prices or inventory where no real booking data exists.
- Remove the stale mobile-hook error source by making the hook JSX-free (`.ts`) and ensuring every import resolves to the renamed file.

## Functional behavior
- Booking tabs and forms will remain interactive and lead to the matching result or enquiry page.
- Mobile navigation, dropdowns, sliders, filters, forms, WhatsApp links, and detail links will work across screen sizes.
- Live airline, hotel, payment, and visa inventory will remain sample content until provider accounts are supplied.

## Validation
- Run the project typecheck and focused tests.
- Open the home page and major page families in Chromium at desktop and mobile widths.
- Check visual structure, navigation, console errors, overflow, and broken links against the live reference.

## Technical details
- Keep the existing React, TypeScript, Tailwind, and shared UI setup.
- Centralize matching page data and reuse shared listing/detail components to cover the larger route set consistently.
- Keep all colors and shadows in semantic design tokens.

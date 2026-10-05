# Rebuild as the Travel With Shahin site

## Goal
Replace the current digital-marketing website with a close, responsive recreation of `travelwithshahin.com`, using the same Atlastrip-style branding, content hierarchy, navigation, travel search experience, imagery, and supporting pages. Also eliminate the reported TypeScript error.

## Work
1. **Fix and verify the current error**
   - Keep the mobile hook as a proper React module with an explicit React import.
   - Validate TypeScript and the running preview after the rebuild.

2. **Create the travel design and shared layout**
   - Replace the dark agency colors with the reference site’s white, bright-blue, and neutral travel palette.
   - Match its typography, compact header, dropdown navigation, WhatsApp action, spacing, borders, and mobile menu.
   - Replace FluxMedias branding, footer content, floating actions, and search metadata with the travel brand.

3. **Recreate the homepage**
   - Build the large scenic travel banner with centered headline and rating strip.
   - Recreate the overlapping multi-service search panel for Tours, Hotels, Flights, Transport, Experience, and Visa.
   - Add the reference sections: discounts and offers, best-selling tours, trust benefits, top destinations, traveler reviews, visas, travel gallery, mobile app, articles, newsletter, and statistics.
   - Make tabs, search fields, quantity controls, and primary actions interactive on the front end.

4. **Recreate the supporting pages**
   - Convert the existing About, Services, Blog, detail, and Contact pages to matching travel content and styling.
   - Add destination and package routes with useful detail views for the reference navigation.
   - Preserve clean routing and mobile behavior throughout.

5. **Assets and validation**
   - Use locally stored travel imagery and assets rather than hotlinked files.
   - Check the main flows at desktop and mobile sizes, confirm every route renders, and verify there are no console or TypeScript errors.

## Assumptions
- “Same everything” means recreating the live site’s brand and public content as closely as possible from the supplied URL.
- This pass reproduces the visible experience in React. Live flight/hotel inventory, payments, and third-party booking APIs require separate service credentials.

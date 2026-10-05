# Faster, reliable image loading

## Goal
Make every public page appear faster by reducing image transfer size and prioritizing only the image visible at the top.

## Changes
- Convert bundled photos and the header logo to optimized WebP/AVIF variants during the website build.
- Load the active page’s top image immediately with high priority.
- Keep lower-page photos deferred until the visitor scrolls near them.
- Preserve the current design, dimensions, mobile behavior, and all five pages.
- Verify every image request succeeds and check the home page on desktop and mobile.

## Technical details
- Use `vite-imagetools` for build-time image conversion.
- Add a small shared preload hook that updates the page-specific image preload when navigation changes.
- Keep explicit image dimensions to prevent layout movement while files load.

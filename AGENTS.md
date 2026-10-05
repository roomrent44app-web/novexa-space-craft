# Project Rules

- Build page content from reusable 5AM section primitives and a single shared content module so plan pricing and business details remain consistent across all five pages.
- Keep responsive containment rules centralized in the global stylesheet so every public page remains overflow-safe across devices.
- Process bundled photography through `vite-imagetools`, register every variant in the shared image module, and warm the current page's photos first then other pages' photos in the background so navigation shows images instantly.
- Activate student subscriptions only through server-verified Razorpay payments, because plan access and expiry must never trust browser-supplied payment data.

import { Phone } from "lucide-react";
import { CONTACT } from "@/data/travel";

export default function FloatingActions() {
  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col gap-3">
      <a
        href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%2C%20I%20want%20to%20know%20more%20about%20your%20services`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-elegant transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.13-.42-2.15-1.33-.8-.71-1.33-1.59-1.48-1.89-.15-.3-.02-.46.13-.61.15-.15.33-.38.5-.58.12-.14.17-.25.25-.42.08-.17.04-.32-.03-.47-.07-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.66-.51h-.56c-.2 0-.5.07-.77.37-.27.3-1.02 1-1.02 2.42s1.04 2.8 1.19 3c.15.2 2.05 3.2 4.98 4.37 2.44.96 2.94.77 3.47.72.53-.05 1.71-.7 1.95-1.37.24-.68.24-1.26.17-1.38-.07-.12-.27-.19-.57-.34ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.37 9.37 0 0 1-1.44-5A9.44 9.44 0 0 1 18.7 5.3a9.32 9.32 0 0 1 2.77 6.66 9.44 9.44 0 0 1-9.43 9.54Zm8.03-17.56A11.28 11.28 0 0 0 12.03.6C5.79.6.72 5.67.72 11.91c0 1.99.52 3.94 1.51 5.65L.6 23.4l5.98-1.57a11.3 11.3 0 0 0 5.44 1.39h.01c6.24 0 11.32-5.08 11.32-11.32 0-3.02-1.18-5.87-3.28-7.96Z" />
        </svg>
      </a>
      <a
        href={`tel:${CONTACT.tel}`}
        aria-label="Call us"
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-orange text-primary-foreground shadow-glow transition-transform hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>
    </div>
  );
}

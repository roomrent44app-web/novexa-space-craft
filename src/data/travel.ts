import maldives from "@/assets/travel/tour-maldives.jpg";
import bali from "@/assets/travel/tour-bali.jpg";
import switzerland from "@/assets/travel/tour-switzerland.jpg";

export const CONTACT = {
  brand: "Atlastrip",
  phone1: "+91 97181 19119",
  tel: "+919718119119",
  whatsapp: "919718119119",
  email: "hello@travelwithshahin.com",
  address: "New Delhi, India",
  domain: "travelwithshahin.com",
  hours: "24 hours, 7 days a week",
};

export const TOURS = [
  { slug: "maldives-dubai", title: "Maldives & Dubai Luxury Escape", place: "Maldives · United Arab Emirates", days: "7 Days / 6 Nights", rating: "4.9", price: "$1,450", image: maldives, tags: ["Luxury", "Beach"] },
  { slug: "bali-retreat", title: "Bali Tropical Island Retreat", place: "Bali, Indonesia", days: "6 Days / 5 Nights", rating: "4.8", price: "$890", image: bali, tags: ["Culture", "Nature"] },
  { slug: "switzerland-alps", title: "Switzerland Alpine Escape", place: "Interlaken, Switzerland", days: "8 Days / 7 Nights", rating: "4.9", price: "$1,790", image: switzerland, tags: ["Mountains", "Scenic"] },
];

export const DESTINATIONS = [
  { name: "Indonesia", tours: 50, image: bali },
  { name: "Switzerland", tours: 32, image: switzerland },
  { name: "Maldives", tours: 28, image: maldives },
  { name: "Dubai", tours: 35, image: maldives },
  { name: "Thailand", tours: 40, image: bali },
  { name: "Vietnam", tours: 24, image: switzerland },
];

export interface Service {
  slug: string;
  title: string;
  short: string;
  icon: string;
  intro: string;
  points: string[];
}

export const SERVICES: Service[] = [
  {
    slug: "tours",
    title: "Tours",
    short: "Handpicked guided journeys for couples, families, groups and solo travelers.",
    icon: "Map",
    intro: "Every itinerary is built around how you like to travel — the pace, the stays and the moments worth slowing down for.",
    points: [
      "Private and small-group departures",
      "Honeymoon and family itineraries",
      "Local English-speaking guides",
      "Entry tickets and activities arranged",
      "Flexible day-by-day planning",
      "24/7 support while you travel",
    ],
  },
  {
    slug: "flights",
    title: "Flights",
    short: "Convenient domestic and international flight planning at competitive fares.",
    icon: "Plane",
    intro: "We compare routes and fare classes so you fly on sensible timings without overpaying.",
    points: [
      "Domestic and international bookings",
      "Multi-city and open-jaw routing",
      "Seat, meal and baggage requests",
      "Date-change and refund guidance",
      "Group fare handling",
      "Web check-in reminders",
    ],
  },
  {
    slug: "hotels",
    title: "Hotels",
    short: "Trusted stays from boutique hideaways to world-class luxury resorts.",
    icon: "Hotel",
    intro: "We only recommend properties we would happily stay in ourselves, in locations that actually suit your plan.",
    points: [
      "Beach resorts and city hotels",
      "Villas, homestays and boutique stays",
      "Honeymoon and upgrade requests",
      "Early check-in coordination",
      "Breakfast and transfer inclusions",
      "Verified reviews and location checks",
    ],
  },
  {
    slug: "transport",
    title: "Transport",
    short: "Reliable airport transfers, private cars and intercity transportation.",
    icon: "Bus",
    intro: "Ground travel handled end to end, so no part of your trip depends on finding a taxi at the last minute.",
    points: [
      "Airport pickups and drops",
      "Private cars with drivers",
      "Intercity coaches and rail tickets",
      "Ferry and speedboat transfers",
      "Child seats on request",
      "Live arrival tracking",
    ],
  },
  {
    slug: "visa",
    title: "Visa Processing",
    short: "Clear guidance and end-to-end support for tourist visa applications.",
    icon: "Stamp",
    intro: "A simple checklist, document review and appointment support so applications go in right the first time.",
    points: [
      "Country-wise document checklist",
      "Form filling and review",
      "Appointment scheduling",
      "Cover letter and itinerary support",
      "Travel insurance assistance",
      "Status follow-up",
    ],
  },
  {
    slug: "experiences",
    title: "Experiences",
    short: "Authentic local activities designed to make every trip unforgettable.",
    icon: "Compass",
    intro: "The parts of a trip people remember years later — chosen carefully, booked in advance.",
    points: [
      "Sunset cruises and island hopping",
      "Food walks and cooking classes",
      "Diving, snorkelling and water sports",
      "Mountain rail and cable car journeys",
      "Wildlife safaris",
      "Cultural shows and festivals",
    ],
  },
];

export const BENEFITS = [
  { title: "Handpicked Itineraries", desc: "Every trip is planned by people who have travelled the route themselves.", icon: "Map" },
  { title: "Transparent Pricing", desc: "You see exactly what is included before you pay a single rupee.", icon: "Wallet" },
  { title: "24/7 Trip Support", desc: "One WhatsApp number for anything you need while you are away.", icon: "Headphones" },
  { title: "Trusted Partners", desc: "Vetted hotels, guides and drivers in every destination we sell.", icon: "ShieldCheck" },
];

export const STATS = [
  { value: "12k+", label: "Happy Travelers" },
  { value: "60+", label: "Destinations" },
  { value: "4.9", label: "Average Rating" },
  { value: "24/7", label: "Trip Support" },
];

export const SEARCH_TABS = ["Tours", "Hotels", "Flights", "Transport", "Experience", "Visa"];

export interface Article {
  slug: string;
  title: string;
  category: string;
  image: string;
  date: string;
  excerpt: string;
  readTime: string;
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "best-time-maldives",
    title: "Best Time to Visit the Maldives for a Perfect Beach Escape",
    category: "Travel Guide",
    image: maldives,
    date: "12 Sep 2026",
    readTime: "5 min read",
    excerpt: "Plan around the best weather, quieter islands and exceptional seasonal offers.",
    content: [
      "The Maldives has two clear seasons, and knowing which one you are booking into changes the whole feel of the trip. The dry season runs roughly from November to April, with calm seas, long sunny days and the clearest water for snorkelling.",
      "May to October brings the wet season. Rain usually arrives in short bursts rather than all day, and resort rates drop noticeably — which makes it the best window if value matters more than guaranteed sunshine.",
      "If diving is the reason you are going, the months either side of the seasonal change often bring the richest marine life, including manta rays and whale sharks around the southern atolls.",
      "Whichever month you pick, book the transfer with the room. Seaplane and speedboat timings dictate which resorts are realistic for your arrival, and getting that wrong can cost you an entire day of your holiday.",
    ],
  },
  {
    slug: "first-wildlife-adventure",
    title: "What to Expect on Your First Wildlife Adventure",
    category: "Adventure",
    image: bali,
    date: "08 Sep 2026",
    readTime: "4 min read",
    excerpt: "A practical guide to preparing for an unforgettable journey into the wild.",
    content: [
      "A first safari or jungle trek rarely looks like the documentaries. Mornings start early, drives are long, and the best sightings happen when you have stopped expecting them.",
      "Pack for temperature swings rather than for style — neutral layers, a hat, closed shoes and insect repellent will do more for your comfort than anything else in the bag.",
      "Bring binoculars even if you also have a long camera lens. Most guests spend more time watching than photographing, and a decent pair transforms distant movement into a genuine sighting.",
      "Finally, listen to your guide. They read tracks, alarm calls and wind direction constantly, and following their lead is almost always what puts you in the right place at the right moment.",
    ],
  },
  {
    slug: "switzerland-nature",
    title: "Top Places to Visit in Switzerland for Nature Lovers",
    category: "Inspiration",
    image: switzerland,
    date: "02 Sep 2026",
    readTime: "6 min read",
    excerpt: "Lakes, mountain villages and panoramic rail journeys worth crossing the world for.",
    content: [
      "Switzerland rewards slow travel. The country is small enough to cross in a day, but the moments people remember come from staying put in one valley long enough to see it in different light.",
      "Interlaken is the natural base for a first visit, with lakes on both sides and easy access to Grindelwald, Lauterbrunnen and the high passes above them.",
      "For quieter days, head to Appenzell or the Engadine valley, where trails run between working farms and the villages still feel lived-in rather than arranged for visitors.",
      "Buy a rail pass before you arrive. The panoramic routes are part of the experience, not just transport, and having travel covered makes it far easier to change plans when the weather does.",
    ],
  },
];

export const TESTIMONIALS = [
  { quote: "Everything was organized perfectly, from our first airport pickup to the final sunset cruise.", title: "Excellent Trip!", name: "Sarah Khan", trip: "Maldives" },
  { quote: "The itinerary felt personal and unhurried. We discovered places we would never have found ourselves.", title: "Perfect Itinerary!", name: "Daniel Roy", trip: "Bali" },
  { quote: "Fast answers, transparent pricing and excellent local guides. We felt supported every day.", title: "Good Support!", name: "Nadia Ahmed", trip: "Switzerland" },
];

export const FAQS = [
  { q: "How do I book a trip?", a: "Send us an enquiry or message us on WhatsApp. We share an itinerary and quote, and the booking is confirmed once you approve it and pay the deposit." },
  { q: "Can itineraries be customised?", a: "Yes — every trip we sell can be adjusted for dates, hotel category, pace and the activities you actually want to do." },
  { q: "What is included in the tour price?", a: "Each itinerary lists inclusions clearly: stays, transfers, listed activities and any meals. Anything not listed is quoted separately before you pay." },
  { q: "Do you help with visas?", a: "We provide the document checklist, review your application and help with appointments. The final decision always rests with the embassy." },
  { q: "What if my plans change?", a: "Tell us as early as you can. Change and cancellation terms depend on the hotels and airlines involved, and we will always show you the options in writing." },
];

export const GALLERY = [maldives, bali, switzerland, bali, switzerland, maldives];

export const OFFERS = [
  { title: "Vietnam", desc: "Book early and save up to 20% on Halong Bay cruises, Hanoi city tours and beach resorts.", cta: "View All Packages", image: bali },
  { title: "Monthly Deals", desc: "Up to 25% off selected destinations, hotels and transport packages this month.", cta: "Explore Deals", image: switzerland },
  { title: "Exclusive Travel Offers", desc: "Handpicked beach escapes, city breaks and luxury stays for every kind of traveler.", cta: "View Offers", image: maldives },
  { title: "Adventure Calling", desc: "Jungle treks, island diving and mountain trails at specially discounted prices.", cta: "Grab the Deal", image: switzerland },
  { title: "Bali", desc: "Tropical beaches, cultural temples, rice terraces and relaxing resort stays.", cta: "View All Packages", image: bali },
  { title: "Holiday Deals", desc: "Special seasonal pricing on our most requested destinations with premium comfort.", cta: "View Offers", image: maldives },
];

export const VISAS = [
  { country: "Switzerland", note: "Schengen · 14 day delivery" },
  { country: "Indonesia", note: "Tourist e-visa · fast track" },
  { country: "United Kingdom", note: "Standard visitor visa" },
  { country: "Vietnam", note: "e-visa · 3 working days" },
  { country: "Egypt", note: "Tourist visa on request" },
  { country: "Thailand", note: "Tourist visa support" },
];

export const POPULAR_SEARCHES = [
  "Maldives honeymoon",
  "Bali family package",
  "Switzerland tour",
  "Dubai city break",
  "Thailand group tour",
  "Vietnam holiday",
  "Schengen visa",
  "Airport transfers",
];

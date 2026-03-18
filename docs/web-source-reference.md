# MyWheels EV — Web App Source Reference

> Complete reference of the web application at `github.com/karan-singare/mywheels-ev`
> This document serves as the single source of truth for converting the web SPA to a React Native mobile app.

---

## 1. Project Overview

- **Name**: MyWheels EV
- **Type**: Single Page Application (SPA)
- **Purpose**: Customer-facing frontend for an electric bike rental platform in Hyderabad
- **Target Users**: Delivery partners (Swiggy, Zomato, Blinkit, Zepto, Amazon), daily commuters, short/long-term rental users
- **Backend**: C# API + Database (separate repo, not yet integrated)

## 2. Tech Stack (Web)

- React 19.2 (TypeScript)
- Vite 7.3.1
- Tailwind CSS 3.4.19
- react-router-dom 7.13.0 (BrowserRouter, but only anchor scrolling used)
- Manrope font family
- gh-pages for deployment

## 3. Project Structure

```
mywheels-ev/
├── public/
│   ├── home-bg.webp
│   └── mywheels-ev.webp (logo)
├── src/
│   ├── components/
│   │   ├── About.tsx
│   │   ├── BackToTop.tsx
│   │   ├── ContactUs.tsx
│   │   ├── CTAStrip.tsx
│   │   ├── EarningsComparison.tsx
│   │   ├── FAQ.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Navbar.tsx
│   │   ├── PricingCard.tsx
│   │   ├── Section.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TrustSection.tsx
│   │   ├── WhatsAppButton.tsx
│   │   └── WhyElectric.tsx
│   ├── hooks/
│   │   └── useScrollReveal.ts
│   ├── pages/
│   │   └── Home.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 4. Design System / Theme

### 4.1 Color Palette

| Token       | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| primary     | #184cba   | Main brand blue, buttons, links |
| secondary   | #1a70c3   | Gradient stops               |
| tertiary    | #2994bf   | Gradient stops, accents      |
| dark        | #141c6c   | Headings, dark backgrounds   |
| darkAlt     | #1c298b   | Alternative dark              |
| teal        | #40b1af   | Testimonial gradient          |
| green       | #84d06e   | CTA buttons, success, accents |
| mint        | #61c194   | Testimonial gradient          |
| olive       | #7aad4f   | Unused/reserved               |
| bg          | #f8fafc   | Page background               |
| card        | #ffffff   | Card backgrounds              |
| textMain    | #141c6c   | Main text (headings)          |
| muted       | #374151   | Body text                     |
| mutedLight  | #6b7280   | Secondary/lighter text        |
| accent      | #84d06e   | Same as green                 |
| footerBg    | #141c6c   | Footer background             |

### 4.2 Typography

- **Font Family**: Manrope, sans-serif
- **Body**: 16px, weight 400, line-height 1.7, color #374151
- **Headings**: Manrope, color #141c6c, letter-spacing -0.02em, line-height 1.15
  - h1: weight 700, letter-spacing -0.03em
  - h2: weight 600
  - h3/h4: weight 600, letter-spacing -0.01em
- **Selection**: bg rgba(24,76,186,0.15), color #141c6c

### 4.3 Animations / Keyframes

| Name            | Description                                      |
|-----------------|--------------------------------------------------|
| fade-in-up      | opacity 0→1, translateY 24px→0, 0.7s ease-out   |
| fade-in         | opacity 0→1, 0.7s ease-out                       |
| float           | translateY 0→-12px→0, 5s infinite                |
| pulse-glow      | box-shadow pulse, 3s infinite                     |
| slide-in-left   | opacity+translateX -30px→0, 0.6s                 |
| slide-in-right  | opacity+translateX 30px→0, 0.6s                  |
| gradient-shift  | backgroundPosition 0%→100%→0%, 8s infinite       |
| soft-glow       | opacity+scale pulse, 4s infinite                  |

### 4.4 Scroll Reveal System

CSS classes used throughout:
- `.scroll-reveal` — opacity 0, translateY 20px, transition 0.7s cubic-bezier(0.16,1,0.3,1)
- `.scroll-reveal.revealed` — opacity 1, translateY 0
- `.scroll-reveal-delay-1` through `-delay-5` — staggered delays (0.08s increments)

Custom hook `useScrollReveal()`:
- Uses IntersectionObserver with threshold 0.15
- Observes container + all `.scroll-reveal` children
- Adds `.revealed` class on intersection, then unobserves

### 4.5 Border Radius

- 2xl: 16px
- 3xl: 20px

### 4.6 Background Patterns

- `.bg-grid-pattern`: subtle grid overlay using linear-gradient, 48px spacing
- `.parallax-bg`: fixed background attachment

---

## 5. Page Layout (Home — single page)

Order of sections as rendered:

1. **Hero** (full viewport)
2. **TrustSection** (brand logos)
3. **About** (3 feature cards)
4. **WhyElectric** (left card + right bullet points)
5. **HowItWorks** (wrapped in Section, id="how")
6. **EarningsComparison** (fuel vs EV comparison)
7. **Pricing** (wrapped in Section, id="pricing", 3 PricingCards)
8. **Testimonials** (3 testimonial cards)
9. **FAQ** (accordion, id="faq")
10. **Contact** (wrapped in Section, id="contact")
11. **CTAStrip** (final CTA)
12. **Footer** (persistent)
13. **BackToTop** (floating button, bottom-right)
14. **WhatsAppButton** (floating button, bottom-right offset)

Navbar is sticky at top.

---

## 6. Component Details — Full Source Code

### 6.1 main.tsx (Entry Point)

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);
```

### 6.2 App.tsx

```tsx
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import BackToTop from "./components/BackToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="bg-bg text-muted font-manrope min-h-screen antialiased">
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppButton />
    </div>
  );
};

export default App;
```

### 6.3 Home.tsx (Page)

```tsx
import About from "../components/About";
import ContactSection from "../components/ContactUs";
import CTAStrip from "../components/CTAStrip";
import EarningsComparison from "../components/EarningsComparison";
import FAQ from "../components/FAQ";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import PricingCard from "../components/PricingCard";
import Section from "../components/Section";
import Testimonials from "../components/Testimonials";
import TrustSection from "../components/TrustSection";
import WhyElectric from "../components/WhyElectric";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <TrustSection />
      <About />
      <WhyElectric />

      <Section
        id="how"
        title="How It Works"
        subtitle="Register, verify, choose your plan, and start earning — simple and fast."
        variant="light"
      >
        <HowItWorks />
      </Section>

      <EarningsComparison />

      <Section
        id="pricing"
        title="Simple, Transparent Pricing"
        subtitle="Choose the plan that works for you. No hidden charges."
        variant="tint"
      >
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          <PricingCard
            title="Weekly Plan"
            price="1,499"
            period="/week"
            features={[
              "Ideal for short-term or trial usage",
              "7-day rental period",
              "Great for testing the fit",
              "No long-term commitment",
            ]}
          />
          <PricingCard
            title="Monthly Plan"
            price="4,999"
            period="/month"
            featured
            tag="Best for Full-Time Riders"
            features={[
              "Most preferred by delivery partners",
              "30-day rental period",
              "Predictable monthly expense",
              "Priority support included",
            ]}
          />
          <PricingCard
            title="Daily Plan"
            price="249"
            period="/day"
            features={[
              "Perfect for trying before committing",
              "No minimum period required",
              "Pay as you go flexibility",
              "Ideal for part-time riders",
            ]}
          />
        </div>
        <p className="text-center text-muted max-w-2xl mt-10 mx-auto text-sm">
          Contact us for exact rates based on your usage and vehicle preference.
        </p>
      </Section>

      <Testimonials />
      <FAQ />

      <Section
        id="contact"
        title="Get In Touch"
        subtitle="MyWheels EV Pvt Ltd — Ready to help you start earning with electric mobility."
        variant="light"
      >
        <ContactSection />
      </Section>

      <CTAStrip />
    </>
  );
};

export default Home;
```


### 6.4 Hero.tsx

```tsx
const Hero: React.FC = () => {
  const bgImage = `${import.meta.env.BASE_URL}home-bg.webp`;

  return (
    <section className="relative min-h-screen min-h-[100dvh] w-full flex flex-col -mt-[60px] md:-mt-[72px]">
      {/* Full-bleed background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
        aria-hidden
      />
      {/* Animated gradient overlay */}
      <div
        className="absolute inset-0 animate-gradient-shift"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,28,108,0.92) 0%, rgba(24,76,186,0.85) 30%, rgba(28,41,139,0.88) 60%, rgba(20,28,108,0.90) 100%)",
          backgroundSize: "200% 200%",
        }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden />

      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" aria-hidden />
      <div className="absolute bottom-32 right-10 w-96 h-96 bg-tertiary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} aria-hidden />
      <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-green/15 rounded-full blur-2xl animate-float" style={{ animationDelay: "3s" }} aria-hidden />

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center px-6 md:px-16 pt-32 pb-16">
        <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          {/* Left side — text */}
          <div className="max-w-xl">
            <p className="text-green text-sm font-semibold uppercase tracking-[0.25em] mb-6 animate-fade-in-up">
              Electric Mobility · Hyderabad
            </p>
            <h1
              className="text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] font-bold text-white mb-7 animate-fade-in-up tracking-[-0.03em] leading-[1.1]"
              style={{ animationDelay: "0.1s" }}
            >
              We Power Hyderabad's{" "}
              <span className="text-green">Delivery Heroes</span> ⚡
            </h1>
            <p
              className="text-[17px] md:text-lg text-white/80 max-w-md mb-12 leading-[1.75] animate-fade-in-up font-normal"
              style={{ animationDelay: "0.2s" }}
            >
              Reliable electric two-wheelers built for gig workers who want zero downtime and higher earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <a href="#pricing" className="inline-flex items-center justify-center px-10 py-[18px] rounded-2xl font-semibold text-dark bg-green hover:bg-[#7ac766] shadow-xl shadow-green/25 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl text-[15px] tracking-wide">
                View Plans
              </a>
              <a href="#contact" className="inline-flex items-center justify-center px-10 py-[18px] rounded-2xl font-medium text-white/80 border border-white/25 hover:bg-white/10 hover:border-white/40 hover:text-white transition-all duration-300 hover:scale-[1.03] text-[15px]">
                Contact Us
              </a>
            </div>
          </div>

          {/* Right side — EV image with float + glow */}
          <div className="hidden md:flex justify-center animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="relative animate-float" style={{ animationDuration: "6s" }}>
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/40 via-tertiary/25 to-green/15 rounded-[2rem] blur-3xl animate-soft-glow" aria-hidden />
              <img src={`${import.meta.env.BASE_URL}home-bg.webp`} alt="Electric two-wheeler" className="relative rounded-3xl shadow-2xl shadow-black/40 max-h-[500px] object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a href="#trust" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer z-10" aria-label="Scroll to next section">
        <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Scroll</span>
        <div className="w-5 h-9 rounded-full border border-white/40 flex justify-center pt-1.5">
          <div className="w-1 h-1.5 rounded-full bg-white animate-bounce" />
        </div>
      </a>
    </section>
  );
};

export default Hero;
```

**Key data**:
- Background image: `home-bg.webp`
- Headline: "We Power Hyderabad's Delivery Heroes ⚡"
- Subtitle: "Reliable electric two-wheelers built for gig workers who want zero downtime and higher earnings."
- CTAs: "View Plans" → #pricing, "Contact Us" → #contact

### 6.5 Navbar.tsx

```tsx
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#", scrollTop: true },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = ["about", "how", "pricing", "faq", "contact"] as const;
const ACTIVE_OFFSET = 150;

function getActiveSection(): string {
  let active = "";
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= ACTIVE_OFFSET) active = "#" + id;
  }
  return active;
}

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setActiveHash(getActiveSection());
      setScrolled(window.scrollY > 20);
    };
    const onHashChange = () => setActiveHash(window.location.hash || getActiveSection());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setActiveHash("");
    setOpen(false);
  };

  // ... renders sticky header with transparent→white transition on scroll
  // Mobile hamburger menu with ☰/✕ toggle
  // Logo: mywheels-ev.webp with brightness invert when not scrolled
};

export default Navbar;
```

**Key data**:
- Nav links: Home, About, How It Works, Pricing, FAQ, Contact
- Sticky header, transparent over hero → white bg on scroll
- Mobile hamburger menu
- Logo image: `mywheels-ev.webp`

### 6.6 TrustSection.tsx

```tsx
const brands = [
  { name: "Swiggy", color: "#FC8019" },
  { name: "Zomato", color: "#E23744" },
  { name: "Blinkit", color: "#F7C600" },
  { name: "Zepto", color: "#7B2D8E" },
  { name: "Amazon", color: "#FF9900" },
];
```

- Section id: "trust"
- Label: "Used by Delivery Partners Working With"
- Renders brand names as SVG text elements with brand colors

### 6.7 About.tsx

```tsx
const features = [
  { icon: "⚡", title: "High Uptime", desc: "Vehicles that are always ready when you are. We keep you on the road earning, not waiting.", bg: "rgba(24,76,186,0.1)", color: "#184cba" },
  { icon: "💰", title: "Cost Efficiency", desc: "Save ₹300–₹500 daily compared to fuel bikes. Maximize your take-home income every month.", bg: "rgba(64,177,175,0.1)", color: "#40b1af" },
  { icon: "🛠", title: "Rapid Local Support", desc: "On-ground assistance in Hyderabad that minimizes downtime. We're just a call away.", bg: "rgba(132,208,110,0.1)", color: "#84d06e" },
];
```

- Section id: "about"
- Header: "Who We Are" / "About MyWheels EV"
- Subtitle: "Hyderabad-based electric mobility company powering the people who keep the city moving."
- 3 feature cards with emoji icons, colored backgrounds

### 6.8 WhyElectric.tsx

```tsx
const bullets = [
  { icon: "💸", title: "Save ₹300–₹500 Daily on Fuel", desc: "Electric vehicles drastically cut your daily running costs compared to petrol bikes." },
  { icon: "🔧", title: "Low Maintenance Cost", desc: "Fewer moving parts mean fewer breakdowns and lower repair expenses." },
  { icon: "🏛️", title: "Government-Backed EV Push", desc: "Take advantage of government subsidies and policies promoting electric mobility." },
  { icon: "🌱", title: "Eco-Friendly & Future-Ready", desc: "Reduce your carbon footprint and be part of India's green transportation revolution." },
];
```

- Left side: "Go Electric" card with stats (₹500 daily savings, 100+ KM range)
- Right side: 4 bullet points with emoji icons

### 6.9 HowItWorks.tsx

```tsx
const steps = [
  { icon: "📝", title: "Register", desc: "Contact us or walk in to get started." },
  { icon: "✅", title: "KYC Verification", desc: "Submit ID proof for quick approval." },
  { icon: "📋", title: "Choose Plan", desc: "Pick weekly, monthly, or long-term." },
  { icon: "🛵", title: "Vehicle Allocation", desc: "Collect your EV from our hub." },
  { icon: "💰", title: "Start Earning", desc: "Hit the road and maximize income." },
];
```

- 5-step horizontal flow with connecting line and glowing dots (desktop)
- Cards with step numbers

### 6.10 EarningsComparison.tsx

**Fuel Bike column:**
- Daily fuel cost: ₹250–₹400
- Maintenance/month: ₹1,500–₹2,500
- Monthly expense: ₹10,000–₹15,000
- Message: "❌ Higher expenses = Lower take-home income"

**MyWheels EV column:**
- Daily charging cost: ₹30–₹50
- Maintenance: Included
- Monthly rental: ₹4,999/month
- Message: "✅ Save ₹5,000–₹10,000 every month!"

### 6.11 PricingCard.tsx

```tsx
interface PricingCardProps {
  title: string;
  price: string;
  period?: string;      // default "/day"
  featured?: boolean;   // default false
  features?: string[];  // default []
  tag?: string;
}
```

**Pricing plans data (from Home.tsx):**

| Plan     | Price  | Period  | Featured | Tag                        |
|----------|--------|---------|----------|----------------------------|
| Weekly   | 1,499  | /week   | No       | —                          |
| Monthly  | 4,999  | /month  | Yes      | Best for Full-Time Riders  |
| Daily    | 249    | /day    | No       | —                          |

- Featured card: blue bg, "Most Popular" badge, scaled up
- CTA: "Get Started" → tel:+919121969734

### 6.12 Testimonials.tsx

```tsx
const testimonials = [
  { name: "Ravi Kumar", location: "Ameerpet, Hyderabad", quote: "Switched to MyWheels EV 3 months ago. I save over ₹400 daily on fuel and the vehicle never lets me down during peak orders.", initials: "RK", color: "from-primary to-secondary" },
  { name: "Syed Imran", location: "Kukatpally, Hyderabad", quote: "The support team is just one call away. Had a minor issue once and they resolved it within an hour. Best EV rental service in the city!", initials: "SI", color: "from-tertiary to-teal" },
  { name: "Priya Sharma", location: "Madhapur, Hyderabad", quote: "As a woman delivery partner, I feel safe with the reliable EV. Low cost, zero breakdowns, and I'm earning more than ever before.", initials: "PS", color: "from-green to-mint" },
];
```

- 5-star rating on each card
- Quote icon, avatar with gradient initials

### 6.13 FAQ.tsx

```tsx
const faqs = [
  { q: "Do I need my own license?", a: "Yes, you need a valid two-wheeler driving license to rent an EV from MyWheels. This is mandatory for KYC verification and legal compliance." },
  { q: "What documents are required?", a: "You'll need your Aadhaar card, driving license, one passport-size photo, and a current address proof. The verification process is quick and simple." },
  { q: "How fast is vehicle allocation?", a: "Once your KYC is approved, vehicle allocation typically happens within 24–48 hours. In most cases, you can start riding the same day!" },
  { q: "Is maintenance included?", a: "Yes! All regular maintenance and servicing is handled by our team at no extra cost. You just ride and earn — we take care of the rest." },
  { q: "What if the vehicle breaks down?", a: "Our local support team in Hyderabad is available to assist you. Call us and we'll arrange roadside assistance or a replacement vehicle as quickly as possible." },
];
```

- Accordion with open/close toggle (+ rotates 45° to ×)
- Section id: "faq"

### 6.14 ContactUs.tsx

**Contact info:**
- Address: Plot no. 6, Sundarnagar, Hyderabad – 500038
- Phone: +91 91219 69734
- Email: contactus@mywheelsev.com

**Features:**
- 3 contact cards (address, phone, email)
- WhatsApp CTA button
- Embedded Google Map iframe (Sundarnagar, Hyderabad coordinates: 17.4375, 78.4447)

### 6.15 CTAStrip.tsx

- Headline: "Ready to Start Earning Today?"
- Subtitle: "Join hundreds of delivery partners in Hyderabad. Choose a plan and get on the road in minutes."
- CTAs: "View Plans" → #pricing, "WhatsApp Us" → wa.me link
- Gradient background: primary → secondary → tertiary

### 6.16 Footer.tsx

**Quick Links:** Home, About, Pricing, FAQ, Contact
**Legal Links:** Privacy Policy, Terms of Service (both # placeholder)
**Social Links:** WhatsApp (wa.me/919121969734), Instagram (#), LinkedIn (#)
**Tagline:** "Powering Hyderabad's Mobility Future"
**Copyright:** © {year} MyWheels EV Pvt Ltd. All rights reserved.

### 6.17 BackToTop.tsx

- Floating button, bottom-right (bottom-6 right-6)
- Shows after 300px scroll
- Smooth scroll to top
- Up arrow SVG icon

### 6.18 WhatsAppButton.tsx

- Floating button, bottom-right offset (bottom-6 right-20)
- Links to: `wa.me/919121969734?text=Hi%2C%20I%27m%20interested%20in%20renting%20an%20EV%20from%20MyWheels.`
- Green (#25D366) with pulse-glow animation
- WhatsApp SVG icon

### 6.19 Section.tsx (Reusable Wrapper)

```tsx
interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  tightTop?: boolean;
  variant?: "default" | "light" | "tint";
}
```

- Variants: default (no bg), light (bg-white), tint (bg-primary/[0.04])
- Centered title + divider line + subtitle pattern
- Max width 7xl, responsive padding

---

## 7. External Links & Contact Data

| Type      | Value                                                                 |
|-----------|-----------------------------------------------------------------------|
| Phone     | +91 91219 69734                                                       |
| Email     | contactus@mywheelsev.com                                              |
| WhatsApp  | wa.me/919121969734                                                    |
| Address   | Plot no. 6, Sundarnagar, Hyderabad – 500038                          |
| Map       | 17.4375, 78.4447 (Google Maps embed)                                 |

---

## 8. Assets Required

| Asset             | Format | Location          | Usage                    |
|-------------------|--------|-------------------|--------------------------|
| home-bg.webp      | WebP   | public/           | Hero background + image  |
| mywheels-ev.webp  | WebP   | public/           | Logo in navbar           |

---

## 9. Vite Config

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/',
  plugins: [react()],
})
```

---

## 10. Tailwind Config (Full)

```js
/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#184cba",
        secondary: "#1a70c3",
        tertiary: "#2994bf",
        dark: "#141c6c",
        darkAlt: "#1c298b",
        teal: "#40b1af",
        green: "#84d06e",
        mint: "#61c194",
        olive: "#7aad4f",
        bg: "#f8fafc",
        card: "#ffffff",
        textMain: "#141c6c",
        muted: "#374151",
        mutedLight: "#6b7280",
        accent: "#84d06e",
        footerBg: "#141c6c",
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(24,76,186,0.4)" },
          "50%": { boxShadow: "0 0 20px 6px rgba(24,76,186,0.15)" },
        },
        "slide-in-left": {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "soft-glow": {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.08)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.7s ease-out forwards",
        "fade-in": "fade-in 0.7s ease-out forwards",
        float: "float 5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "slide-in-left": "slide-in-left 0.6s ease-out forwards",
        "slide-in-right": "slide-in-right 0.6s ease-out forwards",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "soft-glow": "soft-glow 4s ease-in-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-gradient":
          "linear-gradient(135deg, #141c6c 0%, #1c298b 25%, #184cba 50%, #1a70c3 75%, #2994bf 100%)",
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 11. CSS (index.css — Full)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
}

body {
  background-color: #f8fafc;
  font-family: "Manrope", sans-serif;
  font-weight: 400;
  line-height: 1.7;
  color: #374151;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Manrope", sans-serif;
  color: #141c6c;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

h1 { font-weight: 700; letter-spacing: -0.03em; }
h2 { font-weight: 600; }
h3, h4 { font-weight: 600; letter-spacing: -0.01em; }

a { text-decoration: none; color: inherit; }

::selection {
  background-color: rgba(24, 76, 186, 0.15);
  color: #141c6c;
}

.parallax-bg {
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

.bg-grid-pattern {
  background-image:
    linear-gradient(rgba(255, 255, 255, .03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, .03) 1px, transparent 1px);
  background-size: 48px 48px;
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal-delay-1 { transition-delay: 0.08s; }
.scroll-reveal-delay-2 { transition-delay: 0.16s; }
.scroll-reveal-delay-3 { transition-delay: 0.24s; }
.scroll-reveal-delay-4 { transition-delay: 0.32s; }
.scroll-reveal-delay-5 { transition-delay: 0.40s; }
```

---

## 12. useScrollReveal Hook (Full)

```ts
import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const children = el.querySelectorAll(".scroll-reveal");
    children.forEach((child) => observer.observe(child));
    if (el.classList.contains("scroll-reveal")) observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return ref;
}
```

---

## 13. package.json (Web)

```json
{
  "name": "mywheels-ev",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "gh-pages": "^4.0.0",
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```
vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.13.0"
  },
  "devDependencies": {
    "gh-pages": "^4.0.0",
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.1",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react-swc": "^4.2.2",
    "autoprefixer": "^10.4.24",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.19",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.48.0",
    "vite": "^7.3.1"
  }
}
```

---

## 14. FULL Component Source Code (Previously Abbreviated)

The sections above extracted key data. Below are the complete render JSX for every component to ensure nothing is lost.

### 14.1 Navbar.tsx — Full Render JSX

```tsx
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#", scrollTop: true },
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const SECTION_IDS = ["about", "how", "pricing", "faq", "contact"] as const;
const ACTIVE_OFFSET = 150;

function getActiveSection(): string {
  let active = "";
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (rect.top <= ACTIVE_OFFSET) active = "#" + id;
  }
  return active;
}

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setActiveHash(getActiveSection());
      setScrolled(window.scrollY > 20);
    };
    const onHashChange = () => setActiveHash(window.location.hash || getActiveSection());
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setActiveHash("");
    setOpen(false);
  };

  const closeMenu = () => setOpen(false);

  const isActive = (link: (typeof navLinks)[0]) =>
    link.scrollTop ? activeHash === "" || activeHash === "#" : activeHash === link.href;

  const linkClass = (link: (typeof navLinks)[0]) => {
    const active = isActive(link);
    return `px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${active
      ? "text-primary bg-primary/10"
      : scrolled
        ? "text-dark hover:text-primary hover:bg-primary/5"
        : "text-white/90 hover:text-white hover:bg-white/10"
      }`;
  };

  const mobileLinkClass = (link: (typeof navLinks)[0]) =>
    `block py-3 px-4 rounded-xl font-medium transition-colors ${link.scrollTop ? "w-full text-left" : ""
    } ${isActive(link) ? "text-primary bg-primary/10" : "text-dark hover:bg-primary/5 hover:text-primary"}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-white/95 backdrop-blur-lg border-b border-gray-200/80 shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="px-6 md:px-[60px] py-2 md:py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <button type="button" onClick={scrollToTop} className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary/30 rounded-xl">
            <img
              src={`${import.meta.env.BASE_URL}mywheels-ev.webp`}
              alt="MyWheels EV"
              className={`h-10 md:h-14 transition-all duration-300 ${scrolled ? "" : "brightness-0 invert"}`}
            />
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) =>
              link.scrollTop ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => { scrollToTop(); closeMenu(); }}
                  className={linkClass(link)}
                >
                  {link.label}
                </button>
              ) : (
                <a key={link.href} href={link.href} className={linkClass(link)}>
                  {link.label}
                </a>
              )
            )}
          </nav>

          <button
            type="button"
            className={`md:hidden p-2 text-2xl rounded-xl transition-colors ${scrolled ? "text-dark hover:bg-gray-100" : "text-white hover:bg-white/10"}`}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {open && (
          <nav className="md:hidden mt-3 pt-3 pb-2 border-t border-gray-200 space-y-1 bg-white rounded-2xl px-2">
            {navLinks.map((link) =>
              link.scrollTop ? (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => { scrollToTop(); closeMenu(); }}
                  className={mobileLinkClass(link)}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={mobileLinkClass(link)}
                >
                  {link.label}
                </a>
              )
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
```

### 14.2 About.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

export default function About() {
  const ref = useScrollReveal();

  return (
    <section id="about" className="bg-white">
      <div ref={ref} className="px-6 md:px-[60px] mx-auto max-w-7xl py-28 md:py-32">
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-[13px] uppercase tracking-[0.25em] mb-3 scroll-reveal">
            Who We Are
          </p>
          <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em] scroll-reveal scroll-reveal-delay-1">
            About <span className="text-primary">MyWheels EV</span>
          </h2>
          <div className="mt-5 w-12 h-[3px] rounded-full bg-primary mx-auto scroll-reveal scroll-reveal-delay-2" aria-hidden />
          <p className="mt-6 text-[17px] text-muted max-w-2xl mx-auto leading-[1.7] scroll-reveal scroll-reveal-delay-3">
            Hyderabad-based electric mobility company powering the people who keep the city moving. Affordable rentals, rapid support, and maximum uptime.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "⚡", title: "High Uptime", desc: "Vehicles that are always ready when you are. We keep you on the road earning, not waiting.", bg: "rgba(24,76,186,0.1)", color: "#184cba" },
            { icon: "💰", title: "Cost Efficiency", desc: "Save ₹300–₹500 daily compared to fuel bikes. Maximize your take-home income every month.", bg: "rgba(64,177,175,0.1)", color: "#40b1af" },
            { icon: "🛠", title: "Rapid Local Support", desc: "On-ground assistance in Hyderabad that minimizes downtime. We're just a call away.", bg: "rgba(132,208,110,0.1)", color: "#84d06e" },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`scroll-reveal scroll-reveal-delay-${i + 1} bg-white p-12 rounded-3xl shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(24,76,186,0.12)] hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 group`}
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-7 group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: item.bg, color: item.color }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-dark mb-3">{item.title}</h3>
              <p className="text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```


### 14.3 WhyElectric.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const bullets = [
  { icon: "💸", title: "Save ₹300–₹500 Daily on Fuel", desc: "Electric vehicles drastically cut your daily running costs compared to petrol bikes." },
  { icon: "🔧", title: "Low Maintenance Cost", desc: "Fewer moving parts mean fewer breakdowns and lower repair expenses." },
  { icon: "🏛️", title: "Government-Backed EV Push", desc: "Take advantage of government subsidies and policies promoting electric mobility." },
  { icon: "🌱", title: "Eco-Friendly & Future-Ready", desc: "Reduce your carbon footprint and be part of India's green transportation revolution." },
];

const WhyElectric: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-tertiary/[0.03]" aria-hidden />
      <div ref={ref} className="relative px-6 md:px-[60px] mx-auto max-w-7xl py-28 md:py-32">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="scroll-reveal flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/40 via-tertiary/30 to-green/20 rounded-[2rem] blur-[1px]" aria-hidden />
              <div className="relative bg-white rounded-[2rem] p-10 md:p-14 text-center shadow-[0_8px_40px_rgba(24,76,186,0.08)]">
                <div className="text-8xl mb-6">🔋</div>
                <h3 className="text-2xl font-bold text-dark mb-3">Go Electric</h3>
                <p className="text-muted text-lg leading-relaxed">Save more, earn more, ride cleaner.</p>
                <div className="mt-8 grid grid-cols-2 gap-5">
                  <div className="bg-primary/[0.06] rounded-2xl p-5 border border-primary/10">
                    <p className="text-3xl font-extrabold text-primary">₹500</p>
                    <p className="text-mutedLight text-sm mt-1">Daily savings</p>
                  </div>
                  <div className="bg-tertiary/[0.06] rounded-2xl p-5 border border-tertiary/10">
                    <p className="text-3xl font-extrabold text-tertiary">100+</p>
                    <p className="text-mutedLight text-sm mt-1">KM range</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-primary font-semibold text-[13px] uppercase tracking-[0.25em] mb-3 scroll-reveal">
              Why Go Electric?
            </p>
            <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em] mb-10 scroll-reveal scroll-reveal-delay-1">
              Switch to <span className="text-primary">Electric</span> & Earn More
            </h2>
            <div className="space-y-8">
              {bullets.map((b, i) => (
                <div key={b.title} className={`scroll-reveal scroll-reveal-delay-${i + 1} flex items-start gap-5 group`}>
                  <div className="w-14 h-14 rounded-2xl bg-primary/[0.08] flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/[0.12] transition-all duration-300">
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-dark text-lg mb-1.5">{b.title}</h4>
                    <p className="text-muted leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyElectric;
```

### 14.4 Section.tsx — Full Source

```tsx
interface SectionProps {
  id: string;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  tightTop?: boolean;
  variant?: "default" | "light" | "tint";
}

const Section: React.FC<SectionProps> = ({
  id, title, subtitle, children, className = "", tightTop = false, variant = "default",
}) => {
  let variantBg = "";
  if (variant === "light") variantBg = "bg-white";
  else if (variant === "tint") variantBg = "bg-primary/[0.04]";

  return (
    <section id={id} className={variantBg}>
      <div className={`px-6 md:px-[60px] mx-auto max-w-7xl ${tightTop ? "pt-4 md:pt-8 pb-28 md:pb-32" : "py-28 md:py-32"} ${className}`}>
        {title && (
          <div className="text-center mb-14 md:mb-16">
            <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em]">
              {title}
            </h2>
            <div className="mt-5 w-12 h-[3px] rounded-full bg-primary mx-auto" aria-hidden />
            {subtitle ? (
              <p className="mt-5 text-muted text-[17px] max-w-2xl mx-auto leading-[1.7]">{subtitle}</p>
            ) : (
              <div className="mt-5" />
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
```

### 14.5 HowItWorks.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const steps = [
  { icon: "📝", title: "Register", desc: "Contact us or walk in to get started." },
  { icon: "✅", title: "KYC Verification", desc: "Submit ID proof for quick approval." },
  { icon: "📋", title: "Choose Plan", desc: "Pick weekly, monthly, or long-term." },
  { icon: "🛵", title: "Vehicle Allocation", desc: "Collect your EV from our hub." },
  { icon: "💰", title: "Start Earning", desc: "Hit the road and maximize income." },
];

const HowItWorks: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <div ref={ref} className="relative">
      <div className="hidden md:block absolute top-[56px] left-[10%] right-[10%] z-0">
        <div className="h-[2px] bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 w-full" />
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_3px_rgba(24,76,186,0.3)]"
            style={{ left: `${i * 25}%` }}
          />
        ))}
      </div>
      <div className="grid md:grid-cols-5 gap-10 md:gap-6">
        {steps.map((step, i) => (
          <div key={step.title} className={`scroll-reveal scroll-reveal-delay-${i + 1} relative flex flex-col`}>
            <div className="relative z-10 flex flex-col flex-1 bg-white rounded-3xl p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(24,76,186,0.12)] hover:border-primary/30 hover:-translate-y-1.5 transition-all duration-300 group text-center">
              <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl bg-primary/[0.08] text-4xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 group-hover:bg-primary/[0.12] transition-all duration-300">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-primary/50 uppercase tracking-widest mb-2">
                Step {i + 1}
              </span>
              <h3 className="font-bold text-lg text-dark mb-2">{step.title}</h3>
              <p className="text-muted text-sm leading-relaxed flex-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
```

### 14.6 EarningsComparison.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const EarningsComparison: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section className="bg-gray-50">
      <div ref={ref} className="px-6 md:px-[60px] mx-auto max-w-7xl py-28 md:py-32">
        <div className="text-center mb-14 md:mb-16">
          <p className="text-primary font-semibold text-[13px] uppercase tracking-[0.25em] mb-3 scroll-reveal">Earnings Breakdown</p>
          <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em] scroll-reveal scroll-reveal-delay-1">
            Maximize Your <span className="text-primary">Monthly Earnings</span>
          </h2>
          <div className="mt-5 w-12 h-[3px] rounded-full bg-primary mx-auto scroll-reveal scroll-reveal-delay-2" aria-hidden />
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Fuel Bike */}
          <div className="scroll-reveal scroll-reveal-delay-1 bg-white rounded-3xl p-10 border border-gray-200 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-400 to-orange-400" />
            <div className="text-5xl mb-5">⛽</div>
            <h3 className="text-2xl font-bold text-red-500 mb-6">Fuel Bike</h3>
            <div className="space-y-4">
              {[
                { label: "Daily fuel cost", value: "₹250–₹400" },
                { label: "Maintenance/month", value: "₹1,500–₹2,500" },
                { label: "Monthly expense", value: "₹10,000–₹15,000" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-semibold text-red-500">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100">
              <p className="text-sm text-red-600 font-medium text-center">❌ Higher expenses = Lower take-home income</p>
            </div>
          </div>
          {/* MyWheels EV */}
          <div className="scroll-reveal scroll-reveal-delay-2 bg-white rounded-3xl p-10 border-2 border-primary/20 relative overflow-hidden shadow-[0_8px_40px_rgba(24,76,186,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-green" />
            <div className="text-5xl mb-5">⚡</div>
            <h3 className="text-2xl font-bold text-primary mb-6">MyWheels EV</h3>
            <div className="space-y-4">
              {[
                { label: "Daily charging cost", value: "₹30–₹50" },
                { label: "Maintenance", value: "Included" },
                { label: "Monthly rental", value: "₹4,999/month" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-3 border-b border-primary/10 last:border-0">
                  <span className="text-muted">{item.label}</span>
                  <span className="font-semibold text-primary">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-green/10 rounded-2xl border border-green/20">
              <p className="text-lg text-dark font-bold text-center">✅ Save ₹5,000–₹10,000 <span className="text-primary">every month!</span></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EarningsComparison;
```

### 14.7 PricingCard.tsx — Full Source

```tsx
interface PricingCardProps {
  title: string;
  price: string;
  period?: string;
  featured?: boolean;
  features?: string[];
  tag?: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title, price, period = "/day", featured = false, features = [], tag,
}) => {
  return (
    <div
      className={`relative rounded-3xl text-center transition-all duration-300 ${featured
          ? "bg-primary text-white shadow-[0_20px_60px_-12px_rgba(24,76,186,0.35)] md:scale-[1.06] border-2 border-primary z-10 hover:md:scale-[1.09] hover:shadow-[0_30px_70px_-12px_rgba(24,76,186,0.45)] p-12"
          : "bg-white shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(24,76,186,0.12)] hover:border-primary/40 hover:md:scale-[1.03] hover:-translate-y-1 p-10"
        }`}
    >
      {featured && (
        <div className="mb-5 inline-block px-5 py-1.5 rounded-full bg-green text-dark text-xs font-bold uppercase tracking-wider">Most Popular</div>
      )}
      {tag && (
        <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${featured ? "text-white/70" : "text-primary/60"}`}>{tag}</p>
      )}
      <h3 className={`font-bold text-xl mb-2 ${featured ? "text-white" : "text-dark"}`}>{title}</h3>
      <div className={`text-5xl font-extrabold mt-4 ${featured ? "text-white" : "text-primary"}`}>
        {price === "—" ? (
          <span className="text-lg font-semibold">Contact for pricing</span>
        ) : (
          <>₹{price}<span className="text-lg font-normal opacity-70">{period}</span></>
        )}
      </div>
      <ul className="mt-8 space-y-3 text-left">
        {features.map((f) => (
          <li key={f} className={`flex items-start gap-3 text-sm leading-relaxed ${featured ? "text-white/90" : "text-muted"}`}>
            <span className="mt-0.5 flex-shrink-0 text-green">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <a
        href="tel:+919121969734"
        className={`mt-10 inline-block w-full py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg ${featured
            ? "bg-white text-primary hover:bg-gray-50"
            : "bg-primary text-white hover:bg-primary/90"
          }`}
      >
        Get Started
      </a>
    </div>
  );
};

export default PricingCard;
```


### 14.8 Testimonials.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const testimonials = [
  {
    name: "Ravi Kumar",
    location: "Ameerpet, Hyderabad",
    quote: "Switched to MyWheels EV 3 months ago. I save over ₹400 daily on fuel and the vehicle never lets me down during peak orders.",
    initials: "RK",
    color: "from-primary to-secondary",
  },
  {
    name: "Syed Imran",
    location: "Kukatpally, Hyderabad",
    quote: "The support team is just one call away. Had a minor issue once and they resolved it within an hour. Best EV rental service in the city!",
    initials: "SI",
    color: "from-tertiary to-teal",
  },
  {
    name: "Priya Sharma",
    location: "Madhapur, Hyderabad",
    quote: "As a woman delivery partner, I feel safe with the reliable EV. Low cost, zero breakdowns, and I'm earning more than ever before.",
    initials: "PS",
    color: "from-green to-mint",
  },
];

const StarRating = () => (
  <div className="flex gap-1 mb-4">
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

const Testimonials: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section className="bg-gradient-to-b from-primary/[0.04] to-primary/[0.08]">
      <div ref={ref} className="px-6 md:px-[60px] mx-auto max-w-7xl py-28 md:py-32">
        <div className="text-center mb-14 md:mb-16">
          <p className="text-primary font-semibold text-[13px] uppercase tracking-[0.25em] mb-3 scroll-reveal">What Riders Say</p>
          <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em] scroll-reveal scroll-reveal-delay-1">
            Trusted by <span className="text-primary">Delivery Heroes</span>
          </h2>
          <div className="mt-5 w-12 h-[3px] rounded-full bg-primary mx-auto scroll-reveal scroll-reveal-delay-2" aria-hidden />
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`scroll-reveal scroll-reveal-delay-${i + 1} bg-white rounded-3xl p-10 shadow-[0_4px_32px_rgba(0,0,0,0.06)] border border-gray-100 hover:shadow-[0_12px_40px_rgba(24,76,186,0.12)] hover:-translate-y-1.5 transition-all duration-300`}>
              <StarRating />
              <div className="text-primary/15 text-6xl font-serif leading-none mb-3">"</div>
              <p className="text-muted leading-relaxed mb-8">{t.quote}</p>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-base shadow-lg`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-dark">{t.name}</p>
                  <p className="text-sm text-mutedLight">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
```


### 14.9 FAQ.tsx — Full Source

```tsx
import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";

const faqs = [
  { q: "Do I need my own license?", a: "Yes, you need a valid two-wheeler driving license to rent an EV from MyWheels. This is mandatory for KYC verification and legal compliance." },
  { q: "What documents are required?", a: "You'll need your Aadhaar card, driving license, one passport-size photo, and a current address proof. The verification process is quick and simple." },
  { q: "How fast is vehicle allocation?", a: "Once your KYC is approved, vehicle allocation typically happens within 24–48 hours. In most cases, you can start riding the same day!" },
  { q: "Is maintenance included?", a: "Yes! All regular maintenance and servicing is handled by our team at no extra cost. You just ride and earn — we take care of the rest." },
  { q: "What if the vehicle breaks down?", a: "Our local support team in Hyderabad is available to assist you. Call us and we'll arrange roadside assistance or a replacement vehicle as quickly as possible." },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useScrollReveal();

  return (
    <section id="faq" className="bg-white">
      <div ref={ref} className="px-6 md:px-[60px] mx-auto max-w-7xl py-28 md:py-32">
        <div className="text-center mb-14 md:mb-16">
          <p className="text-primary font-semibold text-[13px] uppercase tracking-[0.25em] mb-3 scroll-reveal">Got Questions?</p>
          <h2 className="text-[2rem] md:text-[2.25rem] lg:text-[2.5rem] font-semibold text-dark tracking-[-0.02em] scroll-reveal scroll-reveal-delay-1">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <div className="mt-5 w-12 h-[3px] rounded-full bg-primary mx-auto scroll-reveal scroll-reveal-delay-2" aria-hidden />
        </div>
        <div className="max-w-3xl mx-auto space-y-5">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className={`rounded-2xl border transition-colors duration-300 ${isOpen ? "border-primary/30 shadow-[0_8px_30px_rgba(24,76,186,0.1)] bg-white" : "border-gray-200 bg-gray-50 hover:border-primary/20 hover:bg-white"}`}>
                <button type="button" onClick={() => setOpenIndex(isOpen ? null : i)} className="w-full flex items-center justify-between px-7 md:px-8 py-6 text-left">
                  <span className={`font-semibold text-lg pr-4 transition-colors duration-200 ${isOpen ? "text-primary" : "text-dark"}`}>{faq.q}</span>
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 transition-all duration-300 ${isOpen ? "bg-primary text-white rotate-45" : "bg-gray-200 text-mutedLight rotate-0"}`}>+</span>
                </button>
                {isOpen && <p className="px-7 md:px-8 pb-6 text-muted leading-[1.7]">{faq.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
```


### 14.10 ContactUs.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const ContactSection: React.FC = () => {
  const ref = useScrollReveal();

  const items = [
    { label: "Address", value: "Plot no. 6, Sundarnagar, Hyderabad – 500038", icon: "📍" },
    { label: "Phone", value: "+91 91219 69734", icon: "📞", href: "tel:+919121969734" },
    { label: "Email", value: "contactus@mywheelsev.com", icon: "✉️", href: "mailto:contactus@mywheelsev.com" },
  ];

  return (
    <div ref={ref} className="max-w-5xl mx-auto">
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {items.map((item, i) => {
          const cardClass = `scroll-reveal scroll-reveal-delay-${i + 1} bg-white rounded-3xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100 text-center hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 block`;
          const content = (
            <>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-2xl mx-auto mb-4">{item.icon}</div>
              <p className="text-dark font-semibold text-lg">{item.label}</p>
              <p className="mt-2 text-muted leading-relaxed">{item.value}</p>
            </>
          );
          return item.href ? (
            <a key={item.label} href={item.href} className={cardClass}>{content}</a>
          ) : (
            <div key={item.label} className={cardClass}>{content}</div>
          );
        })}
      </div>
      <div className="scroll-reveal scroll-reveal-delay-4 text-center mb-10">
        <a href="https://wa.me/919121969734?text=Hi%2C%20I%27m%20interested%20in%20renting%20an%20EV%20from%20MyWheels." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white bg-[#25D366] hover:bg-[#1ebd5a] shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Chat on WhatsApp
        </a>
      </div>
      <div className="scroll-reveal scroll-reveal-delay-5 rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100">
        <iframe title="MyWheels EV Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.5!2d78.4447!3d17.4375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSundarnagar%2C+Hyderabad!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" width="100%" height="300" style={{ border: 0 }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      </div>
    </div>
  );
};

export default ContactSection;
```


### 14.11 CTAStrip.tsx — Full Source

```tsx
const CTAStrip: React.FC = () => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-tertiary" aria-hidden />
      <div className="absolute inset-0 bg-dark/20" aria-hidden />
      <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden />
      <div className="relative z-10 px-6 md:px-[60px] py-20 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-[2rem] md:text-[2.5rem] lg:text-[2.75rem] font-semibold text-white tracking-[-0.02em] mb-5">
            Ready to Start Earning Today?
          </h2>
          <p className="text-white/75 text-[17px] md:text-lg mb-10 leading-[1.7]">
            Join hundreds of delivery partners in Hyderabad. Choose a plan and get on the road in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#pricing" className="inline-flex items-center justify-center px-10 py-4 rounded-2xl font-semibold text-primary bg-white hover:bg-gray-50 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
              View Plans
            </a>
            <a href="https://wa.me/919121969734?text=Hi%2C%20I%27m%20interested%20in%20renting%20an%20EV." target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl font-semibold text-white border-2 border-white/70 hover:bg-white/15 transition-all duration-300 hover:scale-105">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTAStrip;
```


### 14.12 Footer.tsx — Full Source

```tsx
export default function Footer() {
  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "About", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ];

  return (
    <footer className="bg-dark text-white">
      <div className="px-6 md:px-[60px] py-16 md:py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-3">MyWheels EV</h3>
            <p className="text-white/70 leading-relaxed max-w-sm mb-6">
              Powering Hyderabad's Mobility Future. Affordable electric two-wheeler rentals built for delivery heroes.
            </p>
            <div className="flex gap-3">
              <a href="https://wa.me/919121969734" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#25D366] flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#0077B5] flex items-center justify-center transition-all duration-300 hover:scale-110" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-white transition-colors duration-200 text-sm">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-sm">© {new Date().getFullYear()} MyWheels EV Pvt Ltd. All rights reserved.</p>
          <p className="text-white/40 text-sm italic">Powering Hyderabad's Mobility Future</p>
        </div>
      </div>
    </footer>
  );
}
```


### 14.13 TrustSection.tsx — Full Source

```tsx
import { useScrollReveal } from "../hooks/useScrollReveal";

const brands = [
  {
    name: "Swiggy",
    logo: (
      <svg viewBox="0 0 120 30" className="h-8 md:h-10 w-auto" fill="currentColor">
        <text x="0" y="24" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="28" fill="#FC8019">Swiggy</text>
      </svg>
    ),
    color: "#FC8019",
  },
  {
    name: "Zomato",
    logo: (
      <svg viewBox="0 0 130 30" className="h-8 md:h-10 w-auto" fill="currentColor">
        <text x="0" y="24" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="28" fill="#E23744">zomato</text>
      </svg>
    ),
    color: "#E23744",
  },
  {
    name: "Blinkit",
    logo: (
      <svg viewBox="0 0 120 30" className="h-8 md:h-10 w-auto" fill="currentColor">
        <text x="0" y="24" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="28" fill="#F7C600">blinkit</text>
      </svg>
    ),
    color: "#F7C600",
  },
  {
    name: "Zepto",
    logo: (
      <svg viewBox="0 0 110 30" className="h-8 md:h-10 w-auto" fill="currentColor">
        <text x="0" y="24" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="28" fill="#7B2D8E">zepto</text>
      </svg>
    ),
    color: "#7B2D8E",
  },
  {
    name: "Amazon",
    logo: (
      <svg viewBox="0 0 140 30" className="h-8 md:h-10 w-auto" fill="currentColor">
        <text x="0" y="24" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="28" fill="#FF9900">amazon</text>
      </svg>
    ),
    color: "#FF9900",
  },
];

const TrustSection: React.FC = () => {
  const ref = useScrollReveal();

  return (
    <section id="trust" className="bg-white border-b border-gray-100">
      <div ref={ref} className="px-6 md:px-[60px] mx-auto max-w-7xl py-14 md:py-18">
        <p className="text-center text-mutedLight font-medium text-sm uppercase tracking-[0.2em] mb-10 scroll-reveal">
          Used by Delivery Partners Working With
        </p>
        <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
          {brands.map((brand, i) => (
            <div key={brand.name} className={`scroll-reveal scroll-reveal-delay-${i + 1} opacity-75`}>
              {brand.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
```

### 14.14 BackToTop.tsx — Full Source

```tsx
import { useState, useEffect } from "react";

const SCROLL_THRESHOLD = 300;

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 hover:scale-110"
      aria-label="Back to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
        <path fillRule="evenodd" d="M11.47 4.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 6.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5z" clipRule="evenodd" />
      </svg>
    </button>
  );
};

export default BackToTop;
```


### 14.15 WhatsAppButton.tsx — Full Source

```tsx
const WhatsAppButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/919121969734?text=Hi%2C%20I%27m%20interested%20in%20renting%20an%20EV%20from%20MyWheels."
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-20 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:bg-[#1ebd5a] hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 transition-all duration-300 animate-pulse-glow"
      aria-label="Chat on WhatsApp"
    >
      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
```

---

## END OF DOCUMENT

This document contains the complete source code and all data from every file in the `github.com/karan-singare/mywheels-ev` web repository. No information has been omitted.

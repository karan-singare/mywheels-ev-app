// ─── Type Definitions ────────────────────────────────────────────────────────

export interface TrustBrand {
  name: string;
  color: string;
}

export interface AboutFeature {
  icon: string;
  title: string;
  desc: string;
  bg: string;
  color: string;
}

export interface WhyElectricStat {
  value: string;
  label: string;
}

export interface WhyElectricBullet {
  icon: string;
  title: string;
  desc: string;
}

export interface HowItWorksStep {
  icon: string;
  title: string;
  desc: string;
}

export interface EarningsRow {
  label: string;
  value: string;
}

export interface EarningsColumn {
  icon: string;
  title: string;
  titleColor: string;
  rows: EarningsRow[];
  message: string;
  isPositive: boolean;
}

export interface Testimonial {
  name: string;
  location: string;
  quote: string;
  initials: string;
  gradient: string;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsappNumber: string;
  mapCoordinates: { lat: number; lng: number };
}

export interface ContactCard {
  label: string;
  value: string;
  icon: string;
}

export interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  featured: boolean;
  tag?: string;
}

// ─── Hero ────────────────────────────────────────────────────────────────────

export const HERO = {
  tagline: 'Electric Mobility · Hyderabad',
  headline: "We Power Hyderabad's Delivery Heroes ⚡",
  subtitle:
    'Reliable electric two-wheelers built for gig workers who want zero downtime and higher earnings.',
  ctaPrimary: 'View Plans',
  ctaSecondary: 'Contact Us',
} as const;

// ─── Trust Brands ────────────────────────────────────────────────────────────

export const TRUST_LABEL = 'Used by Delivery Partners Working With';

export const TRUST_BRANDS: TrustBrand[] = [
  { name: 'Swiggy', color: '#FC8019' },
  { name: 'Zomato', color: '#E23744' },
  { name: 'Blinkit', color: '#F7C600' },
  { name: 'Zepto', color: '#7B2D8E' },
  { name: 'Amazon', color: '#FF9900' },
];

// ─── About ───────────────────────────────────────────────────────────────────

export const ABOUT_HEADER = {
  label: 'Who We Are',
  title: 'About MyWheels EV',
  subtitle:
    'Hyderabad-based electric mobility company powering the people who keep the city moving. Affordable rentals, rapid support, and maximum uptime.',
} as const;

export const ABOUT_FEATURES: AboutFeature[] = [
  {
    icon: '⚡',
    title: 'High Uptime',
    desc: 'Vehicles that are always ready when you are. We keep you on the road earning, not waiting.',
    bg: 'rgba(24,76,186,0.1)',
    color: '#184cba',
  },
  {
    icon: '💰',
    title: 'Cost Efficiency',
    desc: 'Save ₹300–₹500 daily compared to fuel bikes. Maximize your take-home income every month.',
    bg: 'rgba(64,177,175,0.1)',
    color: '#40b1af',
  },
  {
    icon: '🛠',
    title: 'Rapid Local Support',
    desc: "On-ground assistance in Hyderabad that minimizes downtime. We're just a call away.",
    bg: 'rgba(132,208,110,0.1)',
    color: '#84d06e',
  },
];

// ─── Why Electric ────────────────────────────────────────────────────────────

export const WHY_ELECTRIC_HEADER = {
  label: 'Why Go Electric?',
  title: 'Switch to Electric & Earn More',
} as const;

export const WHY_ELECTRIC_CARD = {
  icon: '🔋',
  title: 'Go Electric',
  subtitle: 'Save more, earn more, ride cleaner.',
} as const;

export const WHY_ELECTRIC_STATS: WhyElectricStat[] = [
  { value: '₹500', label: 'Daily savings' },
  { value: '100+', label: 'KM range' },
];

export const WHY_ELECTRIC_BULLETS: WhyElectricBullet[] = [
  {
    icon: '💸',
    title: 'Save ₹300–₹500 Daily on Fuel',
    desc: 'Electric vehicles drastically cut your daily running costs compared to petrol bikes.',
  },
  {
    icon: '🔧',
    title: 'Low Maintenance Cost',
    desc: 'Fewer moving parts mean fewer breakdowns and lower repair expenses.',
  },
  {
    icon: '🏛️',
    title: 'Government-Backed EV Push',
    desc: 'Take advantage of government subsidies and policies promoting electric mobility.',
  },
  {
    icon: '🌱',
    title: 'Eco-Friendly & Future-Ready',
    desc: "Reduce your carbon footprint and be part of India's green transportation revolution.",
  },
];

// ─── How It Works ────────────────────────────────────────────────────────────

export const HOW_IT_WORKS_HEADER = {
  title: 'How It Works',
  subtitle:
    'Register, verify, choose your plan, and start earning — simple and fast.',
} as const;

export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  { icon: '📝', title: 'Register', desc: 'Contact us or walk in to get started.' },
  { icon: '✅', title: 'KYC Verification', desc: 'Submit ID proof for quick approval.' },
  { icon: '📋', title: 'Choose Plan', desc: 'Pick weekly, monthly, or long-term.' },
  { icon: '🛵', title: 'Vehicle Allocation', desc: 'Collect your EV from our hub.' },
  { icon: '💰', title: 'Start Earning', desc: 'Hit the road and maximize income.' },
];

// ─── Earnings Comparison ─────────────────────────────────────────────────────

export const EARNINGS_HEADER = {
  label: 'Earnings Breakdown',
  title: 'Maximize Your Monthly Earnings',
} as const;

export const EARNINGS_FUEL: EarningsColumn = {
  icon: '⛽',
  title: 'Fuel Bike',
  titleColor: '#ef4444',
  rows: [
    { label: 'Daily fuel cost', value: '₹250–₹400' },
    { label: 'Maintenance/month', value: '₹1,500–₹2,500' },
    { label: 'Monthly expense', value: '₹10,000–₹15,000' },
  ],
  message: '❌ Higher expenses = Lower take-home income',
  isPositive: false,
};

export const EARNINGS_EV: EarningsColumn = {
  icon: '⚡',
  title: 'MyWheels EV',
  titleColor: '#184cba',
  rows: [
    { label: 'Daily charging cost', value: '₹30–₹50' },
    { label: 'Maintenance', value: 'Included' },
    { label: 'Monthly rental', value: '₹4,999/month' },
  ],
  message: '✅ Save ₹5,000–₹10,000 every month!',
  isPositive: true,
};

// ─── Testimonials ────────────────────────────────────────────────────────────

export const TESTIMONIALS_HEADER = {
  label: 'What Riders Say',
  title: 'Trusted by Delivery Heroes',
} as const;

export const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Ravi Kumar',
    location: 'Ameerpet, Hyderabad',
    quote:
      'Switched to MyWheels EV 3 months ago. I save over ₹400 daily on fuel and the vehicle never lets me down during peak orders.',
    initials: 'RK',
    gradient: 'from-primary to-secondary',
  },
  {
    name: 'Syed Imran',
    location: 'Kukatpally, Hyderabad',
    quote:
      'The support team is just one call away. Had a minor issue once and they resolved it within an hour. Best EV rental service in the city!',
    initials: 'SI',
    gradient: 'from-tertiary to-teal',
  },
  {
    name: 'Priya Sharma',
    location: 'Madhapur, Hyderabad',
    quote:
      'As a woman delivery partner, I feel safe with the reliable EV. Low cost, zero breakdowns, and I\'m earning more than ever before.',
    initials: 'PS',
    gradient: 'from-green to-mint',
  },
];

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export const FAQ_HEADER = {
  label: 'Got Questions?',
  title: 'Frequently Asked Questions',
} as const;

export const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Do I need my own license?',
    a: 'Yes, you need a valid two-wheeler driving license to rent an EV from MyWheels. This is mandatory for KYC verification and legal compliance.',
  },
  {
    q: 'What documents are required?',
    a: "You'll need your Aadhaar card, driving license, one passport-size photo, and a current address proof. The verification process is quick and simple.",
  },
  {
    q: 'How fast is vehicle allocation?',
    a: 'Once your KYC is approved, vehicle allocation typically happens within 24–48 hours. In most cases, you can start riding the same day!',
  },
  {
    q: 'Is maintenance included?',
    a: 'Yes! All regular maintenance and servicing is handled by our team at no extra cost. You just ride and earn — we take care of the rest.',
  },
  {
    q: 'What if the vehicle breaks down?',
    a: 'Our local support team in Hyderabad is available to assist you. Call us and we\'ll arrange roadside assistance or a replacement vehicle as quickly as possible.',
  },
];

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT_HEADER = {
  title: 'Get In Touch',
  subtitle:
    'MyWheels EV Pvt Ltd — Ready to help you start earning with electric mobility.',
} as const;

export const CONTACT_INFO: ContactInfo = {
  address: 'Plot no. 6, Sundarnagar, Hyderabad – 500038',
  phone: '+91 91219 69734',
  email: 'contactus@mywheelsev.com',
  whatsappNumber: '919121969734',
  mapCoordinates: { lat: 17.4375, lng: 78.4447 },
};

export const CONTACT_CARDS: ContactCard[] = [
  { label: 'Address', value: 'Plot no. 6, Sundarnagar, Hyderabad – 500038', icon: '📍' },
  { label: 'Phone', value: '+91 91219 69734', icon: '📞' },
  { label: 'Email', value: 'contactus@mywheelsev.com', icon: '✉️' },
];

export const WHATSAPP_URL =
  'https://wa.me/919121969734?text=Hi%2C%20I%27m%20interested%20in%20renting%20an%20EV%20from%20MyWheels.';

// ─── CTA Strip ───────────────────────────────────────────────────────────────

export const CTA_STRIP = {
  headline: 'Ready to Start Earning Today?',
  subtitle:
    'Join hundreds of delivery partners in Hyderabad. Choose a plan and get on the road in minutes.',
  ctaPrimary: 'View Plans',
  ctaSecondary: 'WhatsApp Us',
} as const;

// ─── Pricing Plans ───────────────────────────────────────────────────────────

export const PRICING_HEADER = {
  title: 'Simple, Transparent Pricing',
  subtitle: 'Choose the plan that works for you. No hidden charges.',
} as const;

export const PRICING_NOTE =
  'Contact us for exact rates based on your usage and vehicle preference.';

export const PRICING_PLANS: PricingPlan[] = [
  {
    title: 'Daily Plan',
    price: '249',
    period: '/day',
    features: [
      'Perfect for trying before committing',
      'No minimum period required',
      'Pay as you go flexibility',
      'Ideal for part-time riders',
    ],
    featured: false,
  },
  {
    title: 'Weekly Plan',
    price: '1,499',
    period: '/week',
    features: [
      'Ideal for short-term or trial usage',
      '7-day rental period',
      'Great for testing the fit',
      'No long-term commitment',
    ],
    featured: false,
  },
  {
    title: 'Monthly Plan',
    price: '4,999',
    period: '/month',
    features: [
      'Most preferred by delivery partners',
      '30-day rental period',
      'Predictable monthly expense',
      'Priority support included',
    ],
    featured: true,
    tag: 'Best for Full-Time Riders',
  },
];

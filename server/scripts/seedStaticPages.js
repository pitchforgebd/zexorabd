/**
 * One-time seed: populates site_settings with the exact content that was
 * previously hardcoded in About.tsx, CeoMessage.tsx, VisionMission.tsx, and
 * GlobalSourcing.tsx (Phase 14), so switching those pages to read from the
 * API doesn't change anything visually until an admin actually edits
 * something. Safe to re-run - always overwrites with this same seed.
 *
 * Usage: node scripts/seedStaticPages.js
 */
const siteSettingsService = require('../src/services/siteSettings');
const pool = require('../src/db/pool');

const ABOUT = {
  hero: { title: 'About Zexora Corporation', subtitle: 'Uniting Dreams for a Brighter Tomorrow' },
  whoWeAre: {
    heading: 'Who We Are',
    paragraphs: [
      'Zexora Corporation is a diversified multi-sector business group established in 2024 with a strategic mandate to build an integrated and professionally managed corporate platform.',
      'The foundation of the Group is rooted in over 15 years of industry experience spanning industrial manufacturing, printing and packaging, chemical technologies, global sourcing, supply chain coordination, and commercial operations. This practical expertise allows us to operate with market intelligence, technical depth, and disciplined execution.',
    ],
  },
  divisionsSection: {
    heading: 'Our Business Divisions',
    description:
      'Zexora Corporation operates across multiple specialized business divisions — each structured around operational efficiency, quality assurance, robust governance frameworks, and long-term scalability:',
    items: [
      { name: 'Industrial Chemicals & Ink Solutions', icon: 'Beaker' },
      { name: 'Print & Pack Solutions', icon: 'Printer' },
      { name: 'Global Procurement & Strategic Sourcing', icon: 'Globe' },
      { name: 'Logistics & Air Shipping Solutions', icon: 'Truck' },
      { name: 'Apparel & Garments', icon: 'Shirt' },
      { name: 'Industrial Equipment & Machinery Solutions', icon: 'Cog' },
      { name: 'Power Backup & Electrical Infrastructure Solutions', icon: 'Zap' },
      { name: 'Fashion & Lifestyle', icon: 'ShoppingBag' },
      { name: 'Travel & Corporate Travel Management', icon: 'Plane' },
    ],
  },
  competitiveAdvantage: {
    heading: 'Our Competitive Advantage',
    paragraphs: [
      'Our differentiation lies in our integrated model — combining deep industry experience, structured commercial capability, verified global supplier networks, and performance-based management systems.',
      'Unlike conventional trading or agency models, Zexora is designed as a full-service corporate platform — capable of managing procurement, logistics, quality assurance, and client delivery within a single structured ecosystem.',
    ],
  },
  ourVision: {
    heading: 'Our Vision',
    paragraphs: [
      'Zexora Corporation is being developed as a long-term institutional platform — designed to grow responsibly, expand strategically, and deliver measurable value across sectors and stakeholders.',
      'We do not pursue volume for its own sake. We pursue excellence, reliability, and the kind of long-term trust that only consistent performance can build.',
    ],
  },
};

const CEO_MESSAGE = {
  hero: {
    eyebrow: 'Leadership',
    title: 'Message From The Founder & CEO',
    quote: 'To build a diversified business group committed to excellence, innovation, and long-term value creation.',
  },
  photo: 'https://i.ibb.co.com/sdTn1ny2/IMG-20260224-WA0002-jpg.jpg',
  name: 'MD. Billal Hossain Bappi',
  title: 'Founder & CEO',
  sections: [
    {
      heading: 'Our Foundation',
      paragraphs: [
        'Zexora Corporation was established in 2024 with a clear strategic vision — to build a diversified, structurally governed, and performance-driven business group across industrial and commercial sectors.',
        'While the corporate platform was formally established in 2024, it is built upon more than 15 years of hands-on industry leadership across printing, packaging, industrial chemicals, global sourcing, supply chain operations, and commercial management. This depth of experience has enabled us to design Zexora with practical insight, operational discipline, and long-term institutional thinking from inception.',
      ],
    },
    {
      heading: 'Our Philosophy',
      paragraphs: [
        'Our objective is not short-term expansion — it is sustainable and scalable growth. We are developing Zexora as a resilient corporate platform capable of operating across multiple sectors with governance, accountability, and measurable performance standards.',
        'Each business unit under Zexora is structured to deliver technical competence, operational efficiency, financial discipline, and long-term stakeholder value.',
      ],
    },
    {
      heading: 'Our Core Beliefs',
      paragraphs: [
        'We believe that true corporate strength lies in experience, structured execution, ethical leadership, and the ability to adapt to evolving market conditions. Zexora Corporation is being built with these principles at its core — not as an aspiration, but as an operational commitment.',
      ],
    },
    {
      heading: 'The Road Ahead',
      paragraphs: [
        'As we move forward, our focus remains clear: strengthen our industrial capabilities, expand strategically across sectors, build institutional depth, and create enduring value for our partners, clients, and stakeholders.',
      ],
    },
  ],
  emphasisHeading: 'We emphasize:',
  emphasisItems: ['Systems over improvisation', 'Strategy over reaction', 'Sustainability over rapid but unstable growth'],
  closingQuote:
    'Zexora is not merely a business initiative — it is a long-term vision to build a trusted, performance-driven, and enduring corporate institution.',
};

const VISION_MISSION = {
  hero: { title: 'Our Vision & Mission', subtitle: 'The Principles That Drive Zexora Corporation' },
  vision: {
    heading: 'Our Vision',
    text: 'To become a globally recognized, diversified corporate institution — built on industry expertise, structured governance, and a relentless commitment to delivering long-term value across every sector we operate in. We envision Zexora Corporation as a trusted multi-sector business platform where each division operates with institutional discipline, strategic clarity, and measurable performance standards — contributing to the industrial and commercial growth of Bangladesh and beyond.',
  },
  mission: {
    heading: 'Our Mission',
    intro:
      'To build and operate a performance-driven, multi-sector business group that delivers consistent quality, reliable supply, and strategic commercial value to our partners, clients, and stakeholders.',
    commitmentHeading: 'We are committed to:',
    commitments: [
      'Delivering high-quality industrial products and services across every division',
      'Building long-term relationships founded on trust, transparency, and reliability',
      'Developing structured business systems that ensure operational excellence',
      'Creating sustainable value through ethical leadership and responsible growth',
      "Supporting the industrial and commercial development of Bangladesh through world-class sourcing and supply solutions",
    ],
  },
  coreValues: {
    heading: 'Our Core Values',
    items: [
      { icon: 'Target', title: 'Trust', desc: 'We build every relationship — with clients, partners, and suppliers — on a foundation of honesty, transparency, and consistent delivery. Trust is not claimed; it is earned through action.' },
      { icon: 'ShieldCheck', title: 'Integrity', desc: 'We conduct our business with the highest ethical standards. We do what we say, say what we mean, and never compromise our principles for short-term gain.' },
      { icon: 'Heart', title: 'Responsibility', desc: 'We take ownership of our commitments — to our clients, our team, and the communities in which we operate. Responsible business is not optional; it is at the core of how Zexora is built.' },
      { icon: 'TrendingUp', title: 'Creativity', desc: 'We embrace innovation, strategic thinking, and creative problem-solving to continuously improve our services, explore new opportunities, and deliver better outcomes for our partners.' },
      { icon: 'Award', title: 'Excellence', desc: 'In every division, every transaction, and every client interaction — we set and maintain the highest standards of quality, professionalism, and performance.' },
    ],
  },
  whyChooseUs: {
    heading: 'Why Choose Zexora Corporation?',
    items: [
      { title: 'Reliable Global Sourcing Network', desc: 'Verified suppliers from 9+ countries worldwide' },
      { title: 'Consistent Industrial Quality', desc: 'Strict quality standards maintained at every supply stage' },
      { title: 'Competitive Commercial Support', desc: 'Transparent pricing and sustainable long-term value' },
      { title: 'Deep Technical Product Knowledge', desc: '15+ years of hands-on industry expertise' },
      { title: 'Fast & Efficient Supply Chain', desc: 'End-to-end logistics coordination and on-time delivery' },
      { title: 'Long-Term Partnership Approach', desc: 'We build relationships, not just transactions' },
      { title: 'Import & Indenting Support', desc: 'Full commercial and documentation support for imports' },
      { title: 'Multi-Sector Capability', desc: '9 divisions under one trusted corporate platform' },
    ],
  },
  industries: {
    heading: 'Industries We Serve',
    items: [
      { name: 'Printing Industry', icon: 'Printer' },
      { name: 'Packaging Industry', icon: 'Package' },
      { name: 'Textile & Garments', icon: 'Shirt' },
      { name: 'Pharmaceutical Industry', icon: 'Pill' },
      { name: 'Plastic & Polymer', icon: 'Layers' },
      { name: 'Paint & Coating', icon: 'PaintRoller' },
      { name: 'Adhesive Manufacturing', icon: 'Droplet' },
      { name: 'Industrial Manufacturing', icon: 'Factory' },
      { name: 'Fashion Industry', icon: 'ShoppingBag' },
    ],
  },
};

const GLOBAL_SOURCING = {
  hero: { title: 'Our Global Sourcing Network', subtitle: "Connecting Bangladesh's Industries with the World's Best Suppliers" },
  intro: {
    eyebrow: 'Strategic Network',
    heading: 'World-Class Quality, Sourced Globally.',
    description:
      'Zexora Corporation maintains an active and verified global sourcing network, connecting Bangladeshi industries with internationally recognized manufacturers and suppliers of industrial chemicals, specialty materials, printing consumables, equipment, and commercial products. We source from the world\'s leading industrial manufacturing nations, ensuring our clients receive products that meet international quality standards at competitive market prices.',
    stat1Value: '9+',
    stat1Label: 'Sourcing Countries',
    stat2Value: '100%',
    stat2Label: 'Verified Suppliers',
    mapCalloutHeading: 'Global Reach',
    mapCalloutText: 'Seamless integration from international manufacturers directly to local industries.',
  },
  countries: {
    heading: 'Countries We Source From',
    subheading: 'A strategic footprint across key industrial manufacturing hubs globally.',
    items: [
      { flag: '🇨🇳', name: 'China', items: 'Industrial chemicals, printing inks, machinery, packaging materials, electronics' },
      { flag: '🇮🇳', name: 'India', items: 'Specialty chemicals, pharmaceutical raw materials, textile auxiliaries' },
      { flag: '🇩🇪', name: 'Germany', items: 'High-precision chemicals, industrial equipment, printing technologies' },
      { flag: '🇰🇷', name: 'South Korea', items: 'Advanced materials, electronics, industrial components' },
      { flag: '🇸🇬', name: 'Singapore', items: 'Specialty chemicals, trading hub, regional logistics support' },
      { flag: '🇲🇾', name: 'Malaysia', items: 'Palm-based chemicals, industrial polymers, raw materials' },
      { flag: '🇯🇵', name: 'Japan', items: 'High-performance industrial materials, precision equipment' },
      { flag: '🇹🇷', name: 'Turkey', items: 'Textile chemicals, dyes, industrial raw materials' },
      { flag: '🇹🇼', name: 'Taiwan', items: 'Electronics components, industrial machinery parts' },
    ],
  },
  businessModels: {
    heading: 'Our Business Models',
    items: [
      { icon: 'Ship', title: 'Import & Trading', desc: 'We directly import and supply industrial products to manufacturers, factories, and industrial buyers across Bangladesh. Our import operations are supported by structured logistics coordination, customs documentation, and end-to-end delivery management — ensuring our clients receive their products on time and in full compliance.' },
      { icon: 'Handshake', title: 'Indenting & Sourcing', desc: 'For clients requiring specific products from international suppliers, we provide professional indenting and commercial sourcing services. We identify verified suppliers, negotiate competitive pricing, coordinate sampling and quality confirmation, and manage the full commercial process from initial inquiry to final delivery.' },
      { icon: 'Box', title: 'Bulk Industrial Supply', desc: 'For clients with continuous and high-volume production requirements, we offer structured bulk supply solutions — including scheduled delivery planning, consistent quality assurance, and dedicated account management. Our bulk supply model is designed to ensure uninterrupted production operations for our industrial partners.' },
    ],
  },
  commitment: {
    heading: 'Our Sourcing Commitment',
    items: [
      'Verified and audited supplier relationships',
      'Consistent quality standards across all sourcing channels',
      'Transparent pricing and competitive commercial terms',
      'Dedicated sourcing support and technical consultation',
      'Reliable delivery timelines and shipment coordination',
    ],
  },
  cta: {
    heading: 'Need global sourcing support?',
    text: 'Let our experts handle the complexities of international trade. Get in touch with us to discuss your specific industrial requirements.',
  },
};

async function main() {
  await siteSettingsService.set('page.about', ABOUT);
  await siteSettingsService.set('page.ceoMessage', CEO_MESSAGE);
  await siteSettingsService.set('page.visionMission', VISION_MISSION);
  await siteSettingsService.set('page.globalSourcing', GLOBAL_SOURCING);
  console.log('Seeded page.about, page.ceoMessage, page.visionMission, page.globalSourcing');
  await pool.end();
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exitCode = 1;
});

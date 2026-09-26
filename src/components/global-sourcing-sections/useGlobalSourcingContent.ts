import { useSiteSettings } from '../../lib/useSiteSettings';
import type { GlobalSourcingContent } from '../../lib/types';

export const DEFAULT_CONTENT: GlobalSourcingContent = {
  hero: { title: 'Our Global Sourcing Network', subtitle: "Connecting Bangladesh's Industries with the World's Best Suppliers" },
  intro: {
    eyebrow: 'Strategic Network',
    heading: 'World-Class Quality, Sourced Globally.',
    description:
      "Zexora Corporation maintains an active and verified global sourcing network, connecting Bangladeshi industries with internationally recognized manufacturers and suppliers of industrial chemicals, specialty materials, printing consumables, equipment, and commercial products. We source from the world's leading industrial manufacturing nations, ensuring our clients receive products that meet international quality standards at competitive market prices.",
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

export function useGlobalSourcingContent(): GlobalSourcingContent {
  const { settings } = useSiteSettings();
  return settings?.['page.globalSourcing'] || DEFAULT_CONTENT;
}

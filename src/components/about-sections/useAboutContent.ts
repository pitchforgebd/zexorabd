import { useSiteSettings } from '../../lib/useSiteSettings';
import type { AboutContent } from '../../lib/types';

export const DEFAULT_CONTENT: AboutContent = {
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

export function useAboutContent(): AboutContent {
  const { settings } = useSiteSettings();
  return settings?.['page.about'] || DEFAULT_CONTENT;
}

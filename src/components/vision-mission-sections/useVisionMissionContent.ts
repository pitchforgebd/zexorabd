import { useSiteSettings } from '../../lib/useSiteSettings';
import type { VisionMissionContent } from '../../lib/types';

export const DEFAULT_CONTENT: VisionMissionContent = {
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

export function useVisionMissionContent(): VisionMissionContent {
  const { settings } = useSiteSettings();
  return settings?.['page.visionMission'] || DEFAULT_CONTENT;
}

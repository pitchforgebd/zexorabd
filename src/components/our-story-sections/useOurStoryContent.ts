import { useSiteSettings } from '../../lib/useSiteSettings';
import type { OurStoryContent } from '../../lib/types';

export const DEFAULT_CONTENT: OurStoryContent = {
  hero: {
    eyebrow: 'Our Journey',
    title: 'Our Story',
    subtitle: 'How 15+ years of hands-on industry experience became a diversified, multi-sector corporate platform.',
  },
  paragraphs: [
    'Zexora Corporation did not begin as an idea on paper — it began on the ground, inside the day-to-day realities of printing and packaging, industrial chemicals, global sourcing, and supply chain operations. For more than 15 years, our leadership worked directly within these industries, learning first-hand what reliability, quality, and long-term partnership actually require in practice.',
    'That hands-on experience is what shaped the decision to build something larger. In 2024, Zexora Corporation was formally established — not as a startup testing an idea, but as a structured, professionally governed platform designed from day one to operate across multiple sectors with discipline, accountability, and measurable performance standards.',
    "Today, Zexora Corporation operates six specialized business divisions and continues to grow its wider ecosystem of trusted sister concerns, each contributing its own expertise while sharing the same institutional standards of governance, quality, and long-term value creation.",
  ],
  pullQuote: 'We did not set out to be the biggest. We set out to be the most trusted.',
  milestones: [
    {
      label: '15+ Years',
      title: 'Deep Industry Roots',
      description:
        'Long before Zexora existed on paper, our leadership was already active across printing, packaging, industrial chemicals, global sourcing, and supply chain operations — building the practical, hands-on expertise that would eventually shape this entire platform.',
    },
    {
      label: '2024',
      title: 'Zexora Corporation Formally Established',
      description:
        'That experience was brought together under one name and one structure: Zexora Corporation — a diversified, professionally governed business group spanning six specialized divisions.',
    },
    {
      label: 'Ongoing',
      title: 'Growing the Ecosystem',
      description:
        "Zexora's ecosystem now extends beyond its own divisions to trusted sister concerns like Proactive Trade International, each operating with the same institutional discipline and long-term commitment to quality.",
    },
  ],
};

export function useOurStoryContent(): OurStoryContent {
  const { settings } = useSiteSettings();
  return settings?.['page.ourStory'] || DEFAULT_CONTENT;
}

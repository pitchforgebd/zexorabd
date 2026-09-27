import { useSiteSettings } from '../../lib/useSiteSettings';
import type { OurStoryContent } from '../../lib/types';

export const DEFAULT_CONTENT: OurStoryContent = {
  hero: {
    eyebrow: 'Our Story',
    title: 'Built By People Who Already Knew The Industry.',
    subtitle:
      "Zexora Corporation didn't start in a boardroom — it started on the floor, across fifteen-plus years of solving real supply problems. Here's how it became a diversified group.",
  },
  timeline: {
    eyebrow: '01 Timeline',
    heading: 'The Journey So Far.',
    milestones: [
      {
        label: 'Before 2024',
        title: 'Fifteen-Plus Years on the Ground',
        description:
          'Our leadership spent over fifteen years working directly inside printing and packaging, industrial chemicals, global sourcing, and supply chain operations — learning firsthand where industries lose time, money, and trust.',
      },
      {
        label: '2024',
        title: 'Zexora Corporation Is Founded',
        description:
          'Zexora Corporation was formally established in Dhaka on a clear principle: build a diversified, professionally governed platform — not a loose collection of side businesses.',
      },
      {
        label: '2024',
        title: 'Six Divisions Structured',
        description:
          'Six specialized business divisions were organized under one corporate platform — chemicals, machinery, power, apparel, print & pack, and fashion — each built on real operational experience, not assumption.',
      },
      {
        label: '2024 – Present',
        title: 'The Sister Concern Ecosystem Begins',
        description:
          "Zexora's ecosystem extended beyond its own divisions with trusted sister concerns like Proactive Trade International, each operating with the same institutional standards of governance and quality.",
      },
      {
        label: 'Ongoing',
        title: 'Building Toward Scale',
        description:
          'Zexora continues to grow its divisions and its ecosystem, guided by the same discipline that built it: measurable performance, structured governance, and long-term value over short-term expansion.',
      },
    ],
  },
  closing: {
    heading: "The Next Chapter Is the One You're In.",
    subheading: 'From Industry Experience to an Institutional Platform',
    paragraphs: [
      "Zexora Corporation was established in 2024 from a clear understanding of what Bangladesh's industrial and commercial sectors actually needed: a single, professionally governed platform capable of operating across multiple industries with real discipline.",
      'With more than fifteen years of hands-on experience across printing, packaging, industrial chemicals, and global sourcing, our leadership recognized a growing need for reliable, structured, and accountable business partners — not just suppliers.',
      'That recognition became the foundation of Zexora Corporation — bringing together six specialized divisions and a growing ecosystem of trusted sister concerns under one institutional standard.',
      'Today, Zexora Corporation operates across chemicals, machinery, power, apparel, print & pack, and fashion — combining industry knowledge, technical capability, and long-term thinking to deliver value that goes beyond a single transaction.',
      'As we continue to grow, our purpose remains unchanged: to build a trusted, performance-driven, and enduring corporate institution — one division, one partnership, and one sister concern at a time.',
    ],
    image: '/uploads/homepage/32b57c8bcf6eec189d899746f50704fa.jpg',
  },
};

export function useOurStoryContent(): OurStoryContent {
  const { settings } = useSiteSettings();
  return settings?.['page.ourStory'] || DEFAULT_CONTENT;
}

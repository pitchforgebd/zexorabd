import { useSiteSettings } from '../../lib/useSiteSettings';
import type { CeoMessageContent } from '../../lib/types';

export const DEFAULT_CONTENT: CeoMessageContent = {
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

export function useCeoMessageContent(): CeoMessageContent {
  const { settings } = useSiteSettings();
  return settings?.['page.ceoMessage'] || DEFAULT_CONTENT;
}

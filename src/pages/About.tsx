import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/about-sections/HeroSection';
import WhoWeAreSection from '../components/about-sections/WhoWeAreSection';
import DivisionsGridSection from '../components/about-sections/DivisionsGridSection';
import CompetitiveAdvantageSection from '../components/about-sections/CompetitiveAdvantageSection';
import OurVisionSection from '../components/about-sections/OurVisionSection';
import CtaSection from '../components/about-sections/CtaSection';

// Registry mapping a page_sections.section_key to the component that
// renders it - same pattern as Home.tsx (Phase 7/16). Order here doesn't
// matter - the API's sortOrder does.
const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  'who-we-are': WhoWeAreSection,
  'divisions-grid': DivisionsGridSection,
  'competitive-advantage': CompetitiveAdvantageSection,
  'our-vision': OurVisionSection,
  cta: CtaSection,
};

const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function About() {
  const { sections, loading, error } = usePageSections('about');
  const sectionKeys = !loading && !error && sections.length > 0 ? sections : null;

  return (
    <div className="bg-white pt-24">
      {sectionKeys
        ? sectionKeys
            .filter((s) => s.isVisible)
            .map((s) => {
              const Component = SECTION_REGISTRY[s.sectionKey];
              if (!Component) return null;
              return <Component key={s.sectionKey} />;
            })
        : FALLBACK_SECTION_KEYS.map((key) => {
            const Component = SECTION_REGISTRY[key];
            return <Component key={key} />;
          })}
    </div>
  );
}

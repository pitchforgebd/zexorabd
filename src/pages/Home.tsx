import SEO from '../components/SEO';
import { seoData } from '../data/seoData';
import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/home-sections/HeroSection';
import AboutSnapshotSection from '../components/home-sections/AboutSnapshotSection';
import DivisionsGridSection from '../components/home-sections/DivisionsGridSection';
import WhyChooseUsSection from '../components/home-sections/WhyChooseUsSection';
import IndustriesSection from '../components/home-sections/IndustriesSection';
import GlobalSourcingSection from '../components/home-sections/GlobalSourcingSection';
import SuppliersSection from '../components/home-sections/SuppliersSection';
import SisterConcernsSection from '../components/home-sections/SisterConcernsSection';
import VisionMissionSnapshotSection from '../components/home-sections/VisionMissionSnapshotSection';
import CtaSection from '../components/home-sections/CtaSection';

// Registry mapping a page_sections.section_key to the component that
// renders it. Order here doesn't matter - the API's sortOrder does.
const SECTION_REGISTRY: Record<string, React.ComponentType<{ variant?: string }>> = {
  hero: HeroSection,
  'about-snapshot': AboutSnapshotSection,
  'divisions-grid': DivisionsGridSection,
  'why-choose-us': WhyChooseUsSection,
  industries: IndustriesSection,
  'global-sourcing': GlobalSourcingSection,
  suppliers: SuppliersSection,
  'sister-concerns': SisterConcernsSection,
  'vision-mission': VisionMissionSnapshotSection,
  cta: CtaSection,
};

// Fallback order/set if the API call fails or hasn't loaded yet, so the
// homepage still renders something sensible rather than a blank page.
const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function Home() {
  const { sections, loading, error } = usePageSections('home');

  const sectionKeys = !loading && !error && sections.length > 0 ? sections : null;

  return (
    <div className="bg-white">
      <SEO title={seoData.home.title} description={seoData.home.description} />
      {sectionKeys
        ? sectionKeys
            .filter((s) => s.isVisible)
            .map((s) => {
              const Component = SECTION_REGISTRY[s.sectionKey];
              if (!Component) return null;
              return <Component key={s.sectionKey} variant={s.layoutVariant} />;
            })
        : FALLBACK_SECTION_KEYS.map((key) => {
            const Component = SECTION_REGISTRY[key];
            return <Component key={key} />;
          })}
    </div>
  );
}

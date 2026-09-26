import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/global-sourcing-sections/HeroSection';
import IntroMapSection from '../components/global-sourcing-sections/IntroMapSection';
import CountriesSection from '../components/global-sourcing-sections/CountriesSection';
import BusinessModelsSection from '../components/global-sourcing-sections/BusinessModelsSection';
import CommitmentCtaSection from '../components/global-sourcing-sections/CommitmentCtaSection';

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  'intro-map': IntroMapSection,
  countries: CountriesSection,
  'business-models': BusinessModelsSection,
  'commitment-cta': CommitmentCtaSection,
};

const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function GlobalSourcing() {
  const { sections, loading, error } = usePageSections('global-sourcing');
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

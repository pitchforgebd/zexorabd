import CTABanner from '../components/CTABanner';
import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/ceo-message-sections/HeroSection';
import MessageSection from '../components/ceo-message-sections/MessageSection';

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  message: MessageSection,
  cta: CTABanner,
};

const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function CeoMessage() {
  const { sections, loading, error } = usePageSections('ceo-message');
  const sectionKeys = !loading && !error && sections.length > 0 ? sections : null;

  return (
    <>
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
    </>
  );
}

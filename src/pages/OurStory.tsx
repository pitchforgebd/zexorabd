import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/our-story-sections/HeroSection';
import StorySection from '../components/our-story-sections/StorySection';

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  story: StorySection,
};

const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function OurStory() {
  const { sections, loading, error } = usePageSections('our-story');
  const sectionKeys = !loading && !error && sections.length > 0 ? sections : null;

  return (
    <div className="bg-white">
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

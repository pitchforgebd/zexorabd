import { usePageSections } from '../lib/usePageSections';
import HeroSection from '../components/vision-mission-sections/HeroSection';
import VisionMissionTextSection from '../components/vision-mission-sections/VisionMissionTextSection';
import CoreValuesSection from '../components/vision-mission-sections/CoreValuesSection';
import WhyChooseUsSection from '../components/vision-mission-sections/WhyChooseUsSection';
import IndustriesSection from '../components/vision-mission-sections/IndustriesSection';

const SECTION_REGISTRY: Record<string, React.ComponentType> = {
  hero: HeroSection,
  'vision-mission-text': VisionMissionTextSection,
  'core-values': CoreValuesSection,
  'why-choose-us': WhyChooseUsSection,
  industries: IndustriesSection,
};

const FALLBACK_SECTION_KEYS = Object.keys(SECTION_REGISTRY);

export default function VisionMission() {
  const { sections, loading, error } = usePageSections('vision-mission');
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

import FadeIn from '../FadeIn';
import { getIcon } from '../../lib/icons';
import { useVisionMissionContent } from './useVisionMissionContent';

export default function CoreValuesSection() {
  const c = useVisionMissionContent();
  return (
    <section className="py-24 bg-primary-dark px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white mb-4">{c.coreValues.heading}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {c.coreValues.items.map((val, idx) => {
            const Icon = getIcon(val.icon);
            return (
              <FadeIn key={idx} delay={idx * 0.1} direction="up">
                <div className="bg-[#242424] rounded-xl p-8 text-center h-full border border-gray-800 hover:border-primary-blue transition-colors group">
                  <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-blue transition-colors">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{val.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{val.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

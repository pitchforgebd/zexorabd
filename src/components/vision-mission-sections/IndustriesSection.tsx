import FadeIn from '../FadeIn';
import { getIcon } from '../../lib/icons';
import { useVisionMissionContent } from './useVisionMissionContent';

export default function IndustriesSection() {
  const c = useVisionMissionContent();
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl font-bold text-primary-dark mb-4">{c.industries.heading}</h2>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {c.industries.items.map((ind, idx) => {
            const Icon = getIcon(ind.icon);
            return (
              <FadeIn key={idx} delay={idx * 0.05} className="group cursor-pointer">
                <div className="border border-gray-100 bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-colors h-full flex flex-col items-center justify-center gap-4">
                  <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary-blue transition-colors" />
                  <span className="font-semibold text-primary-dark">{ind.name}</span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

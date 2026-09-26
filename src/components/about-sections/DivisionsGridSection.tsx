import FadeIn from '../FadeIn';
import { getIcon } from '../../lib/icons';
import { useAboutContent } from './useAboutContent';

export default function DivisionsGridSection() {
  const c = useAboutContent();
  return (
    <section className="py-24 px-4 bg-light-gray">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6 tracking-tight">{c.divisionsSection.heading}</h2>
          <p className="text-xl text-body-text leading-relaxed text-justify">{c.divisionsSection.description}</p>
        </FadeIn>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {c.divisionsSection.items.map((div, idx) => {
            const Icon = getIcon(div.icon);
            return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="block p-8 rounded-2xl border border-gray-100 shadow-sm bg-white h-full flex items-center gap-4">
                  <div className="bg-blue-50 text-primary-blue p-3 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-primary-dark">{div.name}</h3>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

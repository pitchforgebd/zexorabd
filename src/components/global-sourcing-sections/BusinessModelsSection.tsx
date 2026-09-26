import FadeIn from '../FadeIn';
import { getIcon } from '../../lib/icons';
import { useGlobalSourcingContent } from './useGlobalSourcingContent';

export default function BusinessModelsSection() {
  const c = useGlobalSourcingContent();
  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight">{c.businessModels.heading}</h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-8">
          {c.businessModels.items.map((model, idx) => {
            const Icon = getIcon(model.icon);
            return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 text-center h-full group bg-gray-50 hover:bg-white hover:-translate-y-1">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary-blue transition-colors">
                    <Icon className="w-10 h-10 text-primary-blue group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-dark mb-4 group-hover:text-primary-blue transition-colors">{model.title}</h3>
                  <p className="text-body-text leading-relaxed font-medium">{model.desc}</p>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

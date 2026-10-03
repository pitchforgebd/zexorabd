import FadeIn from '../FadeIn';
import { useGlobalSourcingContent } from './useGlobalSourcingContent';

export default function CountriesSection() {
  const c = useGlobalSourcingContent();
  return (
    <section className="py-24 bg-light-gray px-4">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 tracking-tight">{c.countries.heading}</h2>
          <p className="text-lg text-body-text max-w-2xl mx-auto text-center">{c.countries.subheading}</p>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {c.countries.items.map((country, idx) => (
            <FadeIn key={idx} delay={idx * 0.05} direction="up">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-blue hover:shadow-xl transition-all duration-300 flex items-start group hover:-translate-y-1 h-full">
                <div className="text-4xl mr-5 transform group-hover:scale-110 transition-transform">{country.flag}</div>
                <div>
                  <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary-blue transition-colors">{country.name}</h3>
                  <p className="text-body-text leading-relaxed">{country.items}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

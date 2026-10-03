import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import Breadcrumbs from '../components/Breadcrumbs';
import { useDivision, useDivisionsList } from '../lib/useDivisions';
import { getIcon } from '../lib/icons';

export function DivisionTemplate({ id }: { id: string }) {
  const { division: data, loading, error } = useDivision(id);

  if (loading) {
    return <div className="pt-32 pb-24 min-h-screen text-center text-body-text">Loading…</div>;
  }
  if (error || !data) {
    return <div className="pt-32 pb-24 min-h-screen text-center text-body-text">{error || 'Division not found.'}</div>;
  }
  const images = data.galleryImages;

  return (
    <div className="bg-white pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <FadeIn className="max-w-5xl mx-auto relative z-10">
          <Breadcrumbs variant="dark" center />
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
            {data.name}
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 font-medium tracking-wide text-center">
            {data.tagline}
          </p>
        </FadeIn>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4 max-w-7xl mx-auto grid lg:grid-cols-3 gap-16 inline-start">
        <div className="lg:col-span-2 space-y-16 w-full">
          <FadeIn>
            {data.industry && (
              <h4 className="text-sm font-bold text-primary-blue tracking-[2px] uppercase mb-3">
                {data.industry}
              </h4>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6 tracking-tight">
              Company Overview
            </h2>
            <p className="text-lg text-body-text leading-relaxed text-justify">
              {data.overview}
            </p>
          </FadeIn>

          {data.brandPositioning && (
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4 tracking-tight">
                Brand Positioning
              </h2>
              <p className="text-lg text-body-text leading-relaxed text-justify">
                {data.brandPositioning}
              </p>
            </FadeIn>
          )}

          {data.philosophy && (
            <FadeIn className="bg-primary-dark rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">
                Our Philosophy
              </h2>
              <p className="text-gray-300 text-lg mb-8 relative z-10">
                {data.philosophy.intro}
              </p>
              <ul className="space-y-4 mb-8 relative z-10">
                {data.philosophy.beliefs.map((belief, idx) => (
                  <li key={idx} className="flex items-center text-white">
                    <span className="w-2 h-2 rounded-full bg-primary-blue mr-4 shadow-none"></span>
                    <span className="font-medium text-lg">{belief}</span>
                  </li>
                ))}
              </ul>
              <p className="text-primary-blue font-semibold text-lg relative z-10 italic">
                "{data.philosophy.closing}"
              </p>
            </FadeIn>
          )}

          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 tracking-tight">
              Products & Services
            </h2>
            <div className="space-y-8">
              {data.products.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-light-gray rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-2xl font-bold text-primary-dark mb-4 border-b border-gray-200 pb-4 tracking-tight">
                    {cat.category}
                  </h3>
                  {cat.description && (
                    <p className="text-body-text mb-8">{cat.description}</p>
                  )}
                  <div className="space-y-10">
                    {cat.subcategories.map((sub) => (
                      <div key={sub.id}>
                        {sub.subName && (
                          <h4 className="text-xl font-bold text-primary-blue mb-3">
                            {sub.subName}
                          </h4>
                        )}
                        {sub.description && (
                          <p className="text-body-text mb-5 text-sm">
                            {sub.description}
                          </p>
                        )}
                        <ul className="grid sm:grid-cols-2 gap-4">
                          {sub.items.map((item) => (
                            <li key={item.id} className="flex items-start">
                              <CheckCircle2 className="w-5 h-5 text-primary-blue mr-3 flex-shrink-0 mt-0.5" />
                              <span className="text-body-text font-medium">
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="space-y-12">
          {data.commitment && data.commitment.length > 0 && (
            <FadeIn className="bg-light-gray rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary-dark mb-6 tracking-tight">
                Our Commitment
              </h3>
              <ul className="space-y-4">
                {data.commitment.map((item, idx) => (
                  <li key={idx} className="flex items-start text-body-text">
                    <span className="text-primary-blue mr-3 leading-none text-xl">
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}

          {data.sourcingSteps && data.sourcingSteps.length > 0 && (
            <FadeIn className="bg-light-gray rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-primary-dark mb-6 tracking-tight">
                Our Sourcing Process
              </h3>

              <div className="space-y-6">
                {data.sourcingSteps.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="text-base font-bold text-primary-dark mb-2">
                      {section.title}
                    </h4>
                    <p className="flex items-start text-body-text">
                      <span className="text-primary-blue mr-3 leading-none text-xl">
                        •
                      </span>
                      <span>{section.description}</span>
                    </p>
                  </div>
                ))}
              </div>
            </FadeIn>
          )}

          {data.strengths && data.strengths.length > 0 && (
            <FadeIn className="bg-primary-blue rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6">
                Our Strengths
              </h3>
              <ul className="space-y-4">
                {data.strengths.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start text-blue-50 font-medium"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white mr-3 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}

          {data.industries && data.industries.length > 0 && (
            <FadeIn className="bg-light-gray rounded-3xl p-8 border-l-4 border-primary-blue shadow-sm">
              <h3 className="text-xl font-bold text-primary-dark mb-6 tracking-tight">
                Industries We Serve
              </h3>
              <ul className="space-y-4">
                {data.industries.map((ind, idx) => (
                  <li
                    key={idx}
                    className="font-medium text-body-text flex items-start"
                  >
                    <span className="text-primary-blue mr-3 shrink-0 flex mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                    </span>
                    {ind}
                  </li>
                ))}
              </ul>
            </FadeIn>
          )}

          {data.markets && data.markets.length > 0 && (
            <FadeIn className="border border-gray-100 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-10"></div>
              <h3 className="text-xl font-bold text-primary-dark mb-6 tracking-tight">
                Global Markets
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.markets.map((market, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-primary-dark px-3 py-1 rounded-full text-sm font-semibold"
                  >
                    {market}
                  </span>
                ))}
              </div>
            </FadeIn>
          )}

          <FadeIn className="bg-primary-dark rounded-3xl p-8 text-white shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6">
              Why Choose Us?
            </h3>
            <ul className="space-y-4">
              {data.reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start text-sm text-gray-300"
                >
                  <span className="text-primary-blue mr-3 leading-none">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </FadeIn>

          <FadeIn>
            <Link
              to="/contact"
              className="w-full flex items-center justify-center bg-primary-blue hover:bg-accent-hover text-white px-6 py-4 rounded-full font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-lg cursor-pointer"
            >
              Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Division Images Gallery */}
      {images.length > 0 && (
        <section className="py-16 bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-primary-dark tracking-tight mb-4">
                  Visuals & Products
                </h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-center">
                  A glimpse into our facilities, products, and operational
                  excellence.
                </p>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {images.map((img) => (
                <FadeIn key={img.id}>
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 aspect-square group relative">
                    <div className="absolute inset-0 bg-primary-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                    <img
                      src={img.url}
                      alt={`${data.name} visual ${img.id}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function Divisions() {
  const { divisions, loading, error } = useDivisionsList();

  return (
    <div className="bg-light-gray pt-24 min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">Our Business Divisions</h1>
            <p className="text-xl md:text-3xl text-blue-100 font-medium tracking-wide text-center"> Six specialized divisions. One integrated corporate platform.</p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24 px-4 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <p className="text-xl text-body-text max-w-3xl mx-auto text-center">
            Operating under one integrated corporate platform to deliver consistent quality and reliable supply.
          </p>
        </FadeIn>

        {loading && <p className="text-center text-body-text">Loading divisions…</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {divisions.map((div, idx) => {
            const Icon = getIcon(div.icon);
            return (
            <FadeIn key={div.id} delay={idx * 0.1}>
              <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col group hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 group-hover:bg-primary-blue/5 transition-colors"></div>
                <div className="w-16 h-16 bg-primary-blue/10 text-primary-blue rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary-dark group-hover:text-primary-blue transition-colors tracking-tight relative z-10">{div.name}</h3>
                <p className="text-body-text mb-8 flex-grow text-lg leading-relaxed relative z-10">{div.tagline}</p>
                <Link
                  to={`/divisions/${div.slug}`}
                  className="inline-flex items-center text-primary-blue font-bold group-hover:text-accent-hover transition-colors mt-auto relative z-10 uppercase tracking-wider text-sm"
                >
                  View Division <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </FadeIn>
            );
          })}
        </div>
      </section>
    </div>
  );
}

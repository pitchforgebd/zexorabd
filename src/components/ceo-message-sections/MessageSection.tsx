import FadeIn from '../FadeIn';
import { useCeoMessageContent } from './useCeoMessageContent';

export default function MessageSection() {
  const c = useCeoMessageContent();
  // The special "We emphasize" numbered list and the closing pull-quote are
  // fixed decorative elements attached after specific sections (index 1 and
  // the last section) - their text is admin-editable, their placement isn't.
  const philosophyIdx = 1;
  const lastIdx = c.sections.length - 1;

  return (
    <section className="py-24 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

          {/* Left Sidebar - Photo */}
          <div className="lg:w-1/3">
            <FadeIn delay={0.1}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 group">
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/80 via-primary-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                <img
                  src={c.photo}
                  alt={`${c.name} - ${c.title}`}
                  className="w-full aspect-[4/5] object-cover filter contrast-[1.02] group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 z-20">
                  <p className="text-white text-sm font-medium tracking-wider uppercase mb-1">Zexora Corporation</p>
                  <p className="text-accent-hover font-semibold">Leading with Vision</p>
                </div>
              </div>

              <div className="mt-8 text-center lg:text-left bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-gray-50 rounded-bl-full -z-10"></div>
                <div className="w-12 h-1 bg-primary-blue mb-6 mx-auto lg:mx-0"></div>
                <h3 className="font-bold text-2xl text-primary-dark mb-1">{c.name}</h3>
                <h4 className="font-semibold text-lg text-primary-blue mb-4">{c.title}</h4>
                <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Zexora Corporation</p>
              </div>
            </FadeIn>
          </div>

          {/* Right Content - Message */}
          <div className="lg:w-2/3">
            <div className="space-y-16">

              <FadeIn delay={0.2} className="relative">
                <div className="absolute -left-8 top-2 bottom-0 w-px bg-gradient-to-b from-primary-blue via-gray-200 to-transparent hidden lg:block"></div>

                <div className="space-y-16">
                  {c.sections.map((section, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[37px] top-2 w-3 h-3 rounded-full shadow-[0_0_0_4px_#f9fafb] hidden lg:block ${
                          idx % 2 === 0 ? 'bg-primary-blue' : 'bg-gray-300'
                        }`}
                      ></div>
                      <h3 className="text-3xl font-bold text-primary-dark mb-6 tracking-tight">{section.heading}</h3>
                      {section.paragraphs.map((p, pIdx) => (
                        <p
                          key={pIdx}
                          className={`text-lg text-body-text leading-relaxed text-justify ${
                            pIdx < section.paragraphs.length - 1 ? 'mb-5' : idx === philosophyIdx ? 'mb-10' : idx === lastIdx ? 'mb-8' : ''
                          }`}
                        >
                          {p}
                        </p>
                      ))}

                      {idx === philosophyIdx && (
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-blue/5 rounded-full blur-3xl group-hover:bg-primary-blue/10 transition-colors duration-700"></div>
                          <p className="font-bold text-primary-dark text-xl mb-8 tracking-tight relative z-10 flex items-center">
                            <span className="w-2 h-2 rounded-full bg-primary-blue mr-3 shadow-[0_0_0_2px_rgba(37,99,235,0.2)]"></span>
                            {c.emphasisHeading}
                          </p>
                          <ul className="space-y-6 relative z-10">
                            {c.emphasisItems.map((item, i) => (
                              <li key={i} className="flex items-center text-body-text text-lg font-medium">
                                <span className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mr-5 text-primary-blue font-bold text-sm border border-gray-100">
                                  {String(i + 1).padStart(2, '0')}
                                </span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {idx === lastIdx && (
                        <div className="bg-primary-dark/5 p-8 rounded-2xl border-l-4 border-primary-blue">
                          <p className="text-xl text-primary-dark leading-relaxed font-semibold italic">"{c.closingQuote}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </FadeIn>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

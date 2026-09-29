import FadeIn from '../FadeIn';
import { useOurStoryContent } from './useOurStoryContent';

export default function ClosingSection() {
  const c = useOurStoryContent();
  const { closing } = c;

  return (
    <section className="py-20 sm:py-28 bg-primary-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${closing.image ? 'lg:grid-cols-2' : ''} gap-12 lg:gap-16 items-center`}>
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">{closing.heading}</h2>
            {closing.subheading && <p className="text-accent-hover text-sm font-semibold uppercase tracking-wide mb-6 text-left">{closing.subheading}</p>}
            <div className="space-y-4 text-gray-300 leading-relaxed">
              {closing.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </FadeIn>

          {closing.image && (
            <FadeIn delay={0.15}>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img src={closing.image} alt="Zexora Corporation" className="w-full h-auto object-cover" />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}

import FadeIn from '../FadeIn';
import { useAboutContent } from './useAboutContent';

export default function WhoWeAreSection() {
  const c = useAboutContent();
  return (
    <section className="py-24 px-4 max-w-4xl mx-auto">
      <FadeIn>
        <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 text-center tracking-tight">{c.whoWeAre.heading}</h2>
        <div className="prose prose-lg mx-auto text-body-text space-y-6 text-xl leading-relaxed text-justify">
          {c.whoWeAre.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

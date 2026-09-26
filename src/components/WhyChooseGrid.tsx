import { CheckCircle2 } from 'lucide-react';
import FadeIn from './FadeIn';

type Reason = {
  title: string;
  desc: string;
};

type WhyChooseGridProps = {
  reasons: Reason[];
  variant?: 'grid' | 'list';
};

export default function WhyChooseGrid({ reasons, variant = 'grid' }: WhyChooseGridProps) {
  if (variant === 'list') {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {reasons.map((reason, idx) => (
          <FadeIn
            key={idx}
            delay={idx * 0.05}
            direction="up"
            className="group flex items-start gap-4 bg-white/6 hover:bg-white/10 rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-colors"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-primary-blue transition-colors">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold mb-1 text-white">{reason.title}</h4>
              <p className="text-blue-100/80 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
      {reasons.map((reason, idx) => (
        <FadeIn
          key={idx}
          delay={idx * 0.05}
          direction="up"
          className="group relative bg-white/6 hover:bg-white/10 rounded-2xl p-6 lg:p-7 border border-white/10 hover:border-white/25 transition-all hover:-translate-y-1"
        >
          <span className="absolute top-5 right-6 text-3xl font-bold text-white/10 select-none">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="w-14 h-14 rounded-xl bg-white/10 group-hover:bg-primary-blue flex items-center justify-center mb-5 transition-colors">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h4 className="text-lg font-bold mb-2 text-white leading-snug">{reason.title}</h4>
          <p className="text-blue-100/80 text-sm leading-relaxed">{reason.desc}</p>
        </FadeIn>
      ))}
    </div>
  );
}

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
      <div className="max-w-3xl mx-auto space-y-6">
        {reasons.map((reason, idx) => (
          <FadeIn key={idx} delay={idx * 0.05} direction="up" className="flex items-start gap-4 bg-white/5 rounded-xl p-5 border border-white/10">
            <div className="w-10 h-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-base font-bold mb-1 text-white">{reason.title}</h4>
              <p className="text-blue-100 text-sm leading-relaxed">{reason.desc}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      {reasons.map((reason, idx) => (
        <FadeIn key={idx} delay={idx * 0.05} direction="up" className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-bold mb-2 text-white">{reason.title}</h4>
          <p className="text-blue-100 text-sm leading-relaxed">{reason.desc}</p>
        </FadeIn>
      ))}
    </div>
  );
}

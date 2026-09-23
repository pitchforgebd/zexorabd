import { LucideIcon } from 'lucide-react';
import FadeIn from './FadeIn';

type Industry = {
  name: string;
  icon: LucideIcon;
};

type IndustriesGridProps = {
  industries: Industry[];
};

export default function IndustriesGrid({ industries }: IndustriesGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {industries.map((ind, idx) => {
        const Icon = ind.icon;
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
  );
}

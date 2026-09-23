import { Link } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import FadeIn from './FadeIn';

type DivisionCardProps = {
  division: {
    id: string;
    name: string;
    tagline: string;
    path: string;
    icon?: LucideIcon;
  };
  index: number;
};

export default function DivisionCard({ division, index }: DivisionCardProps) {
  const Icon = division.icon;

  return (
    <FadeIn delay={index * 0.1}>
      <div className="bg-white rounded-3xl p-10 shadow-sm hover:shadow-2xl transition-all duration-300 h-full flex flex-col group hover:-translate-y-2 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-full -z-0 group-hover:bg-primary-blue/5 transition-colors"></div>
        <div className="w-16 h-16 bg-primary-blue/10 text-primary-blue rounded-2xl flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform">
          {Icon && <Icon className="w-8 h-8" />}
        </div>
        <h3 className="text-2xl font-bold mb-4 text-primary-dark group-hover:text-primary-blue transition-colors tracking-tight relative z-10">
          {division.name}
        </h3>
        <p className="text-body-text mb-8 flex-grow text-lg leading-relaxed relative z-10">
          {division.tagline}
        </p>
        <Link 
          to={division.path} 
          className="inline-flex items-center text-primary-blue font-bold group-hover:text-accent-hover transition-colors mt-auto relative z-10 uppercase tracking-wider text-sm"
        >
          View Division <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
        </Link>
      </div>
    </FadeIn>
  );
}

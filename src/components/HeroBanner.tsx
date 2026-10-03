import { ReactNode } from 'react';
import FadeIn from './FadeIn';

type HeroBannerProps = {
  title: string;
  subtitle: string;
  bgImage: string;
};

export default function HeroBanner({ title, subtitle, bgImage }: HeroBannerProps) {
  return (
    <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
      <div 
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{ backgroundImage: `url('${bgImage}')` }}
      ></div>
      <FadeIn className="max-w-5xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-blue-100 font-medium tracking-wide text-center">
          {subtitle}
        </p>
      </FadeIn>
    </section>
  );
}

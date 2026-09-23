import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from './FadeIn';

type CTABannerProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
};

export default function CTABanner({ 
  title = "Ready to Partner with Us?", 
  description = "Get in touch to discuss how we can support your business goals.",
  buttonText = "Get in Touch",
  buttonLink = "/contact"
}: CTABannerProps) {
  return (
    <section className="py-24 bg-primary-dark text-white text-center px-4">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">{title}</h2>
          <p className="text-xl text-gray-300 mb-10">
            {description}
          </p>
          <Link 
            to={buttonLink} 
            className="inline-flex items-center justify-center bg-white text-primary-dark hover:bg-primary-blue hover:text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:-translate-y-1 text-lg"
          >
            {buttonText} <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

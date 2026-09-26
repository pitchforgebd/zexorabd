import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Phone, MessageCircle } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useSiteInfo } from '../../lib/useSiteSettings';

export default function CtaSection() {
  const info = useSiteInfo();
  const whatsappDigits = info.whatsapp.replace(/\D/g, '');

  const contactMethods = [
    { icon: Phone, label: 'Call Us', value: info.phone, href: `tel:${info.phone}` },
    { icon: Mail, label: 'Email Us', value: info.email, href: `mailto:${info.email}` },
    { icon: MessageCircle, label: 'WhatsApp', value: 'Chat Now', href: `https://wa.me/${whatsappDigits}` },
  ];

  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=2000&q=80")' }}
      />
      <div className="absolute inset-0 bg-primary-dark/92 backdrop-blur-sm" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="absolute top-0 right-0 w-105 h-105 bg-primary-blue/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-10 items-center">
          <FadeIn className="lg:col-span-3 text-center lg:text-left">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Ready to Work with Zexora Corporation?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Whether you are looking for industrial chemicals, equipment, sourcing solutions, or logistics support —
              our team is ready to assist you.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </FadeIn>

          <FadeIn delay={0.15} direction="left" className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {contactMethods.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/25 rounded-2xl px-5 py-4 transition-all duration-300"
              >
                <span className="w-11 h-11 shrink-0 rounded-xl bg-white/10 group-hover:bg-primary-blue flex items-center justify-center transition-colors duration-300">
                  <Icon className="w-5 h-5 text-white" />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-blue-200/70">{label}</span>
                  <span className="block text-sm font-semibold text-white truncate">{value}</span>
                </span>
              </a>
            ))}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

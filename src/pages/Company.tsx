import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import { useSiteSettings } from '../lib/useSiteSettings';
import { slugify } from '../lib/slugify';
import type { SisterConcern, SisterConcernsContent } from '../lib/types';

const DEFAULT_CONTENT: SisterConcernsContent = {
  heading: 'Our Sister Concerns',
  subheading: 'Subsidiaries & Ecosystem',
  items: [
    {
      logo: 'https://i.ibb.co.com/7dbkZsNS/Proactive-Trade-International-Logo.png',
      coverImage: '',
      name: 'Proactive Trade International',
      tagline: 'One-Stop Printing & Packaging Solutions',
      description:
        'Founded in 2024, Proactive Trade International is a trusted printing and packaging solutions provider in Bangladesh, standing at the forefront of technical excellence in the printing and packaging industry. We specialize in high-performance advanced printing & packaging industries machineries & consumables, proudly serving over 100+ top-tier printing and packaging companies.',
      whatWeDo: [
        'Supply and commission printing, converting and post-press machinery',
        'Supply press room chemicals, inks, coatings, plates, blankets, adhesives and papers',
        'Provide installation, operator training and preventive maintenance',
        'Hold local consumable stock and manage scheduled replenishment',
      ],
      whoWeServe:
        'From commercial printing to high-volume packaging production, we support businesses across the printing and packaging value chain — delivering machinery, materials, consumables, and technical solutions tailored to their operational needs.',
      howStructured:
        'Sales, field engineering, warehousing and CRM operate as one chain. The engineer who commissions your machine and the CRM officer who schedules your consumables work from the same account record, so nothing is handed off and dropped.',
      stats: {
        founded: '2024',
        headOffice: 'Motijheel, Dhaka',
        customersServed: '100+',
        leadershipExperience: '15+ Years',
        coverage: 'Nationwide, Bangladesh',
        industry: 'Printing & Packaging',
      },
      profileNote: 'A downloadable PDF profile is being prepared. Request a copy and we will send it directly.',
      websiteUrl: 'https://proactive.com.bd/',
    },
  ],
};

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-gray-400 mb-1 text-left">{label}</p>
      <p className="text-sm font-bold text-primary-dark text-left">{value}</p>
    </div>
  );
}

function ConcernProfile({ concern, idx }: { concern: SisterConcern; idx: number }) {
  const stats: { label: string; value: string }[] = [
    { label: 'Founded', value: concern.stats?.founded },
    { label: 'Head Office', value: concern.stats?.headOffice },
    { label: 'Customers Served', value: concern.stats?.customersServed },
    { label: 'Leadership Experience', value: concern.stats?.leadershipExperience },
    { label: 'Coverage', value: concern.stats?.coverage },
    { label: 'Industry', value: concern.stats?.industry },
  ].filter((s) => s.value);

  const whatWeDo = concern.whatWeDo || [];

  return (
    <div id={slugify(concern.name)} className="scroll-mt-28">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5 mb-10">
          <div className="h-20 w-35 sm:w-auto sm:min-w-35 sm:max-w-55 rounded-xl bg-white border border-gray-100 shadow-sm flex items-center justify-center px-5 py-3 shrink-0">
            <img src={concern.logo} alt={concern.name} className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-dark tracking-tight">{concern.name}</h2>
            {concern.tagline && <p className="text-primary-blue font-semibold text-sm mt-0.5">{concern.tagline}</p>}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-10 lg:gap-14">
          <div>
            {concern.description && (
              <div className="mb-8">
                <span className="text-xs font-bold uppercase tracking-[2px] text-primary-blue">
                  {String(idx + 1).padStart(2, '0')} Overview
                </span>
                <p className="text-body-text leading-relaxed mt-3">{concern.description}</p>
              </div>
            )}

            {whatWeDo.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-primary-dark text-lg mb-3">What We Do</h3>
                <ul className="space-y-2.5">
                  {whatWeDo.map((item, i) => (
                    <li key={i} className="flex gap-3 text-body-text leading-relaxed">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-blue shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {concern.whoWeServe && (
              <div className="mb-8">
                <h3 className="font-bold text-primary-dark text-lg mb-3">Who We Serve</h3>
                <p className="text-body-text leading-relaxed">{concern.whoWeServe}</p>
              </div>
            )}

            {concern.howStructured && (
              <div>
                <h3 className="font-bold text-primary-dark text-lg mb-3">How We're Structured</h3>
                <p className="text-body-text leading-relaxed">{concern.howStructured}</p>
              </div>
            )}
          </div>

          <div className="space-y-5">
            {stats.length > 0 && (
              <div className="border border-gray-200 rounded-2xl p-5 grid grid-cols-2 gap-5">
                {stats.map((s) => (
                  <StatBox key={s.label} label={s.label} value={s.value} />
                ))}
              </div>
            )}

            {(concern.profileNote || concern.websiteUrl) && (
              <div className="bg-light-gray rounded-2xl p-5">
                <span className="text-xs font-bold uppercase tracking-[2px] text-primary-blue">Company Profile</span>
                {concern.profileNote && <p className="text-sm text-body-text mt-2 mb-4 leading-relaxed">{concern.profileNote}</p>}
                <div className="flex flex-col gap-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-1.5 bg-primary-blue text-white text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg hover:bg-accent-hover transition-colors"
                  >
                    Request Profile
                  </Link>
                  {concern.websiteUrl && (
                    <a
                      href={concern.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 border border-primary-blue/25 text-primary-dark text-xs font-bold uppercase tracking-wide px-4 py-2.5 rounded-lg hover:border-primary-blue transition-colors"
                    >
                      Visit Website <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

export default function Company() {
  const { settings } = useSiteSettings();
  const { hash } = useLocation();
  const c = settings?.['home.sisterConcerns'] || DEFAULT_CONTENT;

  useEffect(() => {
    if (!hash) return;
    const el = document.getElementById(hash.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, [hash, settings]);

  return (
    <div className="bg-white pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-primary-blue/15 bg-light-gray text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-primary-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
            {c.subheading}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark mb-5 tracking-tight">Company</h1>
          <p className="text-lg text-body-text max-w-2xl leading-relaxed">
            Zexora Corporation operates as a diversified group, extending beyond its own divisions to a growing
            ecosystem of trusted sister concerns.
          </p>
        </FadeIn>

        {c.items.length === 0 ? (
          <p className="text-body-text">No sister concerns to show yet.</p>
        ) : (
          <div>
            {c.items.map((concern, idx) => (
              <div key={idx} className={idx > 0 ? 'mt-16 pt-16 border-t border-gray-100' : ''}>
                <ConcernProfile concern={concern} idx={idx} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Info, UserCircle, Compass, Globe2 } from 'lucide-react';

const cards = [
  { to: '/admin/pages/about', icon: Info, title: 'About', desc: 'Who We Are, Business Divisions, Competitive Advantage, Vision.' },
  { to: '/admin/pages/ceo-message', icon: UserCircle, title: 'CEO Message', desc: "The Founder & CEO's leadership message." },
  { to: '/admin/pages/vision-mission', icon: Compass, title: 'Vision & Mission', desc: 'Vision, Mission, Core Values, Why Choose Us, Industries We Serve.' },
  { to: '/admin/pages/global-sourcing', icon: Globe2, title: 'Global Sourcing', desc: 'Sourcing network intro, countries, business models, commitment.' },
];

export default function AdminPagesHub() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-1">Static Pages</h1>
      <p className="text-body-text text-sm mb-6">Edit the content of these previously fixed pages — no code changes needed.</p>
      <div className="grid sm:grid-cols-2 gap-6">
        {cards.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
            <div className="w-12 h-12 bg-primary-blue/10 text-primary-blue rounded-xl flex items-center justify-center mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-primary-dark mb-1">{title}</h2>
            <p className="text-sm text-body-text">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

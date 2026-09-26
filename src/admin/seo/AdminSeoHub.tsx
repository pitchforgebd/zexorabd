import { Link } from 'react-router-dom';
import { FileSearch, Wrench } from 'lucide-react';

const cards = [
  { to: '/admin/seo/pages', icon: FileSearch, title: 'Page SEO', desc: 'Per-page title, description, and social preview image.' },
  { to: '/admin/seo/tools', icon: Wrench, title: 'SEO Tools', desc: 'robots.txt, sitemap, Google Search Console, Analytics, Tag Manager, and custom tracking code.' },
];

export default function AdminSeoHub() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-1">SEO</h1>
      <p className="text-body-text text-sm mb-6">Everything search engines and social previews see, plus site-wide tools and tracking.</p>
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

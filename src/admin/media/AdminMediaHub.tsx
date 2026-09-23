import { Link } from 'react-router-dom';
import { Newspaper, Image, Video } from 'lucide-react';

const cards = [
  { to: '/admin/media/news', icon: Newspaper, title: 'News', desc: 'Publish announcements and articles.' },
  { to: '/admin/media/photos', icon: Image, title: 'Photo Gallery', desc: 'Manage the photo grid on the public site.' },
  { to: '/admin/media/videos', icon: Video, title: 'Video Gallery', desc: 'Manage featured video links.' },
];

export default function AdminMediaHub() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-1">News & Media</h1>
      <p className="text-body-text text-sm mb-6">Manage the Media Centre section of the site.</p>
      <div className="grid sm:grid-cols-3 gap-6">
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

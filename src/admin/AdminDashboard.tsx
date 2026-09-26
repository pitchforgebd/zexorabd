import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Boxes,
  Newspaper,
  Image,
  Video,
  Handshake,
  Mail,
  Briefcase,
  Settings,
  FileText,
  LayoutTemplate,
  Search,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from './AuthContext';
import { apiFetch, ApiError } from '../lib/api';
import type { DashboardSummary } from '../lib/types';

function StatCard({
  to,
  icon: Icon,
  label,
  value,
  badge,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  badge?: { text: string; tone: 'warn' | 'info' } | null;
}) {
  return (
    <Link to={to} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-primary-blue/10 text-primary-blue rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              badge.tone === 'warn' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
            }`}
          >
            {badge.text}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-primary-dark">{value}</p>
      <p className="text-sm text-body-text">{label}</p>
    </Link>
  );
}

function timeAgo(iso: string): string {
  // Same parsing as the rest of the admin panel (e.g. AdminContactMessages)
  // - new Date() on the "YYYY-MM-DD HH:MM:SS" string mysql2 returns.
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

const quickLinks = [
  { to: '/admin/settings', icon: Settings, label: 'Website Settings' },
  { to: '/admin/pages', icon: FileText, label: 'Static Pages' },
  { to: '/admin/sections', icon: LayoutTemplate, label: 'Page Sections' },
  { to: '/admin/seo', icon: Search, label: 'SEO' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<DashboardSummary>('/api/admin/dashboard')
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-1">Welcome, {user?.name}</h1>
      <p className="text-body-text mb-8">Here's what's happening on the site.</p>

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {data && (
        <div className="space-y-8">
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard to="/admin/divisions" icon={Boxes} label="Divisions" value={data.counts.divisions} />
            <StatCard
              to="/admin/media/news"
              icon={Newspaper}
              label="News Posts"
              value={data.counts.newsPosts.total}
              badge={data.counts.newsPosts.draft > 0 ? { text: `${data.counts.newsPosts.draft} draft`, tone: 'info' } : null}
            />
            <StatCard to="/admin/media/photos" icon={Image} label="Photo Gallery" value={data.counts.photoGallery} />
            <StatCard to="/admin/media/videos" icon={Video} label="Video Gallery" value={data.counts.videoGallery} />
            <StatCard to="/admin/homepage/suppliers" icon={Handshake} label="Supplier Logos" value={data.counts.suppliers} />
            <StatCard
              to="/admin/contact-messages"
              icon={Mail}
              label="Contact Messages"
              value={data.counts.contactMessages.total}
              badge={data.counts.contactMessages.unread > 0 ? { text: `${data.counts.contactMessages.unread} unread`, tone: 'warn' } : null}
            />
            <StatCard
              to="/admin/career-applications"
              icon={Briefcase}
              label="Career Applications"
              value={data.counts.careerApplications.total}
              badge={data.counts.careerApplications.new > 0 ? { text: `${data.counts.careerApplications.new} new`, tone: 'warn' } : null}
            />
          </div>

          {/* Quick links */}
          <section>
            <h2 className="font-bold text-primary-dark mb-3">Quick Links</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickLinks.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all">
                  <div className="w-9 h-9 bg-primary-blue/10 text-primary-blue rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium text-primary-dark">{label}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Recent activity */}
          <div className="grid md:grid-cols-2 gap-6">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary-dark">Recent Contact Messages</h2>
                <Link to="/admin/contact-messages" className="text-xs font-medium text-primary-blue hover:text-accent-hover flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {data.recent.contactMessages.length === 0 ? (
                <p className="text-sm text-gray-400">No messages yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recent.contactMessages.map((m) => (
                    <li key={m.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-primary-dark text-sm truncate">{m.name}</p>
                        {m.status === 'unread' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">unread</span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{m.subject || 'No subject'} · {timeAgo(m.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary-dark">Recent Career Applications</h2>
                <Link to="/admin/career-applications" className="text-xs font-medium text-primary-blue hover:text-accent-hover flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {data.recent.careerApplications.length === 0 ? (
                <p className="text-sm text-gray-400">No applications yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recent.careerApplications.map((a) => (
                    <li key={a.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-primary-dark text-sm truncate">{a.fullName}</p>
                        {a.status === 'new' && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 shrink-0">new</span>}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{a.position || 'No position specified'} · {timeAgo(a.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary-dark">Recently Edited News</h2>
                <Link to="/admin/media/news" className="text-xs font-medium text-primary-blue hover:text-accent-hover flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {data.recent.newsPosts.length === 0 ? (
                <p className="text-sm text-gray-400">No news posts yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recent.newsPosts.map((n) => (
                    <li key={n.id} className="py-3 first:pt-0 last:pb-0">
                      <Link to={`/admin/media/news/${n.id}`} className="flex items-center justify-between gap-2 group">
                        <p className="font-medium text-primary-dark text-sm truncate group-hover:text-primary-blue">{n.title}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${n.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {n.isPublished ? 'published' : 'draft'}
                        </span>
                      </Link>
                      <p className="text-xs text-gray-400">{timeAgo(n.updatedAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-primary-dark">Recently Edited Divisions</h2>
                <Link to="/admin/divisions" className="text-xs font-medium text-primary-blue hover:text-accent-hover flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              {data.recent.divisions.length === 0 ? (
                <p className="text-sm text-gray-400">No divisions yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {data.recent.divisions.map((d) => (
                    <li key={d.id} className="py-3 first:pt-0 last:pb-0">
                      <Link to={`/admin/divisions/${d.id}`} className="block group">
                        <p className="font-medium text-primary-dark text-sm truncate group-hover:text-primary-blue">{d.name}</p>
                        <p className="text-xs text-gray-400">{timeAgo(d.updatedAt)}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

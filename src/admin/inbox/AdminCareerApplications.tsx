import { useEffect, useState } from 'react';
import { Trash2, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { CareerApplication } from '../../lib/types';

const STATUS_OPTIONS: CareerApplication['status'][] = ['new', 'reviewed', 'shortlisted', 'rejected'];
const STATUS_STYLES: Record<CareerApplication['status'], string> = {
  new: 'bg-blue-100 text-blue-700',
  reviewed: 'bg-yellow-100 text-yellow-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
};

export default function AdminCareerApplications() {
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    apiFetch<CareerApplication[]>('/api/admin/career-applications')
      .then(setApplications)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load applications'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function setStatus(id: number, status: CareerApplication['status']) {
    try {
      const updated = await apiFetch<CareerApplication>(`/api/admin/career-applications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setApplications((apps) => apps.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to update application');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this application permanently? This also removes the uploaded CV.')) return;
    try {
      await apiFetch(`/api/admin/career-applications/${id}`, { method: 'DELETE' });
      setApplications((apps) => apps.filter((a) => a.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete application');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark">Career Applications</h1>
      <p className="text-body-text text-sm mb-6">Applications submitted through the public Career page.</p>

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">No applications yet.</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {applications.map((app) => (
          <div key={app.id}>
            <button
              onClick={() => setExpandedId((id) => (id === app.id ? null : app.id))}
              className="w-full flex items-center gap-4 p-4 text-left hover:bg-light-gray/50"
            >
              <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${STATUS_STYLES[app.status]}`}>{app.status}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary-dark truncate">{app.fullName}</p>
                <p className="text-xs text-gray-400 truncate">{app.position || 'No position specified'} · {app.email}</p>
              </div>
              <span className="text-xs text-gray-400 shrink-0">{new Date(app.createdAt).toLocaleDateString()}</span>
              {expandedId === app.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {expandedId === app.id && (
              <div className="px-4 pb-4">
                <div className="bg-light-gray/60 rounded-xl p-4 text-sm text-body-text space-y-2">
                  <p><span className="font-medium text-primary-dark">Phone:</span> {app.phone}</p>
                  {app.education && <p><span className="font-medium text-primary-dark">Education:</span> {app.education}</p>}
                  {app.experienceYears && <p><span className="font-medium text-primary-dark">Experience:</span> {app.experienceYears} years</p>}
                  <p><span className="font-medium text-primary-dark">Consent given:</span> {app.consent ? 'Yes' : 'No'}</p>
                  {app.coverLetter && (
                    <div>
                      <p className="font-medium text-primary-dark">Cover Letter:</p>
                      <p className="whitespace-pre-line">{app.coverLetter}</p>
                    </div>
                  )}
                  {app.message && (
                    <div>
                      <p className="font-medium text-primary-dark">Additional Message:</p>
                      <p className="whitespace-pre-line">{app.message}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <a
                    href={app.cvFilePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary-blue hover:text-accent-hover px-3 py-1.5 border border-primary-blue/30 rounded-lg flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" /> View CV
                  </a>
                  <select
                    value={app.status}
                    onChange={(e) => setStatus(app.id, e.target.value as CareerApplication['status'])}
                    className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button onClick={() => handleDelete(app.id)} className="text-xs font-medium text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded-lg flex items-center gap-1 ml-auto">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

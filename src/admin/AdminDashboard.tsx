import { useAuth } from './AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-dark mb-1">Welcome, {user?.name}</h1>
      <p className="text-body-text mb-8">This is the Zexora Corporation admin panel.</p>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <p className="text-sm text-body-text">
          Content modules (Divisions, News, Homepage, Page Sections, Career Applications, Contact Messages, SEO)
          will appear in the sidebar as each is built out in the upcoming phases of the project roadmap.
        </p>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-24 text-center">
      <div>
        <p className="text-primary-blue font-bold text-lg mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Page Not Found</h1>
        <p className="text-body-text max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-primary-blue text-white px-6 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

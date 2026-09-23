import SEO from '../../components/SEO';

export default function News() {
  return (
    <>
      <SEO 
        title="News & Updates | Media Centre | Zexora Corporation"
        description="Stay updated with the latest news and announcements from Zexora Corporation."
      />
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">News & Announcements</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">Latest updates from around the Zexora corporate group.</p>
          </div>
          
          <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-white">
            <p className="text-gray-500 font-medium">No recent news available.</p>
          </div>
        </div>
      </div>
    </>
  );
}

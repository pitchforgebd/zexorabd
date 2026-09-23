import SEO from '../../components/SEO';

export default function PhotoGallery() {
  return (
    <>
      <SEO 
        title="Photo Gallery | Media Centre | Zexora Corporation"
        description="Explore the photo gallery of Zexora Corporation events and operations."
      />
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Photo Gallery</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">Visual highlights of our operations, facilities, and corporate events.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <span className="text-sm font-medium">Image {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

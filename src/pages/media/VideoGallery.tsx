import SEO from '../../components/SEO';
import { Play } from 'lucide-react';

export default function VideoGallery() {
  return (
    <>
      <SEO 
        title="Video Gallery | Media Centre | Zexora Corporation"
        description="Explore the video gallery of Zexora Corporation operations and showcases."
      />
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Video Gallery</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">Video presentations and overviews of our divisions.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2].map((item) => (
              <div key={item} className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer shadow-md">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary-blue/90 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                   <h3 className="text-white font-medium text-lg">Corporate Overview {item}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

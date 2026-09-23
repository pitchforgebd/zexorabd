import { supplierImages } from '../data/suppliers';

export default function SupplierLogos() {
  // Duplicate logos for seamless infinite scrolling
  const duplicatedLogos = [...supplierImages, ...supplierImages];

  return (
    <section className="py-24 bg-white border-t border-gray-100 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-primary tracking-wider uppercase mb-3 block text-primary-blue">
            Partner Network
          </span>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl mb-4">
            Our Global Suppliers
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            We collaborate with industry-leading manufacturers and suppliers to deliver uncompromising quality and excellence worldwide.
          </p>
        </div>
      </div>
        
      {/* Scroll Marquee */}
      <div className="relative w-full py-8 flex items-center overflow-hidden">
        {/* Gradients for smooth fade out at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <div className="flex w-max animate-marquee hover-pause">
          {duplicatedLogos.map((supplier, idx) => (
            <div 
              key={`${supplier.id}-${idx}`} 
              className="inline-flex w-40 sm:w-48 h-28 sm:h-32 flex-shrink-0 mx-3 sm:mx-4 p-4 items-center justify-center bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:border-primary-blue/30 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
            >
              <img
                src={supplier.url}
                alt={`Supplier ${supplier.id}`}
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.03)]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

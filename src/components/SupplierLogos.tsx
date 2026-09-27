import { useSiteSettings, useSuppliers } from '../lib/useSiteSettings';

export default function SupplierLogos() {
  const { suppliers } = useSuppliers();
  const { settings } = useSiteSettings();
  const copy = settings?.['home.suppliers'];

  if (suppliers.length === 0) return null;

  // Duplicate logos for seamless infinite scrolling
  const row = [...suppliers, ...suppliers];

  return (
    <section className="relative py-20 sm:py-24 bg-white border-t border-gray-100 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #2B2B9B 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary-blue" />
            <span className="text-sm font-bold text-primary-blue uppercase tracking-[2px]">
              {copy?.subheading || 'Partner Network'}
            </span>
            <span className="w-8 h-0.5 bg-primary-blue" />
          </div>
          <h2 className="text-3xl font-bold text-primary-dark tracking-tight sm:text-4xl mb-4">
            {copy?.heading || 'Our Global Suppliers'}
          </h2>
          <p className="text-lg text-body-text max-w-2xl mx-auto mb-6">
            {copy?.description ||
              'We collaborate with industry-leading manufacturers and suppliers to deliver uncompromising quality and excellence worldwide.'}
          </p>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-light-gray text-primary-dark text-sm font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
            {suppliers.length}+ Manufacturing Partners Worldwide
          </span>
        </div>
      </div>

      {/* Dual-direction scrolling marquee - two rows counter-scrolling reads as
          a fuller, livelier "wall of partners" than a single static row. */}
      <div className="relative w-full py-4 flex flex-col gap-6">
        {[0, 1].map((rowIdx) => (
          <div key={rowIdx} className="relative w-full flex items-center overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className={`flex w-max hover-pause ${rowIdx === 0 ? 'animate-marquee' : 'animate-marquee-reverse'}`}>
              {row.map((supplier, idx) => (
                <div
                  key={`${rowIdx}-${supplier.id}-${idx}`}
                  className="inline-flex w-40 sm:w-48 h-28 sm:h-32 flex-shrink-0 mx-3 sm:mx-4 p-4 items-center justify-center bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-xl hover:border-primary-blue/30 transition-all duration-300 hover:-translate-y-2 group cursor-pointer"
                >
                  <img
                    src={supplier.url}
                    alt={supplier.altText || `Supplier ${supplier.id}`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

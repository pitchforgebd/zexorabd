import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteSettings } from '../lib/useSiteSettings';

type HeroSliderProps = { variant?: 'slider' | 'static' };

const AUTOPLAY_MS = 6000;

export default function HeroSlider({ variant = 'slider' }: HeroSliderProps) {
  const { settings, loading } = useSiteSettings();
  const allSlides = settings?.['home.hero']?.slides || [];
  // 'static' shows only the first slide - no autoplay, no controls.
  const slides = variant === 'static' ? allSlides.slice(0, 1) : allSlides;
  const isSlider = variant === 'slider' && slides.length > 1;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [currentSlide, slides.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentSlide ? 1 : -1);
    setCurrentSlide(idx);
  };

  const slideVariants = {
    initial: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0.8
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] as const }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-50%' : '50%',
      opacity: 0,
      transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] as const }
    })
  };

  const textVariants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.2, ease: "easeOut" as const }
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      transition: { duration: 0.4, ease: "easeIn" as const }
    })
  };

  if (slides.length === 0) {
    return (
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {loading && <p className="text-white/40 text-sm">Loading…</p>}
      </section>
    );
  }

  return (
    <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 w-full h-full"
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url("${slides[currentSlide].image}")` }}
          />
          {/* Base scrim, kept dark enough to read text over any photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/90" />
          {/* Extra spotlight behind the text block so busy background photos
              (stock imagery with baked-in labels/icons) never fight the
              headline for attention, regardless of which image is uploaded. */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_70%)]" />
        </motion.div>
      </AnimatePresence>

      {/* Edge arrows */}
      {isSlider && (
        <>
          <button
            onClick={prevSlide}
            className="hidden sm:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="hidden sm:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      <div className="relative z-10 w-full px-4 max-w-5xl mx-auto flex flex-col items-center text-center -mt-8 sm:mt-0">
        <div className="relative w-full min-h-[260px] sm:min-h-[300px] md:min-h-[300px] lg:min-h-[360px] flex items-center justify-center">
          <AnimatePresence custom={direction}>
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-4xl absolute w-full flex flex-col items-center justify-center"
            >
              {slides[currentSlide].subtitle && (
                <span className="inline-flex items-center gap-2 mb-4 sm:mb-5 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-blue shrink-0" />
                  {slides[currentSlide].subtitle}
                </span>
              )}
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-3 sm:mb-5 tracking-tight leading-[1.1] drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]">
                {slides[currentSlide].title}
              </h1>
              {slides[currentSlide].description && (
                <p className="text-sm sm:text-lg md:text-xl text-white/75 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-4">
                  {slides[currentSlide].description}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10 relative z-20 w-full sm:w-auto px-4 sm:px-0">
          <Link
            to="/divisions"
            className="group w-full sm:w-auto bg-primary-blue mx-auto sm:mx-0 hover:bg-accent-hover text-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold transition-all shadow-lg shadow-primary-blue/30 hover:shadow-xl hover:shadow-primary-blue/40 hover:-translate-y-0.5 flex items-center justify-center"
          >
            Explore Our Divisions
            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto border-2 mx-auto sm:mx-0 border-white/50 hover:border-white hover:bg-white hover:text-primary-dark text-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold transition-all flex items-center justify-center backdrop-blur-sm hover:shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Slider Controls */}
      {isSlider && (
        <div className="absolute inset-x-0 bottom-6 sm:bottom-10 z-30 flex flex-col items-center gap-3 px-4">
          <div className="flex items-center gap-2 sm:gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className="relative h-1.5 w-8 sm:w-10 rounded-full bg-white/20 overflow-hidden transition-colors hover:bg-white/30"
                aria-label={`Go to slide ${idx + 1}`}
              >
                {idx === currentSlide && (
                  <motion.span
                    key={currentSlide}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: AUTOPLAY_MS / 1000, ease: 'linear' }}
                    className="absolute inset-y-0 left-0 bg-primary-blue rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
          <span className="text-white/50 text-xs font-semibold tracking-[3px]">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>
        </div>
      )}
    </section>
  );
}

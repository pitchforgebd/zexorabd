import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteSettings } from '../lib/useSiteSettings';

export default function HeroSlider() {
  const { settings, loading } = useSiteSettings();
  const slides = settings?.['home.hero']?.slides || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${slides[currentSlide].image}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 w-full px-4 max-w-7xl mx-auto flex flex-col items-center text-center -mt-8 sm:mt-0">
        <div className="relative w-full h-[250px] sm:h-[300px] md:h-[280px] lg:h-[350px] flex items-center justify-center">
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
               <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 sm:mb-4 tracking-tight leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  {slides[currentSlide].title}
                </h1>
                <h2 className="text-base sm:text-xl md:text-3xl text-gray-200 mb-3 sm:mb-5 font-semibold tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {slides[currentSlide].subtitle}
                </h2>
                <p className="text-sm sm:text-lg md:text-2xl text-blue-300 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-4">
                  {slides[currentSlide].description}
                </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-10 relative z-20 w-full sm:w-auto px-4 sm:px-0">
          <Link 
            to="/divisions" 
            className="w-full sm:w-auto bg-primary-blue mx-auto sm:mx-0 hover:bg-accent-hover text-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center"
          >
            Explore Our Divisions <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link 
            to="/contact" 
            className="w-full sm:w-auto border-2 mx-auto sm:mx-0 border-white hover:bg-white hover:text-primary-dark text-white px-6 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold transition-all flex items-center justify-center hover:shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute inset-x-0 bottom-6 sm:bottom-10 z-30 flex justify-center items-center gap-4 sm:gap-6 px-4">
        <button 
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentSlide ? 1 : -1);
                setCurrentSlide(idx);
              }}
              className={`h-2 transition-all duration-300 rounded-full ${
                idx === currentSlide ? 'w-10 bg-primary-blue shadow-lg shadow-primary-blue/30' : 'w-2 bg-white/40 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>
    </section>
  );
}

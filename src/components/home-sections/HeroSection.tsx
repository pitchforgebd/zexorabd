import HeroSlider from '../HeroSlider';

export default function HeroSection({ variant }: { variant?: string }) {
  return <HeroSlider variant={variant === 'static' ? 'static' : 'slider'} />;
}

import FadeIn from './FadeIn';

type StatBoxProps = {
  value: string;
  label: string;
  delay?: number;
};

export default function StatBox({ value, label, delay = 0 }: StatBoxProps) {
  return (
    <FadeIn delay={delay} className="bg-white/10 backdrop-blur-md p-10 rounded-3xl border border-white/20 text-center hover:bg-white/20 transition-all hover:-translate-y-1 shadow-xl">
      <div className="text-5xl md:text-6xl font-bold text-white tracking-tighter mb-4">{value}</div>
      <div className="text-gray-300 font-medium tracking-wide uppercase text-sm">{label}</div>
    </FadeIn>
  );
}

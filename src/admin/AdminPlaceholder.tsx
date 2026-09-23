export default function AdminPlaceholder({ title, phase }: { title: string; phase: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
      <h2 className="text-xl font-bold text-primary-dark mb-2">{title}</h2>
      <p className="text-body-text">This module isn't built yet — it's scheduled for {phase}.</p>
    </div>
  );
}

type Props = { title: string };

export default function LegalPlaceholder({ title }: Props) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-24 text-center">
      <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">{title}</h1>
      <p className="text-body-text">
        This page is being finalized. For questions in the meantime, please{' '}
        <a href="mailto:info@zexora.com.bd" className="text-primary-blue hover:underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
}

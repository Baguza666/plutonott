export default function TrustStrip({ items }: { items: readonly string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="bg-paper border-y border-paper-2 py-6 px-4">
      <ul className="max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm md:text-base font-medium text-on-paper">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-signal shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

import type { StatCard } from '@/pages/backoffice/shared';

type Props = {
    cards: StatCard[];
};

export default function StatsStrip({ cards }: Props) {
    return (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {cards.map((card) => (
                <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
                    <p className="mt-2 text-2xl font-black text-slate-900">{card.value.toLocaleString()}</p>
                </article>
            ))}
        </section>
    );
}

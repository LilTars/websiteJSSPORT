import type { StatCard } from '@/pages/backoffice/shared';

type Props = {
    cards: StatCard[];
};

export default function StatsStrip({ cards }: Props) {
    return (
        <section className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3">
            {cards.map((card) => (
                <article key={card.label} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <p className="text-xs font-semibold uppercase text-muted-foreground">{card.label}</p>
                    <p className="mt-2 text-2xl font-black text-foreground">{card.value.toLocaleString()}</p>
                </article>
            ))}
        </section>
    );
}

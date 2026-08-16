type BackofficeHeroProps = {
    title: string;
    description: string;
};

export default function BackofficeHero({ title, description }: BackofficeHeroProps) {
    return (
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 p-5 text-white shadow-sm md:p-7">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-indigo-400/20 blur-3xl" />

            <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">JS SPORT GROUP</p>
                <h1 className="mt-3 text-2xl font-black leading-tight text-white md:text-4xl">{title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-200 md:text-base">{description}</p>
            </div>
        </section>
    );
}

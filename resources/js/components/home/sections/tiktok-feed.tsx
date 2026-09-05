import { useEffect } from 'react';

type TikTokChannel = {
    label: string;
    handle: string;
    cardClass: string;
    clipPath: string;
    kickerClass: string;
    badgeClass: string;
};

const channels: TikTokChannel[] = [
    {
        label: 'Channel 01',
        handle: 'j.s.sport_shop',
        cardClass:
            'border-red-200 shadow-[0_18px_36px_-26px_rgba(239,68,68,0.5)] hover:border-red-400/55 dark:border-red-500/30',
        clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%, 0 14%)',
        kickerClass: 'text-red-400',
        badgeClass: 'border-red-500/45 text-red-500',
    },
    {
        label: 'Channel 02',
        handle: 'mesport80',
        cardClass:
            'border-pink-200 shadow-[0_18px_36px_-26px_rgba(236,72,153,0.45)] hover:border-pink-400/60 dark:border-pink-500/30',
        clipPath: 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
        kickerClass: 'text-cyan-500',
        badgeClass: 'border-cyan-500/45 text-cyan-600',
    },
];

function TikTokChannelCard({ channel }: { channel: TikTokChannel }) {
    return (
        <article
            className={`group relative overflow-hidden border bg-white p-4 transition duration-300 hover:-translate-y-1 dark:bg-slate-900 ${channel.cardClass}`}
            style={{ clipPath: channel.clipPath }}
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <p className={`text-xs font-black uppercase tracking-[0.22em] ${channel.kickerClass}`}>
                    {channel.label}
                </p>
                <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${channel.badgeClass}`}>
                    @{channel.handle}
                </span>
            </div>

            <div className="flex min-h-[430px] items-center justify-center">
                <blockquote
                    className="tiktok-embed !m-0 w-full max-w-[780px] min-w-[288px]"
                    cite={`https://www.tiktok.com/@${channel.handle}`}
                    data-unique-id={channel.handle}
                    data-embed-type="creator"
                >
                    <section>
                        <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://www.tiktok.com/@${channel.handle}?refer=creator_embed`}
                        >
                            @{channel.handle}
                        </a>
                    </section>
                </blockquote>
            </div>
        </article>
    );
}

export default function TikTokFeed() {
    useEffect(() => {
        const existingScript = document.getElementById('tiktok-embed-script');

        if (existingScript) {
            existingScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'tiktok-embed-script';
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            script.remove();
        };
    }, []);

    return (
        <section className="relative border-y border-slate-200 bg-white py-12 dark:border-white/10 dark:bg-transparent md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-5 lg:sticky lg:top-24">
                        <p className="inline-flex items-center gap-2 text-xs font-bold uppercase text-red-400">
                            <span className="relative inline-flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                            </span>
                            ออนไลน์ตอนนี้
                        </p>

                        <h2 className="mt-5 -skew-x-12 text-5xl font-black uppercase leading-[1.25] text-slate-900 dark:text-white md:text-7xl">
                            <span className="block skew-x-12 bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">สดบน</span>
                            <span className="block skew-x-12 bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                TikTok
                            </span>
                        </h2>

                        <p className="mt-6 max-w-lg text-sm font-medium text-slate-600 dark:text-slate-300 md:text-base">
                            อัปเดตสินค้าใหม่ โปรโมชัน และตัวอย่างงานจริงแบบเรียลไทม์
                            จากทั้งสองช่อง เพื่อให้ลูกค้าเห็นคอนเทนต์ล่าสุดก่อนตัดสินใจสั่งผลิต
                        </p>

                        <div className="mt-7 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em]">
                            <span className="border border-red-300/60 bg-red-50 px-3 py-1 text-red-600 dark:border-red-500/40 dark:bg-red-950/40 dark:text-red-300">live updates</span>
                            <span className="border border-pink-300/60 bg-pink-50 px-3 py-1 text-pink-600 dark:border-pink-500/40 dark:bg-pink-950/40 dark:text-pink-300">new arrivals</span>
                            <span className="border border-rose-300/60 bg-rose-50 px-3 py-1 text-rose-600 dark:border-rose-500/40 dark:bg-rose-950/40 dark:text-rose-300">teamwear stories</span>
                        </div>
                    </div>

                    <div className="grid gap-5 lg:col-span-7 xl:grid-cols-2">
                        {channels.map((channel) => (
                            <TikTokChannelCard key={channel.handle} channel={channel} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

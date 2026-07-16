type SocialChannelButtonsProps = {
    className?: string;
    compact?: boolean;
};

const channels = [
    {
        label: 'Line',
        href: 'https://lin.ee/6DeBOxS?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6IutFKxQ8tLEffeh4yV4hhNnrWnIf5yZu4QayLZcYCBbskaBReQiuzJ_wk4w_aem_iw-o8rJoO1DOcwZpx-GKBA',
        classes: 'from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700',
        icon: () => (
            <img
                src="https://i.pinimg.com/1200x/a2/b3/f1/a2b3f1b555ef4a417358be56bfa4e54a.jpg"
                alt=""
                aria-hidden="true"
                className="block h-full w-full rounded-[3px] object-cover"
            />
        ),
    },
    {
        label: 'Facebook',
        href: 'https://www.facebook.com/JSSportGroup?locale=th_TH',
        classes: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="block h-full w-full">
                <path d="M13.5 22v-8.3h2.8l.4-3.2h-3.2V8.4c0-.9.3-1.5 1.6-1.5h1.8V4c-.8-.1-1.8-.2-2.9-.2-2.9 0-4.8 1.7-4.8 4.9v1.8H7v3.2h2.2V22h4.3z" />
            </svg>
        ),
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@j.s.sport_shop',
        classes: 'from-slate-800 to-black hover:from-slate-900 hover:to-black',
        icon: () => (
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="block h-full w-full">
                <path d="M15.8 3c.6 2.4 2.1 3.9 4.4 4.3v2.5c-1.5 0-2.8-.4-4.1-1.2v6.1c0 3.2-2.2 5.5-5.5 5.5S5 18 5 14.7c0-3.3 2.5-5.8 6.1-5.8.3 0 .6 0 .9.1v2.8c-.3-.1-.6-.1-.9-.1-1.9 0-3.1 1.3-3.1 3s1.2 3 3 3c1.8 0 3.1-1.3 3.1-3V3h1.7Z" />
            </svg>
        ),
    },
    {
        label: 'Shopee',
        href: 'https://shopee.co.th/jssportgroup?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR5zfkIUz2zOc-pduvSxGlGTKvmfFaXzZZOJmatv4ijDkG6reiDNd_A_VfGOEA_aem_Jw8UKorSC1ubiRV0VGf88Q',
        classes: 'from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700',
        icon: () => (
            <img
                src="https://i.pinimg.com/1200x/77/7d/c8/777dc8f47b66af05caff4015d5f416d8.jpg"
                alt=""
                aria-hidden="true"
                className="block h-full w-full rounded-[3px] object-cover"
            />
        ),
    },
];

export default function SocialChannelButtons({ className, compact = false }: SocialChannelButtonsProps) {
    return (
        <div className={`flex flex-wrap gap-3 ${className ?? ''}`}>
            {channels.map((channel) => (
                <a
                    key={channel.label}
                    href={channel.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={channel.label}
                    title={channel.label}
                    className={`inline-flex items-center justify-center bg-gradient-to-r text-white transition hover:-translate-y-0.5 ${compact ? 'h-10 w-10' : 'h-12 w-12'} ${channel.classes}`}
                    style={{
                        clipPath:
                            'polygon(18% 0, 100% 0, 100% 82%, 82% 100%, 0 100%, 0 18%)',
                    }}
                >
                    <span className="h-5 w-5">{channel.icon()}</span>
                </a>
            ))}
        </div>
    );
}
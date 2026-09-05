import type { PartnerBrandLogoItem } from '@/components/home/types';

type PartnerLogosProps = {
    logos: PartnerBrandLogoItem[];
};

export default function PartnerLogos({ logos }: PartnerLogosProps) {
    return (
        <section className="bg-white py-12 dark:bg-transparent md:py-16">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <p className="mb-8 text-xs font-semibold uppercase text-pink-500 md:mb-10">
                    คู่ค้าของเรา
                </p>

                {logos.length > 0 ? (
                    <div className="overflow-hidden py-6">
                        <div
                            className="flex w-max whitespace-nowrap animate-marquee"
                            style={{ width: 'max-content' }}
                        >
                            {[0, 1].map((track) => (
                                <div
                                    key={track}
                                    className="flex items-center gap-10 pr-10 md:gap-14 md:pr-14"
                                >
                                    {logos.map((brand, index) => (
                                        <img
                                            key={`${track}-${brand.id}`}
                                            src={brand.logoUrl}
                                            alt={`${brand.name} logo`}
                                            className={`h-[3.75rem] w-auto object-contain transition-all duration-300 md:h-[5.25rem] ${
                                                index % 2 === 0
                                                    ? 'hover:drop-shadow-[0_0_12px_rgba(37,99,235,0.35)]'
                                                    : 'hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.35)]'
                                            }`}
                                            loading="lazy"
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                        ยังไม่มีแบนเนอร์ที่เปิดใช้งานสำหรับแสดงในส่วนคู่ค้าของเรา
                    </p>
                )}
            </div>
        </section>
    );
}

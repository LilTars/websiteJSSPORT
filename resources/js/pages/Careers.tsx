import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import SocialChannelButtons from '@/components/social-channel-buttons';
import SeoHead from '@/components/seo/seo-head';
import { trackPageView } from '@/lib/track-click';
import PublicLayout from '@/layouts/public-layout';

type CareerBenefit = {
    title: string;
    detail: string;
};

type HiringStep = {
    number: string;
    title: string;
    detail: string;
};

type OpenPosition = {
    id: number;
    title: string;
    team: string | null;
    location: string | null;
    type: string | null;
    description: string | null;
};

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Careers: PageWithLayout = () => {
    const { props } = usePage<{
        benefits: CareerBenefit[];
        hiringSteps: HiringStep[];
        openPositions: OpenPosition[];
    }>();
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);

    const contactChannels = [
        {
            label: 'Facebook',
            href: 'https://www.facebook.com/JSSportGroup?locale=th_TH',
            accent: 'from-blue-600 to-blue-700',
            text: 'Facebook: JSSportGroup',
        },
        {
            label: 'LINE',
            href: 'https://lin.ee/6DeBOxS?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6IutFKxQ8tLEffeh4yV4hhNnrWnIf5yZu4QayLZcYCBbskaBReQiuzJ_wk4w_aem_iw-o8rJoO1DOcwZpx-GKBA',
            accent: 'from-emerald-500 to-green-600',
            text: 'LINE: JS SPORT',
        },
        {
            label: 'โทร',
            href: 'tel:0813209725',
            accent: 'from-pink-500 to-red-600',
            text: 'โทร: 0813209725',
        },
    ];

    useEffect(() => {
        trackPageView('careers');
    }, []);

    return (
        <>
            <SeoHead
                title="ร่วมงานกับเรา"
                description="ร่วมงานกับ JSSPORT ดูตำแหน่งงานที่เปิดรับและสมัครเข้าทีมผู้เชี่ยวชาญด้านชุดกีฬา"
                path="/careers"
                keywords={['งาน JSSPORT', 'สมัครงานโรงงานชุดกีฬา', 'careers sportwear']}
            />

            <section className="relative overflow-hidden border-b border-pink-100 bg-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.17),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(248,113,113,0.12),transparent_30%)]" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">
                            Careers at JS Sport Group
                        </p>
                        <h1 className="mt-4 text-4xl font-black uppercase leading-[0.86] tracking-tight md:text-6xl lg:text-7xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                ร่วมงานกับเรา
                            </span>
                        </h1>
                        <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
                            ถ้าคุณชอบงานกีฬา ชอบงานดีไซน์ และอยากสร้างผลงานที่ได้เห็นการใช้งานจริง
                            เรากำลังมองหาคนที่พร้อมเติบโตไปกับทีมของ บริษัท เจ.เอส.สปอร์ต กรุ๊ป จำกัด
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#open-positions"
                                className="inline-flex items-center bg-gradient-to-r from-pink-500 to-red-600 px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                ดูตำแหน่งงาน
                            </a>
                            <Link
                                href="/contact"
                                className="inline-flex items-center border border-pink-200 bg-white px-6 py-3 text-sm font-black uppercase tracking-[0.18em] text-slate-900 transition hover:-translate-y-0.5 hover:border-pink-400 hover:text-pink-600"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                สอบถามเพิ่มเติม
                            </Link>
                        </div>
                    </div>

                    <div
                        className="relative overflow-hidden border border-pink-200 bg-white p-6 shadow-[0_28px_60px_-32px_rgba(244,114,182,0.45)] md:p-8"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 0 100%)',
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-red-500 to-rose-500" />
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-pink-500">
                            Why Join Us
                        </p>
                        <div className="mt-5 grid gap-4">
                            {props.benefits.map((item) => (
                                <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm font-black uppercase tracking-[0.12em] text-slate-900">
                                        {item.title}
                                    </p>
                                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                                        {item.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="open-positions" className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            Open Positions
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                ตำแหน่งที่เปิดรับ
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        {props.openPositions.map((position) => (
                            <article
                                key={position.id}
                                className="group relative overflow-hidden border border-pink-100 bg-white p-6 shadow-[0_20px_46px_-35px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-[0_28px_50px_-30px_rgba(244,114,182,0.35)] md:p-8"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
                                }}
                            >
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-pink-600">
                                    {position.team ?? 'Recruitment'}
                                </p>
                                <h3 className="mt-4 text-2xl font-black uppercase leading-tight text-slate-900">
                                    {position.title}
                                </h3>
                                <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                                    {position.location ?? '-'} | {position.type ?? '-'}
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                    {position.description ?? 'ติดต่อทีมงานเพื่อดูรายละเอียดเพิ่มเติม'}
                                </p>
                                <div className="mt-5">
                                    <button
                                        type="button"
                                        onClick={() => setIsContactDialogOpen(true)}
                                        className="inline-flex items-center bg-gradient-to-r from-pink-500 to-red-600 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
                                        style={{
                                            clipPath:
                                                'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)',
                                        }}
                                    >
                                        สมัครตำแหน่งนี้
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-pink-100 bg-gradient-to-b from-white to-pink-50/50 py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            Hiring Process
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase tracking-tight md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                ขั้นตอนการสมัครงาน
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {props.hiringSteps.map((step) => (
                            <article
                                key={step.number}
                                className="relative border border-pink-100 bg-white p-6 shadow-[0_16px_40px_-34px_rgba(239,68,68,0.4)] md:p-7"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                                }}
                            >
                                <p className="text-4xl font-black leading-none text-pink-100">
                                    {step.number}
                                </p>
                                <h3 className="mt-4 text-2xl font-black uppercase text-slate-900">
                                    {step.title}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                                    {step.detail}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div
                        className="relative overflow-hidden border border-pink-200 bg-white p-7 shadow-[0_24px_58px_-32px_rgba(244,114,182,0.42)] md:p-10"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
                        }}
                    >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(244,114,182,0.15),transparent_34%)]" />
                        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                                    Start Your Journey
                                </p>
                                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-5xl">
                                    <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                        ส่งโปรไฟล์มาร่วมทีมกับเรา
                                    </span>
                                </h2>
                                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">
                                    ติดต่อทีม HR ผ่าน Call Center หรือ Line เพื่อส่งประวัติและพอร์ตผลงาน
                                    เราพร้อมพูดคุยและแนะนำตำแหน่งที่เหมาะกับคุณ
                                </p>
                            </div>

                            <div className="grid gap-3 text-sm">
                                <p className="font-semibold text-slate-900">Call Center</p>
                                <p className="text-slate-600">0813209725</p>
                                <p className="font-semibold text-slate-900">Line</p>
                                <p className="text-slate-600">JS SPORT</p>
                                <p className="text-slate-600">Facebook: JSSportGroup</p>
                                <p className="text-slate-600">TikTok: @j.s.sport_shop / @mesport80</p>
                                <SocialChannelButtons className="mt-2" compact />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
                <DialogContent className="w-[96vw] max-w-lg">
                    <DialogHeader>
                        <DialogTitle>ติดต่อเพื่อสมัครตำแหน่งนี้</DialogTitle>
                        <DialogDescription>เลือกช่องทางที่สะดวกสำหรับติดต่อทีมงานได้ทันที</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 grid gap-3">
                        {contactChannels.map((channel) => (
                            <a
                                key={channel.label}
                                href={channel.href}
                                target={channel.href.startsWith('http') ? '_blank' : undefined}
                                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                                className={`inline-flex items-center justify-center bg-gradient-to-r ${channel.accent} px-4 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5`}
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                                }}
                            >
                                {channel.text}
                            </a>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

Careers.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Careers;
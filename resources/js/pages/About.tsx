import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import SeoHead from '@/components/seo/seo-head';
import SocialChannelButtons from '@/components/social-channel-buttons';
import PublicLayout from '@/layouts/public-layout';
import { trackPageView } from '@/lib/track-click';
import {
    legacyFeaturesMock,
    productionCapabilitiesMock,
    serviceGroupsMock,
} from '@/mock/menu-data';

const legacyFeatures = legacyFeaturesMock;
const serviceGroups = serviceGroupsMock;
const productionCapabilities = productionCapabilitiesMock;

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const About: PageWithLayout = () => {
    useEffect(() => {
        trackPageView('about');
    }, []);

    return (
        <>
            <SeoHead
                title="เกี่ยวกับเรา"
                description="รู้จัก JSSPORT ผู้เชี่ยวชาญด้านชุดกีฬาและงานผลิตครบวงจร พร้อมประสบการณ์ยาวนานกว่า 40 ปี"
                path="/about"
                keywords={['เกี่ยวกับ JSSPORT', 'โรงงานชุดกีฬา', 'ผลิตเสื้อกีฬา']}
            />

            <section className="relative overflow-hidden border-b border-pink-100 bg-white">
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.16),transparent_34%),radial-gradient(circle_at_85%_22%,rgba(248,113,113,0.12),transparent_26%)]" />
                <div className="relative mx-auto grid max-w-7xl gap-10 px-4 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pink-500">
                            About JS Sport Group
                        </p>
                        <h1 className="mt-4 max-w-5xl text-4xl font-black uppercase leading-[1.25] md:text-6xl lg:text-7xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                บริษัท เจ.เอส.สปอร์ต กรุ๊ป จำกัด
                            </span>
                        </h1>
                        <p className="mt-6 max-w-3xl text-sm font-medium leading-relaxed text-slate-600 md:text-base">
                            ด้วยประสบการณ์กว่า 40 ปี ในงานด้านชุดกีฬา เราผสานความเชี่ยวชาญด้านการผลิต
                            เครื่องจักรที่ทันสมัย และความละเอียดประณีต เพื่อสร้างงานที่ตอบโจทย์ทั้งด้านภาพลักษณ์
                            คุณภาพ และการใช้งานจริงสำหรับลูกค้าทุกระดับ
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link
                                href="/contact"
                                className="inline-flex items-center bg-gradient-to-r from-pink-500 to-red-600 px-6 py-3 text-sm font-black uppercase text-white transition hover:-translate-y-0.5"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                ติดต่อทีมงาน
                            </Link>
                            <a
                                href="https://www.google.com/maps?cid=17269871248021325741&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF&hl=th-TH&source=embed"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center border border-pink-200 bg-white px-6 py-3 text-sm font-black uppercase text-slate-900 transition hover:-translate-y-0.5 hover:border-pink-400 hover:text-pink-600"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%)',
                                }}
                            >
                                ดูแผนที่ร้าน
                            </a>
                        </div>
                    </div>

                    <div
                        className="relative overflow-hidden border border-pink-200 bg-white p-6 shadow-[0_28px_60px_-32px_rgba(244,114,182,0.45)] md:p-8"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)',
                        }}
                    >
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 via-red-500 to-rose-500" />
                        <p className="text-[11px] font-black uppercase tracking-[0.26em] text-pink-500">
                            Legacy & Craft
                        </p>
                        <p className="mt-4 text-lg font-semibold leading-relaxed text-slate-900 md:text-xl">
                            “เรามีความเชี่ยวชาญในการผลิตชุดกีฬา พร้อมงานตกแต่งครบระบบ
                            เพื่อให้งานทุกชิ้นดูดี ทนทาน และพร้อมใช้งานจริงในทุกบริบท”
                        </p>
                        <div className="mt-8 grid gap-4 sm:grid-cols-3">
                            {legacyFeatures.map((feature) => (
                                <div key={feature.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-500">
                                        {feature.title}
                                    </p>
                                    <p className="mt-3 text-sm leading-relaxed text-slate-600">
                                        {feature.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            Core Services
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase leading-[1.25] md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                บริการหลักของเรา
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-3">
                        {serviceGroups.map((service) => (
                            <article
                                key={service.title}
                                className="group relative overflow-hidden border border-pink-100 bg-white p-6 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.3)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_55px_-30px_rgba(244,114,182,0.35)] md:p-7"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 22px) 0, 100% 22px, 100% 100%, 0 100%)',
                                }}
                            >
                                <div className={`h-1 w-20 bg-gradient-to-r ${service.accent}`} />
                                <h3 className="mt-5 text-2xl font-black uppercase leading-tight text-slate-900">
                                    {service.title}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                                    {service.detail}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-y border-pink-100 bg-gradient-to-b from-white to-pink-50/50 py-12 md:py-16">
                <div className="mx-auto max-w-7xl px-4 md:px-8">
                    <div className="mb-8 md:mb-10">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            Production Flow
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase leading-[1.25] md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                มาตรฐานการทำงานที่ไว้ใจได้
                            </span>
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">
                        {productionCapabilities.map((capability) => (
                            <article
                                key={capability.step}
                                className="relative border border-pink-100 bg-white p-6 shadow-[0_16px_40px_-34px_rgba(239,68,68,0.4)] md:p-7"
                                style={{
                                    clipPath:
                                        'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
                                }}
                            >
                                <p className="text-4xl font-black leading-none text-pink-100">
                                    {capability.step}
                                </p>
                                <h3 className="mt-4 text-2xl font-black uppercase text-slate-900">
                                    {capability.title}
                                </h3>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                                    {capability.detail}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-12 md:py-16">
                <div className="mx-auto grid max-w-7xl gap-8 px-4 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">
                            Contact & Location
                        </p>
                        <h2 className="mt-2 text-3xl font-black uppercase leading-[1.25] md:text-6xl">
                            <span className="bg-gradient-to-r from-pink-500 to-red-600 bg-clip-text text-transparent">
                                พร้อมดูแลทุกการติดต่อ
                            </span>
                        </h2>

                        <div className="mt-8 grid gap-4">
                            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.35)]">
                                <p className="text-xs font-black uppercase text-pink-500">
                                    Call Center / บริการลูกค้า
                                </p>
                                <p className="mt-4 text-lg font-semibold text-slate-900">
                                    โทร. 0813209725
                                </p>
                                <p className="mt-2 text-sm text-slate-600 md:text-base">
                                    Facebook: JSSportGroup
                                </p>
                                <p className="mt-1 text-sm text-slate-600 md:text-base">
                                    Line: JS SPORT
                                </p>
                                <p className="mt-1 text-sm text-slate-600 md:text-base">
                                    TikTok: @j.s.sport_shop / @mesport80
                                </p>
                                <SocialChannelButtons className="mt-5" compact />
                            </div>

                            <div className="rounded-3xl border border-pink-100 bg-white p-6 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.35)]">
                                <p className="text-xs font-black uppercase tracking-[0.22em] text-pink-500">
                                    Customer Type
                                </p>
                                <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                                    เราดูแลงานสำหรับโรงเรียน หน่วยงานราชการ องค์กร ห้างร้าน บริษัท และทีมกีฬา
                                    ที่ต้องการงานชุดกีฬาและงานยูนิฟอร์มที่มีคุณภาพอย่างมืออาชีพ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        className="relative overflow-hidden border border-pink-100 bg-gradient-to-b from-white to-pink-50/40 p-3 shadow-[0_26px_55px_-34px_rgba(244,114,182,0.42)] md:p-4"
                        style={{
                            clipPath:
                                'polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 0 100%)',
                        }}
                    >
                        <div className="pointer-events-none absolute inset-x-6 top-4 h-16 rounded-full bg-pink-200/35 blur-2xl" />
                        <div className="relative overflow-hidden rounded-[1.4rem] border border-pink-100 bg-white">
                            <div className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-pink-500 via-red-500 to-rose-500" />
                            <iframe
                                title="JS Sport Group location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3811.468397474679!2d102.43914099999999!3d17.196052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3123bf57c158460f%3A0xefaae8667f0b07ad!2z4LmA4LiILuC5gOC4reC4qi7guKrguJvguK3guKPguYzguJUg4Lir4LiZ4Lit4LiH4Lia4Lix4Lin4Lil4Liz4Lig4Li5!5e0!3m2!1sth!2sth!4v1784185371606!5m2!1sth!2sth"
                                className="h-[420px] w-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="strict-origin-when-cross-origin"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

About.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default About;
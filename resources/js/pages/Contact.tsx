import { Head } from '@inertiajs/react';
import type { ReactElement, ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Contact: PageWithLayout = () => {
    return (
        <>
            <Head title="ติดต่อ" />

            <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-14 pt-10 md:grid-cols-2 md:px-8 md:pt-14">
                <div className="space-y-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sport-accent">
                        ขอใบเสนอราคา
                    </p>
                    <h1 className="text-3xl font-black uppercase leading-tight md:text-5xl">
                        บอกรายละเอียดที่ทีมคุณต้องการ
                    </h1>
                    <p className="max-w-md text-sm leading-relaxed text-sport-slate dark:text-slate-300 md:text-base">
                        แจ้งความต้องการของคุณ แล้วทีมงานจะส่งใบเสนอราคาแบบละเอียด
                        พร้อมระยะเวลาผลิต ตัวเลือกจำนวน และราคา
                    </p>

                    <div className="rounded-2xl border border-black/10 bg-white/70 p-5 text-sm backdrop-blur dark:border-white/10 dark:bg-white/5">
                        <p className="font-semibold">ช่องทางติดต่อด่วน</p>
                        <p className="mt-2 text-sport-slate dark:text-slate-300">
                            Facebook: JSSportGroup
                        </p>
                        <p className="text-sport-slate dark:text-slate-300">
                            LINE: JS SPORT
                        </p>
                        <p className="text-sport-slate dark:text-slate-300">
                            TikTok: @j.s.sport_shop / @mesport80
                        </p>
                        <p className="text-sport-slate dark:text-slate-300">
                            โทร: 0813209725
                        </p>
                    </div>
                </div>

                <div
                    className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 md:p-7"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sport-accent">
                        ช่องทางติดต่อทางร้าน
                    </p>
                    <h2 className="mt-3 text-2xl font-black uppercase leading-tight md:text-3xl">
                        เลือกช่องทางที่สะดวก
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-sport-slate dark:text-slate-300 md:text-base">
                        ติดต่อทีมงานได้ทันทีผ่าน Line, Facebook หรือโทรหาเราโดยตรง
                    </p>

                    <div className="mt-6 grid gap-3">
                        <a
                            href="https://lin.ee/6DeBOxS?fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExanFyZlVsa1lIR1NzY2tad3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR6IutFKxQ8tLEffeh4yV4hhNnrWnIf5yZu4QayLZcYCBbskaBReQiuzJ_wk4w_aem_iw-o8rJoO1DOcwZpx-GKBA"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                            }}
                        >
                            LINE: JS SPORT
                        </a>

                        <a
                            href="https://www.facebook.com/JSSportGroup?locale=th_TH"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                            }}
                        >
                            FACEBOOK: JSSPORTGROUP
                        </a>

                        <a
                            href="tel:0813209725"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:-translate-y-0.5"
                            style={{
                                clipPath:
                                    'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 0 100%)',
                            }}
                        >
                            โทร 0813209725
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
};

Contact.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Contact;

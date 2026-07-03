import { Head } from '@inertiajs/react';
import { useState } from 'react';
import type { FormEvent, ReactElement, ReactNode } from 'react';
import PublicLayout from '@/layouts/public-layout';

type Branch = 'JS SPORT' | 'ME SPORT';
type Category = 'Jerseys' | 'PE kits' | 'Office uniforms' | 'Gear' | 'Shoes';

type QuoteForm = {
    name: string;
    phoneLine: string;
    branch: Branch;
    category: Category;
    details: string;
};

const initialForm: QuoteForm = {
    name: '',
    phoneLine: '',
    branch: 'JS SPORT',
    category: 'Jerseys',
    details: '',
};

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Contact: PageWithLayout = () => {
    const [form, setForm] = useState<QuoteForm>(initialForm);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
    };

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
                            LINE: @jssportteam
                        </p>
                        <p className="text-sport-slate dark:text-slate-300">
                            โทร: 08x-xxx-xxxx
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-black/10 bg-white/75 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 md:p-7"
                >
                    <div className="grid gap-4">
                        <label className="grid gap-2">
                            <span className="text-sm font-semibold">Name</span>
                            <input
                                value={form.name}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        name: event.target.value,
                                    }))
                                }
                                required
                                className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-sport-accent dark:border-white/20 dark:bg-[#0f1218]"
                                placeholder="ชื่อ-นามสกุล"
                            />
                        </label>

                        <label className="grid gap-2">
                            <span className="text-sm font-semibold">โทรศัพท์ / LINE</span>
                            <input
                                value={form.phoneLine}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        phoneLine: event.target.value,
                                    }))
                                }
                                required
                                className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-sport-accent dark:border-white/20 dark:bg-[#0f1218]"
                                placeholder="08x-xxx-xxxx หรือ LINE ID"
                            />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-2">
                                <span className="text-sm font-semibold">สาขา</span>
                                <select
                                    value={form.branch}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            branch: event.target.value as Branch,
                                        }))
                                    }
                                    className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-sport-accent dark:border-white/20 dark:bg-[#0f1218]"
                                >
                                    <option value="JS SPORT">JS SPORT</option>
                                    <option value="ME SPORT">ME SPORT</option>
                                </select>
                            </label>

                            <label className="grid gap-2">
                                <span className="text-sm font-semibold">
                                    หมวดหมู่สินค้า
                                </span>
                                <select
                                    value={form.category}
                                    onChange={(event) =>
                                        setForm((current) => ({
                                            ...current,
                                            category: event.target.value as Category,
                                        }))
                                    }
                                    className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-sport-accent dark:border-white/20 dark:bg-[#0f1218]"
                                >
                                    <option value="Jerseys">เสื้อแข่ง</option>
                                    <option value="PE kits">ชุดพละ</option>
                                    <option value="Office uniforms">ยูนิฟอร์มองค์กร</option>
                                    <option value="Gear">อุปกรณ์กีฬา</option>
                                    <option value="Shoes">รองเท้า</option>
                                </select>
                            </label>
                        </div>

                        <label className="grid gap-2">
                            <span className="text-sm font-semibold">รายละเอียดคำสั่งซื้อ</span>
                            <textarea
                                value={form.details}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        details: event.target.value,
                                    }))
                                }
                                required
                                rows={5}
                                className="rounded-xl border border-black/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-sport-accent dark:border-white/20 dark:bg-[#0f1218]"
                                placeholder="เช่น ประเภทกีฬา จำนวน สี กำหนดส่ง และตัวอย่างดีไซน์"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-5 w-full rounded-full bg-sport-accent px-5 py-3 text-sm font-black uppercase tracking-wide text-sport-black shadow-sport-glow transition hover:translate-y-[-1px]"
                    >
                        ส่งคำขอใบเสนอราคา
                    </button>

                    {submitted && (
                        <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-300">
                            ส่งข้อมูลจำลองสำเร็จแล้ว ใน Step 2 จะเชื่อมฟอร์มนี้เข้ากับ
                            Laravel backend เพื่อ validate และบันทึกข้อมูลจริง
                        </p>
                    )}
                </form>
            </section>
        </>
    );
};

Contact.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Contact;

import { useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import SeoHead from '@/components/seo/seo-head';
import PublicLayout from '@/layouts/public-layout';
import { openCookieSettings } from '@/lib/cookie-consent';
import { trackPageView } from '@/lib/track-click';

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const contactPhone = '081-320-9725';

function PhoneLink() {
    return (
        <a href="tel:0813209725" className="font-semibold text-pink-600 underline underline-offset-2 hover:text-pink-500 dark:text-pink-400">
            {contactPhone}
        </a>
    );
}

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) {
    return (
        <section id={id} className="scroll-mt-28 border-t border-slate-200 pt-8 dark:border-white/10">
            <h2 className="text-xl font-black leading-[1.35] text-slate-900 dark:text-white md:text-2xl">
                <span className="mr-2 text-pink-600 dark:text-pink-400">{number}</span>
                {title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-[1.85] text-slate-700 dark:text-slate-300 md:text-[15px]">
                {children}
            </div>
        </section>
    );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-white/10">
                <thead className="bg-slate-50 dark:bg-white/5">
                    <tr>
                        {head.map((cell) => (
                            <th key={cell} scope="col" className="px-4 py-3 font-bold text-slate-900 dark:text-white">
                                {cell}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/10">
                    {rows.map((row, index) => (
                        <tr key={index} className="align-top">
                            {row.map((cell, cellIndex) => (
                                <td key={cellIndex} className="px-4 py-3 leading-[1.7] text-slate-700 dark:text-slate-300">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Bullets({ items }: { items: ReactNode[] }) {
    return (
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" />
                    <span className="flex-1">{item}</span>
                </li>
            ))}
        </ul>
    );
}

function Callout({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-xl border-l-4 border-pink-500 bg-pink-50/70 px-4 py-3 text-sm leading-[1.85] text-slate-800 dark:bg-pink-500/10 dark:text-slate-200">
            {children}
        </div>
    );
}

const toc = [
    ['s1', '1. เราคือใคร'],
    ['s2', '2. เราเก็บข้อมูลอะไรบ้าง'],
    ['s3', '3. เราใช้ข้อมูลทำอะไร และใช้ฐานทางกฎหมายอะไร'],
    ['s4', '4. เราเปิดเผยข้อมูลให้ใครบ้าง'],
    ['s5', '5. ข้อมูลของท่านถูกเก็บไว้ที่ไหน'],
    ['s6', '6. เราเก็บข้อมูลไว้นานแค่ไหน'],
    ['s7', '7. สิทธิของท่าน'],
    ['s8', '8. ความปลอดภัยและการแจ้งเหตุละเมิด'],
    ['s9', '9. การเปลี่ยนแปลงนโยบาย'],
    ['s10', '10. การร้องเรียน'],
];

const Privacy: PageWithLayout = () => {
    useEffect(() => {
        trackPageView('privacy');
    }, []);

    return (
        <>
            <SeoHead
                title="นโยบายความเป็นส่วนตัว"
                description="นโยบายความเป็นส่วนตัวของ jssport.co.th ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562"
                path="/privacy"
                keywords={['นโยบายความเป็นส่วนตัว', 'PDPA', 'JSSPORT']}
            />

            <div className="mx-auto w-full max-w-4xl px-4 pb-20 pt-10 md:px-8 md:pt-14">
                <header>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-pink-600 dark:text-pink-400">Privacy Policy</p>
                    <h1 className="mt-3 text-3xl font-black leading-[1.25] text-slate-900 dark:text-white md:text-4xl">
                        นโยบายความเป็นส่วนตัว — jssport.co.th
                    </h1>
                    <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                        <span>ปรับปรุงล่าสุด: 1 ตุลาคม 2569</span>
                        <span aria-hidden="true">|</span>
                        <span>เวอร์ชัน: 1.3</span>
                        <span aria-hidden="true">|</span>
                        <span>มีผลบังคับใช้: 1 ตุลาคม 2569</span>
                    </p>
                </header>

                <nav aria-label="สารบัญ" className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="text-sm font-black text-slate-900 dark:text-white">สารบัญ</p>
                    <ol className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                        {toc.map(([id, label]) => (
                            <li key={id}>
                                <a href={`#${id}`} className="text-sm text-slate-700 underline-offset-4 hover:text-pink-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:text-slate-300 dark:hover:text-pink-400">
                                    {label}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="mt-10 space-y-10">
                    <Section id="s1" number="1." title="เราคือใคร">
                        <p>
                            บริษัท เจ.เอส.สปอร์ต กรุ๊ป จำกัด เลขทะเบียนนิติบุคคล 0395553000049 สำนักงานใหญ่ตั้งอยู่เลขที่ 175/47-48 หมู่ 2
                            ถนนวิไสยอุดรกิจ ตำบลหนองบัว อำเภอเมืองหนองบัวลำภู จังหวัดหนองบัวลำภู ผู้ให้บริการเว็บไซต์ jssport.co.th เป็น &ldquo;ผู้ควบคุมข้อมูลส่วนบุคคล&rdquo; ตาม พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                        </p>
                        <p>
                            ติดต่อเรื่องข้อมูลส่วนบุคคล: โทร <PhoneLink /> · ผู้รับผิดชอบ: นายนภัสดล วรรณธนะชานนท์ ผู้จัดการฝ่ายผลิตสื่อมีเดีย
                        </p>
                    </Section>

                    <Section id="s2" number="2." title="เราเก็บข้อมูลอะไรบ้าง">
                        <h3 className="pt-1 text-base font-bold text-slate-900 dark:text-white">2.1 เมื่อท่านสั่งซื้อสินค้า</h3>
                        <Bullets items={[
                            'ชื่อผู้รับ เบอร์โทรผู้รับ ที่อยู่จัดส่ง',
                            'รายการสินค้า จำนวน ยอดเงิน วันเวลาที่สั่ง',
                            'ข้อมูลสำหรับออกใบกำกับภาษี ถ้าท่านขอ (ชื่อ ที่อยู่ เลขประจำตัวผู้เสียภาษี)',
                        ]} />

                        <h3 className="pt-2 text-base font-bold text-slate-900 dark:text-white">2.2 ข้อมูลที่ระบบเก็บอัตโนมัติ</h3>
                        <p>
                            หมายเลขไอพี ประเภทเบราว์เซอร์และอุปกรณ์ หน้าที่ท่านเข้าชม และคุกกี้ ท่าน{' '}
                            <button type="button" onClick={openCookieSettings} className="font-semibold text-pink-600 underline underline-offset-2 hover:text-pink-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:text-pink-400">
                                ตั้งค่าคุกกี้
                            </button>{' '}
                            ได้ทุกเมื่อ
                        </p>

                        <h3 className="pt-2 text-base font-bold text-slate-900 dark:text-white">2.3 ผู้เยาว์</h3>
                        <p>การซื้อสินค้าบนเว็บไซต์นี้มีไว้สำหรับผู้ที่บรรลุนิติภาวะแล้ว</p>
                        <p>
                            หากท่านอายุไม่เกิน 10 ปี ต้องให้ผู้ปกครองเป็นผู้ให้ความยินยอมแทน และหากท่านเป็นผู้เยาว์ที่อายุเกิน 10 ปี แต่ยังไม่บรรลุนิติภาวะ
                            การให้ความยินยอมในเรื่องที่เกินกว่าที่ผู้เยาว์ทำได้เองตามกฎหมาย ต้องได้รับความยินยอมจากผู้ปกครองด้วย
                            ตามมาตรา 20 แห่ง พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
                        </p>
                        <p>
                            หากเราทราบว่าได้เก็บข้อมูลของผู้เยาว์โดยไม่มีความยินยอมที่ถูกต้อง เราจะลบข้อมูลนั้นโดยเร็ว แจ้งเราได้ที่โทร <PhoneLink />
                        </p>

                        <h3 className="pt-2 text-base font-bold text-slate-900 dark:text-white">2.4 สิ่งที่เราไม่เก็บ</h3>
                        <p>
                            เราไม่เก็บข้อมูลอ่อนไหวตามมาตรา 26 ได้แก่ เชื้อชาติ ศาสนา ความคิดเห็นทางการเมือง ประวัติอาชญากรรม ข้อมูลสุขภาพ ความพิการ
                            ข้อมูลพันธุกรรม และข้อมูลชีวมิติ
                        </p>
                        <p>หากท่านพิมพ์ข้อมูลลักษณะนี้ลงในช่องหมายเหตุเอง เราจะไม่นำไปใช้ประมวลผล และจะลบออกจากบันทึกเมื่อพบ</p>
                    </Section>

                    <Section id="s3" number="3." title="เราใช้ข้อมูลทำอะไร และใช้ฐานทางกฎหมายอะไร">
                        <Table
                            head={['วัตถุประสงค์', 'ฐานทางกฎหมาย']}
                            rows={[
                                ['รับคำสั่งซื้อ เก็บเงิน จัดส่ง เปลี่ยน-คืน และรับประกันสินค้า', 'ฐานสัญญา (ม.24 (3))'],
                                ['ตอบคำถามและดูแลหลังการขาย', 'ฐานสัญญา (ม.24 (3))'],
                                ['ออกใบเสร็จ ใบกำกับภาษี และเก็บเอกสารทางบัญชี', 'หน้าที่ตามกฎหมาย (ม.24 (6))'],
                                ['ป้องกันการฉ้อโกง การสั่งของปลอม และดูแลความปลอดภัยของระบบ', 'ประโยชน์โดยชอบด้วยกฎหมาย (ม.24 (5))'],
                                ['วิเคราะห์ยอดขายและความนิยมสินค้าเพื่อสั่งของและปรับปรุงเว็บไซต์', 'ประโยชน์โดยชอบด้วยกฎหมาย (ม.24 (5)) — ท่านคัดค้านได้ตาม ม.32'],
                                ['ส่งข่าวสาร โปรโมชัน และสินค้าเข้าใหม่ ทางอีเมล SMS หรือ LINE', 'ความยินยอม (ม.19) — ถอนได้ทุกเมื่อ'],
                                ['คุกกี้เพื่อการวิเคราะห์และโฆษณา', 'ความยินยอม (ม.19) — ตั้งค่าได้ทุกเมื่อ'],
                            ]}
                        />
                        <Callout>
                            การไม่ยินยอมรับข่าวสาร และการปฏิเสธคุกกี้ที่ไม่จำเป็น <strong>ไม่กระทบสิทธิ</strong>ในการสั่งซื้อ
                            หรือการรับประกันสินค้าของท่านแต่อย่างใด
                        </Callout>
                    </Section>

                    <Section id="s4" number="4." title="เราเปิดเผยข้อมูลให้ใครบ้าง">
                        <p><strong>เราไม่ขายและไม่แลกเปลี่ยนข้อมูลส่วนบุคคลของท่านเพื่อประโยชน์ทางการค้าของบุคคลที่สาม</strong></p>
                        <Table
                            head={['ผู้รับข้อมูล', 'ทำหน้าที่อะไร', 'ได้รับข้อมูลอะไร']}
                            rows={[
                                ['Hostatom (www.hostatom.com) ผู้ให้บริการโฮสต์และฐานข้อมูล', 'เก็บและประมวลผลข้อมูลเว็บไซต์', 'ข้อมูลทั้งหมดที่อยู่ในระบบ'],
                                ['ผู้ให้บริการขนส่ง ได้แก่ Flash Express, KEX Express (เดิมชื่อ Kerry Express), J&T Express และไปรษณีย์ไทย', 'จัดส่งสินค้า', 'ชื่อผู้รับ เบอร์โทร ที่อยู่จัดส่ง'],
                                ['หน่วยงานราชการ', 'เมื่อมีหน้าที่ตามกฎหมายหรือคำสั่งโดยชอบด้วยกฎหมาย', 'เท่าที่กฎหมายกำหนด'],
                            ]}
                        />
                    </Section>

                    <Section id="s5" number="5." title="ข้อมูลของท่านถูกเก็บไว้ที่ไหน">
                        <p>ข้อมูลส่วนบุคคลของท่านจัดเก็บบนเซิร์ฟเวอร์ที่ตั้งอยู่ในประเทศไทย</p>
                        <p>
                            หากในอนาคตมีความจำเป็นต้องส่งหรือโอนข้อมูลไปยังต่างประเทศ เราจะดำเนินการตามมาตรา 28–29
                            แห่ง พ.ร.บ.คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 และปรับปรุงนโยบายนี้ให้ท่านทราบก่อน
                        </p>
                    </Section>

                    <Section id="s6" number="6." title="เราเก็บข้อมูลไว้นานแค่ไหน">
                        <Table
                            head={['ชุดข้อมูล', 'ระยะเวลา']}
                            rows={[
                                ['ประวัติคำสั่งซื้อที่ผูกกับใบเสร็จ/ใบกำกับภาษี', '5 ปี ตาม พ.ร.บ.การบัญชี พ.ศ. 2543 ม.14 และประมวลรัษฎากร ม.87/3 — ลบก่อนกำหนดไม่ได้ แม้ท่านขอ'],
                                ['ข้อมูลติดต่อที่ให้ไว้เพื่อรับข่าวสาร', 'จนกว่าท่านจะถอนความยินยอม'],
                            ]}
                        />
                    </Section>

                    <Section id="s7" number="7." title="สิทธิของท่าน">
                        <Bullets items={[
                            'ขอเข้าถึงและขอสำเนาข้อมูล (ม.30)',
                            'ขอให้โอนย้ายข้อมูล (ม.31)',
                            'คัดค้านการประมวลผล รวมถึงคัดค้านการตลาดทางตรงได้ทุกเมื่อ (ม.32)',
                            'ขอให้ลบ ทำลาย หรือทำให้ไม่ระบุตัวตน (ม.33)',
                            'ขอให้ระงับการใช้ข้อมูล (ม.34)',
                            'ขอให้แก้ไขข้อมูลให้ถูกต้องเป็นปัจจุบัน (ม.35–36)',
                            'ถอนความยินยอมได้ทุกเมื่อ (ม.19) โดยง่ายเช่นเดียวกับตอนให้ความยินยอม',
                        ]} />
                        <p>
                            ยื่นคำขอได้ทางโทร <PhoneLink /> เราจะดำเนินการภายใน 30 วันนับแต่ได้รับคำขอ
                            หากปฏิเสธคำขอ เราจะบันทึกเหตุผลและแจ้งท่านทราบ
                        </p>
                        <p>
                            บางกรณีเราไม่สามารถลบข้อมูลได้ทั้งหมด เนื่องจากมีหน้าที่เก็บเอกสารตามกฎหมายบัญชีและภาษี หรือเพื่อการก่อตั้งสิทธิเรียกร้องตามกฎหมาย
                        </p>
                    </Section>

                    <Section id="s8" number="8." title="ความปลอดภัยและการแจ้งเหตุละเมิด">
                        <p>
                            เรามีมาตรการเชิงเทคนิคและเชิงบริหารจัดการ ได้แก่ เข้ารหัสข้อมูลระหว่างรับส่งด้วย HTTPS/TLS, เก็บรหัสผ่านแบบเข้ารหัสทางเดียว,
                            จำกัดสิทธิ์เข้าถึงข้อมูลเฉพาะผู้ที่จำเป็นต่อหน้าที่, ไม่เก็บข้อมูลบัตรชำระเงินไว้ในระบบของเรา, เก็บบันทึกการเข้าถึงข้อมูลลูกค้า,
                            และกำหนดรอบลบข้อมูลตามตารางในข้อ 6
                        </p>
                        <p>
                            หากเกิดเหตุละเมิดข้อมูลส่วนบุคคล เราจะแจ้งสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล <strong>ภายใน 72 ชั่วโมง</strong>
                            {' '}นับแต่ทราบเหตุเท่าที่จะสามารถทำได้ ตามมาตรา 37 (4) และหากเหตุนั้นมีความเสี่ยงสูงต่อสิทธิและเสรีภาพของท่าน
                            เราจะแจ้งท่านโดยไม่ชักช้าพร้อมแนวทางเยียวยา
                        </p>
                    </Section>

                    <Section id="s9" number="9." title="การเปลี่ยนแปลงนโยบาย">
                        <p>
                            หากมีการแก้ไขในสาระสำคัญ เราจะแจ้งล่วงหน้าทางเว็บไซต์และทางอีเมลที่ท่านให้ไว้ อย่างน้อย 30 วัน
                            ก่อนมีผลบังคับใช้ และจะระบุเลขเวอร์ชันกับวันที่ไว้ที่หัวเอกสารเสมอ
                        </p>
                    </Section>

                    <Section id="s10" number="10." title="การร้องเรียน">
                        <p>
                            หากท่านเห็นว่าเราไม่ปฏิบัติตามกฎหมาย ท่านมีสิทธิร้องเรียนต่อ สำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (สคส.) —{' '}
                            <a href="https://www.pdpc.or.th" target="_blank" rel="noreferrer" className="font-semibold text-pink-600 underline underline-offset-2 hover:text-pink-500 dark:text-pink-400">
                                www.pdpc.or.th
                            </a>
                        </p>
                    </Section>
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                    <p className="flex-1 text-sm text-slate-700 dark:text-slate-300">ต้องการเปลี่ยนการตั้งค่าคุกกี้ของท่าน?</p>
                    <button
                        type="button"
                        onClick={openCookieSettings}
                        className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:bg-white dark:text-slate-900 dark:hover:bg-pink-400 dark:hover:text-white"
                    >
                        ตั้งค่าคุกกี้
                    </button>
                </div>
            </div>
        </>
    );
};

Privacy.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Privacy;

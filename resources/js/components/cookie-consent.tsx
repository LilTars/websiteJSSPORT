import { Link } from '@inertiajs/react';
import { BarChart3, Cookie, Megaphone, ShieldCheck, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ACCEPT_ALL, REJECT_OPTIONAL, getConsent, getServerConsent, onConsentChange, saveConsent } from '@/lib/cookie-consent';
import type { ConsentState } from '@/lib/cookie-consent';

type OptionalCategory = 'analytics' | 'marketing';

type CategoryCopy = {
    key: OptionalCategory | 'necessary';
    icon: typeof ShieldCheck;
    title: string;
    detail: string;
    locked?: boolean;
};

const categories: CategoryCopy[] = [
    {
        key: 'necessary',
        icon: ShieldCheck,
        title: 'คุกกี้ที่จำเป็น',
        detail: 'ทำให้เว็บไซต์ทำงานได้ เช่น การเข้าสู่ระบบ ตะกร้าสินค้า และการจดจำการตั้งค่าคุกกี้ของท่าน ปิดไม่ได้',
        locked: true,
    },
    {
        key: 'analytics',
        icon: BarChart3,
        title: 'คุกกี้เพื่อการวิเคราะห์',
        detail: 'ช่วยให้เราเห็นว่าหน้าไหนได้รับความนิยม เพื่อนำไปปรับปรุงเว็บไซต์และการเลือกสินค้าเข้าร้าน',
    },
    {
        key: 'marketing',
        icon: Megaphone,
        title: 'คุกกี้เพื่อการตลาด',
        detail: 'ใช้แสดงโปรโมชันและสินค้าที่ตรงกับความสนใจของท่านมากขึ้น',
    },
];

export default function CookieConsent() {
    // The cookie only exists on the client, so the server snapshot is always
    // "not decided yet" and the banner appears after hydration.
    const consent = useSyncExternalStore(onConsentChange, getConsent, getServerConsent);
    const [isReopened, setIsReopened] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [draft, setDraft] = useState<Pick<ConsentState, 'analytics' | 'marketing'>>({
        analytics: false,
        marketing: false,
    });
    const panelRef = useRef<HTMLDivElement | null>(null);
    const isOpen = isReopened || consent === null;

    useEffect(() => {
        const reopen = () => {
            const stored = getConsent();
            setDraft({ analytics: stored?.analytics ?? false, marketing: stored?.marketing ?? false });
            setIsDetailOpen(true);
            setIsReopened(true);
        };

        window.addEventListener('jss:open-cookie-settings', reopen);

        return () => window.removeEventListener('jss:open-cookie-settings', reopen);
    }, []);

    const decide = useCallback((choice: Pick<ConsentState, 'analytics' | 'marketing'>) => {
        saveConsent({ necessary: true, ...choice });
        setIsReopened(false);
        setIsDetailOpen(false);
    }, []);

    useEffect(() => {
        if (!isDetailOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDetailOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);
        panelRef.current?.focus();

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isDetailOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            role="dialog"
            aria-modal={isDetailOpen}
            aria-labelledby="cookie-consent-title"
            className="fixed inset-x-0 bottom-0 z-[120] flex justify-center px-3 pb-3 sm:px-5 sm:pb-5"
        >
            <div
                ref={panelRef}
                tabIndex={-1}
                className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_60px_-20px_rgba(15,23,42,0.45)] outline-none dark:border-white/10 dark:bg-slate-900"
            >
                <div className="flex items-start gap-4 p-5 sm:p-6">
                    <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-pink-50 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300 sm:inline-flex">
                        <Cookie size={22} aria-hidden="true" />
                    </span>

                    <div className="min-w-0 flex-1">
                        <h2 id="cookie-consent-title" className="text-base font-black leading-[1.35] text-slate-900 dark:text-white sm:text-lg">
                            เว็บไซต์นี้ใช้คุกกี้
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            เราใช้คุกกี้ที่จำเป็นเพื่อให้เว็บไซต์ทำงานได้ และขอความยินยอมสำหรับคุกกี้เพื่อการวิเคราะห์และการตลาด
                            ท่านเลือกได้เอง และเปลี่ยนใจภายหลังได้ทุกเมื่อ การปฏิเสธไม่กระทบการสั่งซื้อหรือการรับประกันสินค้า
                            อ่านเพิ่มเติมได้ที่{' '}
                            <Link href="/privacy" className="font-semibold text-pink-600 underline underline-offset-2 hover:text-pink-500 dark:text-pink-400">
                                นโยบายความเป็นส่วนตัว
                            </Link>
                        </p>
                    </div>

                    <button
                        type="button"
                        aria-label="ปิด และปฏิเสธคุกกี้ที่ไม่จำเป็น"
                        onClick={() => decide(REJECT_OPTIONAL)}
                        className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                {isDetailOpen && (
                    <div className="border-t border-slate-200 px-5 pb-1 dark:border-white/10 sm:px-6">
                        <ul className="divide-y divide-slate-200 dark:divide-white/10">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                const checked = category.locked ? true : draft[category.key as OptionalCategory];

                                return (
                                    <li key={category.key} className="flex items-start gap-3 py-4">
                                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                            <Icon size={16} aria-hidden="true" />
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-bold leading-[1.35] text-slate-900 dark:text-white">{category.title}</p>
                                            <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{category.detail}</p>
                                        </div>

                                        {category.locked ? (
                                            <span className="mt-1 shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-500 dark:bg-white/10 dark:text-slate-400">
                                                เปิดเสมอ
                                            </span>
                                        ) : (
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={checked}
                                                aria-label={category.title}
                                                onClick={() => setDraft((current) => ({
                                                    ...current,
                                                    [category.key]: !current[category.key as OptionalCategory],
                                                }))}
                                                className={`mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                                                    checked ? 'bg-pink-600' : 'bg-slate-300 dark:bg-slate-600'
                                                }`}
                                            >
                                                <span
                                                    className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                                                        checked ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}

                <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.03] sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <button
                        type="button"
                        onClick={() => setIsDetailOpen((value) => !value)}
                        aria-expanded={isDetailOpen}
                        className="order-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 underline underline-offset-4 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:text-slate-300 dark:hover:text-white sm:order-1"
                    >
                        {isDetailOpen ? 'ซ่อนรายละเอียด' : 'ตั้งค่าคุกกี้'}
                    </button>

                    {/* Accept and reject carry the same visual weight - PDPA expects
                        withdrawing consent to be as easy as giving it. */}
                    <div className="order-1 grid gap-2 sm:order-2 sm:auto-cols-max sm:grid-flow-col">
                        <button
                            type="button"
                            onClick={() => decide(REJECT_OPTIONAL)}
                            className="rounded-xl border-2 border-slate-300 px-5 py-2.5 text-sm font-black text-slate-800 transition hover:border-slate-900 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-white/25 dark:text-white dark:hover:border-white dark:hover:bg-white/10"
                        >
                            ปฏิเสธที่ไม่จำเป็น
                        </button>

                        {isDetailOpen && (
                            <button
                                type="button"
                                onClick={() => decide(draft)}
                                className="rounded-xl border-2 border-slate-300 px-5 py-2.5 text-sm font-black text-slate-800 transition hover:border-slate-900 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-white/25 dark:text-white dark:hover:border-white dark:hover:bg-white/10"
                            >
                                บันทึกการตั้งค่า
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => decide(ACCEPT_ALL)}
                            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 dark:bg-white dark:text-slate-900 dark:hover:bg-pink-400 dark:hover:text-white dark:focus-visible:ring-offset-slate-900"
                        >
                            ยอมรับทั้งหมด
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

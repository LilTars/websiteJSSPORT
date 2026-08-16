import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/pages/backoffice/shared';

type Props = {
    links: PaginationLink[];
};

export default function PaginationLinks({ links }: Props) {
    return (
        <div className="flex flex-wrap gap-2">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <span
                            key={`link-${index}`}
                            className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={`link-${index}`}
                        href={link.url}
                        className={`rounded border px-2 py-1 text-xs ${link.active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
                        preserveState
                        preserveScroll
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

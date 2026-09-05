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
                            className="rounded border border-border px-2 py-1 text-xs text-muted-foreground/70"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={`link-${index}`}
                        href={link.url}
                        className={`rounded border px-2 py-1 text-xs transition-colors ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
                        preserveState
                        preserveScroll
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

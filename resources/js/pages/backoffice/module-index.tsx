import { Head, Link, usePage } from '@inertiajs/react';

type PaginatorLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginator<T> = {
    data: T[];
    links: PaginatorLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type ModuleIndexProps = {
    title: string;
    module: string;
    items: Paginator<Record<string, string | number | boolean | null>>;
};

function formatCell(value: string | number | boolean | null): string {
    if (value === null) {
        return '-';
    }

    if (typeof value === 'boolean') {
        return value ? 'Yes' : 'No';
    }

    return String(value);
}

export default function BackofficeModuleIndex() {
    const { props } = usePage<ModuleIndexProps>();

    const rows = props.items.data;
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

    return (
        <>
            <Head title={props.title} />

            <div className="space-y-4 bg-background p-4 text-foreground md:p-6">
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Backoffice Module</p>
                    <h1 className="mt-2 text-2xl font-black text-foreground">{props.title}</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        โหมดนี้ใช้ Inertia props โดยตรง ไม่มี JSON API response
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-border bg-card">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border text-sm">
                            <thead className="bg-muted/60">
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column} className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide text-muted-foreground">
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {rows.map((row, index) => (
                                    <tr key={`${props.module}-${index}`}>
                                        {columns.map((column) => (
                                            <td key={`${props.module}-${index}-${column}`} className="whitespace-nowrap px-3 py-2 text-foreground">
                                                {formatCell(row[column] ?? null)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={1} className="px-3 py-8 text-center text-muted-foreground">
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-border px-3 py-3">
                        {props.items.links.map((link, index) => {
                            if (link.url === null) {
                                return (
                                    <span
                                        key={`${props.module}-link-${index}`}
                                        className="rounded border border-border px-2 py-1 text-xs text-muted-foreground/70"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={`${props.module}-link-${index}`}
                                    href={link.url}
                                    className={`rounded border px-2 py-1 text-xs ${link.active ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-foreground hover:bg-muted'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

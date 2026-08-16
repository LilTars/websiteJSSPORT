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

            <div className="space-y-4 p-4 text-slate-900 md:p-6">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Backoffice Module</p>
                    <h1 className="mt-2 text-2xl font-black text-slate-900">{props.title}</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        โหมดนี้ใช้ Inertia props โดยตรง ไม่มี JSON API response
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm">
                            <thead className="bg-slate-50">
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column} className="whitespace-nowrap px-3 py-2 text-left font-semibold uppercase tracking-wide text-slate-600">
                                            {column}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {rows.map((row, index) => (
                                    <tr key={`${props.module}-${index}`}>
                                        {columns.map((column) => (
                                            <td key={`${props.module}-${index}-${column}`} className="whitespace-nowrap px-3 py-2 text-slate-700">
                                                {formatCell(row[column] ?? null)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                {rows.length === 0 && (
                                    <tr>
                                        <td colSpan={1} className="px-3 py-8 text-center text-slate-500">
                                            No data
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 px-3 py-3">
                        {props.items.links.map((link, index) => {
                            if (link.url === null) {
                                return (
                                    <span
                                        key={`${props.module}-link-${index}`}
                                        className="rounded border border-slate-200 px-2 py-1 text-xs text-slate-400"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                );
                            }

                            return (
                                <Link
                                    key={`${props.module}-link-${index}`}
                                    href={link.url}
                                    className={`rounded border px-2 py-1 text-xs ${link.active ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
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

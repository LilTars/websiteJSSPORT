import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared primitives for every backoffice module screen.
 *
 * All colours resolve through the shadcn theme tokens (background / card /
 * border / muted-foreground), so each screen follows the light and dark palette
 * without page-specific overrides.
 */

export function BackofficePage({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('space-y-6 bg-background p-4 text-foreground md:p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function Panel({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm', className)} {...props}>
            {children}
        </div>
    );
}

export function PanelForm({ className, children, ...props }: React.ComponentProps<'form'>) {
    return (
        <form className={cn('rounded-2xl border border-border bg-card p-4 text-card-foreground shadow-sm', className)} {...props}>
            {children}
        </form>
    );
}

type PanelHeaderProps = {
    title: string;
    action?: React.ReactNode;
};

export function PanelHeader({ title, action }: PanelHeaderProps) {
    return (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            {action}
        </div>
    );
}

export function DataTable({ className, children, ...props }: React.ComponentProps<'table'>) {
    return (
        <div className="overflow-x-auto">
            <table className={cn('min-w-full divide-y divide-border text-sm', className)} {...props}>
                {children}
            </table>
        </div>
    );
}

export function TableHead({ columns }: { columns: React.ReactNode[] }) {
    return (
        <thead className="bg-muted/60">
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        scope="col"
                        className="px-3 py-2 text-left text-xs font-semibold uppercase text-muted-foreground"
                    >
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

export function TableBody({ className, children, ...props }: React.ComponentProps<'tbody'>) {
    return (
        <tbody className={cn('divide-y divide-border', className)} {...props}>
            {children}
        </tbody>
    );
}

export function Tr({ className, children, ...props }: React.ComponentProps<'tr'>) {
    return (
        <tr className={cn('transition-colors hover:bg-muted/40', className)} {...props}>
            {children}
        </tr>
    );
}

export function Td({ className, children, ...props }: React.ComponentProps<'td'>) {
    return (
        <td className={cn('px-3 py-2 align-middle', className)} {...props}>
            {children}
        </td>
    );
}

export function EmptyRow({ colSpan, children = 'ยังไม่มีข้อมูล' }: { colSpan: number; children?: React.ReactNode }) {
    return (
        <tr>
            <td colSpan={colSpan} className="px-3 py-10 text-center text-sm text-muted-foreground">
                {children}
            </td>
        </tr>
    );
}

const actionVariants = {
    neutral: 'border-border bg-muted/40 text-foreground hover:bg-muted focus-visible:ring-ring',
    edit: 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100 focus-visible:ring-sky-400 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300 dark:hover:bg-sky-500/20',
    enable: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus-visible:ring-emerald-400 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300 dark:hover:bg-emerald-500/20',
    disable: 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100 focus-visible:ring-amber-400 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300 dark:hover:bg-amber-500/20',
    danger: 'border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100 focus-visible:ring-rose-400 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20',
} as const;

export type ActionVariant = keyof typeof actionVariants;

type ActionButtonProps = React.ComponentProps<'button'> & {
    variant?: ActionVariant;
};

export function ActionButton({ variant = 'neutral', className, type = 'button', ...props }: ActionButtonProps) {
    return (
        <button
            type={type}
            className={cn(
                'rounded border px-2 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60',
                actionVariants[variant],
                className,
            )}
            {...props}
        />
    );
}

/** Toggle-active control: green when the row is off, amber when it is on. */
export function ToggleActiveButton({ isActive, className, ...props }: Omit<ActionButtonProps, 'variant' | 'children'> & { isActive: boolean }) {
    return (
        <ActionButton variant={isActive ? 'disable' : 'enable'} className={className} {...props}>
            {isActive ? 'ปิดใช้งาน' : 'เปิดใช้งาน'}
        </ActionButton>
    );
}

export function ActionGroup({ className, children, ...props }: React.ComponentProps<'div'>) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)} {...props}>
            {children}
        </div>
    );
}

export function NoPermission() {
    return <span className="text-xs text-muted-foreground">สิทธิ์ไม่เพียงพอ</span>;
}

export function PrimaryButton({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
    return (
        <button
            type={type}
            className={cn(
                'rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
            {...props}
        />
    );
}

export function SecondaryButton({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
    return (
        <button
            type={type}
            className={cn(
                'rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60',
                className,
            )}
            {...props}
        />
    );
}

export function CheckboxField({ label, className, ...props }: React.ComponentProps<'input'> & { label: string }) {
    return (
        <label className={cn('flex items-center gap-2 text-sm text-foreground', className)}>
            <input type="checkbox" className="size-4 rounded border-input accent-emerald-600" {...props} />
            {label}
        </label>
    );
}

export function StatusBadge({ isActive, activeLabel = 'ใช้งาน', inactiveLabel = 'ปิดใช้งาน' }: { isActive: boolean; activeLabel?: string; inactiveLabel?: string }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
                isActive
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                    : 'bg-muted text-muted-foreground',
            )}
        >
            {isActive ? activeLabel : inactiveLabel}
        </span>
    );
}

/** Neutral pill for free-form values such as an application status string. */
export function TextBadge({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <span className={cn('inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground', className)}>
            {children}
        </span>
    );
}

/** Square row thumbnail with a dashed placeholder when the record has no image. */
export function ImageThumb({ src, alt, className }: { src?: string | null; alt: string; className?: string }) {
    if (!src) {
        return (
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground', className)}>
                N/A
            </div>
        );
    }

    return <img src={src} alt={alt} className={cn('h-12 w-12 rounded-lg border border-border object-cover', className)} />;
}

export function PreviewFrame({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('overflow-hidden rounded-xl border border-border', className)}>{children}</div>;
}

export const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60';

export function TextInput({ className, ...props }: React.ComponentProps<'input'>) {
    return <input className={cn(fieldClass, className)} {...props} />;
}

export function TextArea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return <textarea className={cn(fieldClass, 'min-h-24 resize-y', className)} {...props} />;
}

export function SelectInput({ className, children, ...props }: React.ComponentProps<'select'>) {
    return (
        <select className={cn(fieldClass, className)} {...props}>
            {children}
        </select>
    );
}

export function FileInput({ className, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type="file"
            className={cn(
                'block w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground',
                className,
            )}
            {...props}
        />
    );
}

export function FieldHint({ children }: { children: React.ReactNode }) {
    return <p className="text-xs text-muted-foreground">{children}</p>;
}

export function UploadProgress({ percentage }: { percentage: number }) {
    return (
        <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percentage}%` }} />
        </div>
    );
}

export function GhostButton({ className, type = 'button', ...props }: React.ComponentProps<'button'>) {
    return (
        <button
            type={type}
            className={cn(
                'rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                className,
            )}
            {...props}
        />
    );
}

export function FieldLabel({ className, children, ...props }: React.ComponentProps<'label'>) {
    return (
        <label className={cn('text-sm font-semibold text-foreground', className)} {...props}>
            {children}
        </label>
    );
}

export function FormSection({ title, className, children }: { title: string; className?: string; children: React.ReactNode }) {
    return (
        <section className={cn('space-y-3 rounded-xl border border-border bg-muted/40 p-4', className)}>
            <p className="text-xs font-semibold uppercase text-muted-foreground">{title}</p>
            {children}
        </section>
    );
}

export function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('space-y-1.5', className)}>
            <span className="block text-xs font-semibold text-foreground">{label}</span>
            {children}
            <FieldError message={error} />
        </div>
    );
}

export function FieldError({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{message}</p>;
}

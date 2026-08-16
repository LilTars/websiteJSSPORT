export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
};

export type SharedPageProps = {
    currentTeam: {
        slug: string;
        role?: 'owner' | 'admin' | 'member';
        roleLabel?: string;
    } | null;
};

export type StatCard = {
    label: string;
    value: number;
};

export function backofficePath(currentTeamSlug: string, module: string): string {
    return `/${currentTeamSlug}/backoffice/${module}`;
}

export function boolLabel(value: boolean): string {
    return value ? 'ใช้งาน' : 'ปิดใช้งาน';
}

export function canManageTeam(role?: 'owner' | 'admin' | 'member'): boolean {
    return role === 'owner' || role === 'admin' || role === 'member';
}

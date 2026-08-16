type ClickEventType = 'page_view' | 'homepage_section_click' | 'product_category_click' | 'product_click';

type SiteClickPayload = {
    eventType: ClickEventType;
    page: string;
    pageKey?: string | null;
    section?: string | null;
    categoryName?: string | null;
    categorySlug?: string | null;
    productId?: number | null;
    productName?: string | null;
    referrer?: string | null;
};

export function trackPageView(page: 'home' | 'products' | 'about' | 'careers' | 'contact'): void {
    if (typeof window === 'undefined') {
        return;
    }

    trackSiteClick({
        eventType: 'page_view',
        page,
        pageKey: page,
        referrer: document.referrer || window.location.href,
    });
}

export function trackSiteClick(payload: SiteClickPayload): void {
    if (typeof window === 'undefined') {
        return;
    }

    const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content;

    if (!csrfToken) {
        return;
    }

    void fetch('/analytics/click', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({
            event_type: payload.eventType,
            page: payload.page,
            page_key: payload.pageKey ?? payload.page,
            section: payload.section ?? null,
            category_name: payload.categoryName ?? null,
            category_slug: payload.categorySlug ?? null,
            product_id: payload.productId ?? null,
            product_name: payload.productName ?? null,
            referrer: payload.referrer ?? window.location.href,
        }),
    }).catch(() => undefined);
}

export type ConsentCategory = 'necessary' | 'analytics' | 'marketing';

export type ConsentState = {
    necessary: true;
    analytics: boolean;
    marketing: boolean;
    /** ISO timestamp of the decision, kept so the choice can be re-confirmed after a policy update. */
    decidedAt: string;
    version: number;
};

/** Bump when the cookie categories change, so visitors are asked again. */
export const CONSENT_VERSION = 1;

const COOKIE_NAME = 'jss_cookie_consent';
const COOKIE_MAX_AGE_DAYS = 365;
const CONSENT_EVENT = 'jss:cookie-consent';

export const ACCEPT_ALL: Omit<ConsentState, 'decidedAt' | 'version'> = {
    necessary: true,
    analytics: true,
    marketing: true,
};

export const REJECT_OPTIONAL: Omit<ConsentState, 'decidedAt' | 'version'> = {
    necessary: true,
    analytics: false,
    marketing: false,
};

function readCookie(name: string): string | null {
    if (typeof document === 'undefined') {
        return null;
    }

    const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));

    return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function parseConsent(raw: string | null): ConsentState | null {
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as Partial<ConsentState>;

        // A stored decision from an older category set has to be asked again.
        if (parsed.version !== CONSENT_VERSION) {
            return null;
        }

        return {
            necessary: true,
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
            decidedAt: typeof parsed.decidedAt === 'string' ? parsed.decidedAt : new Date().toISOString(),
            version: CONSENT_VERSION,
        };
    } catch {
        return null;
    }
}

let cachedRaw: string | null | undefined;
let cachedState: ConsentState | null = null;

/**
 * Returns a stable object while the cookie is unchanged, so it is safe to use as
 * a `useSyncExternalStore` snapshot (a fresh object every call would loop).
 */
export function getConsent(): ConsentState | null {
    const raw = readCookie(COOKIE_NAME);

    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedState = parseConsent(raw);
    }

    return cachedState;
}

/** Server render has no cookie jar, so nothing is consented to yet. */
export function getServerConsent(): ConsentState | null {
    return null;
}

export function saveConsent(choice: Omit<ConsentState, 'decidedAt' | 'version'>): ConsentState {
    const state: ConsentState = {
        ...choice,
        necessary: true,
        decidedAt: new Date().toISOString(),
        version: CONSENT_VERSION,
    };

    if (typeof document !== 'undefined') {
        const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
        const secure = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(state))}; path=/; max-age=${maxAge}; SameSite=Lax${secure}`;
        window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: state }));
    }

    return state;
}

export function hasConsentFor(category: ConsentCategory): boolean {
    if (category === 'necessary') {
        return true;
    }

    return getConsent()?.[category] === true;
}

/** Lets the banner reopen from anywhere, e.g. the "ตั้งค่าคุกกี้" link in the footer. */
export function openCookieSettings(): void {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('jss:open-cookie-settings'));
    }
}

export function onConsentChange(handler: (state: ConsentState) => void): () => void {
    if (typeof window === 'undefined') {
        return () => undefined;
    }

    const listener = (event: Event) => handler((event as CustomEvent<ConsentState>).detail);
    window.addEventListener(CONSENT_EVENT, listener);

    return () => window.removeEventListener(CONSENT_EVENT, listener);
}

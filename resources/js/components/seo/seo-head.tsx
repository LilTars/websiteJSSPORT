import { Head, usePage } from '@inertiajs/react';

type SeoSharedProps = {
    seo?: {
        siteName?: string;
        baseUrl?: string;
        currentUrl?: string;
        defaultTitle?: string;
        defaultDescription?: string;
        defaultImage?: string;
        twitterSite?: string;
        locale?: string;
    };
};

type SeoHeadProps = {
    title?: string;
    description?: string;
    path?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    keywords?: string[];
    noindex?: boolean;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const toAbsoluteUrl = (value: string | undefined, baseUrl: string): string => {
    if (!value || value === '') {
        return baseUrl;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    if (value.startsWith('/')) {
        return `${baseUrl}${value}`;
    }

    return `${baseUrl}/${value}`;
};

const DESCRIPTION_LIMIT = 160;

// Product descriptions come from a rich-text field; search snippets need plain text.
const toPlainDescription = (value: string): string => {
    const text = value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

    return text.length > DESCRIPTION_LIMIT ? `${text.slice(0, DESCRIPTION_LIMIT - 3).trimEnd()}...` : text;
};

const SeoHead = ({
    title,
    description,
    path,
    image,
    type = 'website',
    keywords,
    noindex = false,
    jsonLd,
}: SeoHeadProps) => {
    const { props } = usePage<SeoSharedProps>();

    const siteName = props.seo?.siteName ?? 'JSSPORT';
    const baseUrl = props.seo?.baseUrl ?? 'https://jssport.co.th';
    const defaultTitle = props.seo?.defaultTitle ?? siteName;
    const defaultDescription =
        props.seo?.defaultDescription ??
        'JSSPORT ศูนย์รวมชุดกีฬา เสื้อทีม และอุปกรณ์กีฬา พร้อมผลิตตามแบบสำหรับโรงเรียน สโมสร และองค์กร';
    const defaultImage = props.seo?.defaultImage ?? '/images/logos/braner1.png';
    const locale = props.seo?.locale ?? 'th_TH';
    const twitterSite = props.seo?.twitterSite;

    const canonicalUrl = path ? toAbsoluteUrl(path, baseUrl) : props.seo?.currentUrl ?? baseUrl;
    const metaDescription = toPlainDescription(description || defaultDescription);
    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const ogImage = toAbsoluteUrl(image ?? defaultImage, baseUrl);
    const robots = noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const ldObjects = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Head title={fullTitle}>
            <meta head-key="description" name="description" content={metaDescription} />
            <meta head-key="robots" name="robots" content={robots} />
            {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            <link head-key="canonical" rel="canonical" href={canonicalUrl} />

            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:title" property="og:title" content={fullTitle} />
            <meta head-key="og:description" property="og:description" content={metaDescription} />
            <meta head-key="og:url" property="og:url" content={canonicalUrl} />
            <meta head-key="og:image" property="og:image" content={ogImage} />
            <meta head-key="og:locale" property="og:locale" content={locale} />

            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={fullTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={metaDescription} />
            <meta head-key="twitter:image" name="twitter:image" content={ogImage} />
            {twitterSite && <meta name="twitter:site" content={twitterSite} />}

            {ldObjects.map((entry, index) => (
                <script
                     
                    key={`json-ld-${index}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
                />
            ))}
        </Head>
    );
};

export default SeoHead;

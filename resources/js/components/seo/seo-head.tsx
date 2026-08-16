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
    const metaDescription = description ?? defaultDescription;
    const fullTitle = title ? `${title} | ${siteName}` : defaultTitle;
    const ogImage = toAbsoluteUrl(image ?? defaultImage, baseUrl);
    const robots = noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    const ldObjects = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Head title={fullTitle}>
            <meta name="description" content={metaDescription} />
            <meta name="robots" content={robots} />
            {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}

            <link rel="canonical" href={canonicalUrl} />

            <meta property="og:site_name" content={siteName} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:locale" content={locale} />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={ogImage} />
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

import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import HomePageContent from '@/components/home/home-page-content';
import { trackPageView } from '@/lib/track-click';
import SeoHead from '@/components/seo/seo-head';
import PublicLayout from '@/layouts/public-layout';

type HomeProductItem = {
    id: number;
    name: string;
    price: number | null;
    categorySlug: string | null;
    categoryName: string | null;
    imageUrl: string | null;
    hidePriceOnCard: boolean;
};

type PartnerBrandLogoItem = {
    id: number;
    name: string;
    logoUrl: string;
};

type PageWithLayout = {
    (): ReactElement;
    layout?: (page: ReactNode) => ReactNode;
};

const Home: PageWithLayout = () => {
    const { props } = usePage<{ npfcProducts?: HomeProductItem[]; mesportProducts?: HomeProductItem[]; latestProducts?: HomeProductItem[]; partnerBrandLogos?: PartnerBrandLogoItem[] }>();
    const productCount = (props.latestProducts ?? []).length;

    useEffect(() => {
        trackPageView('home');
    }, []);
    const homeSchema = [
        {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'JSSPORT',
            url: 'https://jssport.co.th',
            sameAs: [
                'https://www.facebook.com/JSSportGroup?locale=th_TH',
                'https://www.tiktok.com/@j.s.sport_shop',
                'https://www.tiktok.com/@mesport80',
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'JSSPORT',
            url: 'https://jssport.co.th',
            inLanguage: 'th-TH',
        },
    ];

    return (
        <>
            <SeoHead
                title="หน้าแรก"
                description={`JSSPORT ร้านชุดกีฬาและอุปกรณ์กีฬา พร้อมสินค้ามาใหม่ ${productCount} รายการล่าสุดสำหรับทีม โรงเรียน และองค์กร`}
                path="/"
                keywords={['ชุดกีฬา', 'อุปกรณ์กีฬา', 'เสื้อทีม', 'สั่งผลิตชุดกีฬา', 'JSSPORT']}
                jsonLd={homeSchema}
            />
            <HomePageContent
                npfcProducts={props.npfcProducts ?? []}
                mesportProducts={props.mesportProducts ?? []}
                latestProducts={props.latestProducts ?? []}
                partnerBrandLogos={props.partnerBrandLogos ?? []}
            />
        </>
    );
};

Home.layout = (page: ReactNode) => <PublicLayout>{page}</PublicLayout>;

export default Home;

import { usePage } from '@inertiajs/react';
import HeroSlider from '@/components/home/sections/hero-slider';
import LatestProducts from '@/components/home/sections/latest-products';
import LookbookGrid from '@/components/home/sections/lookbook-grid';
import MesportShowcase from '@/components/home/sections/mesport-showcase';
import NpfcCollection from '@/components/home/sections/npfc-collection';
import PartnerLogos from '@/components/home/sections/partner-logos';
import TikTokFeed from '@/components/home/sections/tiktok-feed';
import type { HomeProductItem, PartnerBrandLogoItem, RelativeBannerItem } from '@/components/home/types';

type HomePageContentProps = {
    npfcProducts: HomeProductItem[];
    mesportProducts: HomeProductItem[];
    latestProducts: HomeProductItem[];
    partnerBrandLogos: PartnerBrandLogoItem[];
};

const HomePageContent = ({ npfcProducts, mesportProducts, latestProducts, partnerBrandLogos }: HomePageContentProps) => {
    const { props } = usePage<{ relativeBanners?: RelativeBannerItem[] }>();
    const heroSlides = (props.relativeBanners ?? []).map((banner) => banner.imageUrl);

    return (
        <div className="relative isolate overflow-x-hidden bg-white dark:bg-transparent">
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(251,113,133,0.14),rgba(255,255,255,0.96)_28%,rgba(255,255,255,1)_60%),radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.14),transparent_34%),radial-gradient(circle_at_84%_20%,rgba(248,113,113,0.1),transparent_30%)] dark:bg-none" />

            <HeroSlider slides={heroSlides} />
            <LookbookGrid />
            <MesportShowcase products={mesportProducts} />
            <LatestProducts products={latestProducts} />
            <NpfcCollection products={npfcProducts} />
            <TikTokFeed />
            <PartnerLogos logos={partnerBrandLogos} />
        </div>
    );
};

export default HomePageContent;

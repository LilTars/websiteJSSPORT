export type HomeProductItem = {
    id: number;
    name: string;
    price: number | null;
    categorySlug: string | null;
    categoryName: string | null;
    imageUrl: string | null;
    hidePriceOnCard: boolean;
};

export type PartnerBrandLogoItem = {
    id: number;
    name: string;
    logoUrl: string;
};

export type RelativeBannerItem = {
    id: number;
    imageUrl: string;
};

export const HOME_PRODUCT_FALLBACK_IMAGE = '/images/logos/pd01.jpg';

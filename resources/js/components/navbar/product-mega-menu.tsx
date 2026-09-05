import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

export type NavCategory = {
    id: number;
    name: string;
    slug: string;
    productCount: number;
};

export type NavFeaturedProduct = {
    id: number;
    name: string;
    category: string | null;
    imageUrl: string | null;
};

export type NavCatalog = {
    categories: NavCategory[];
    featured: NavFeaturedProduct[];
};

export const PRODUCTS_FALLBACK_IMAGE = '/images/logos/pd01.jpg';

type ProductMegaMenuProps = {
    catalog: NavCatalog;
    isOpen: boolean;
    onNavigate: () => void;
} & Pick<React.HTMLAttributes<HTMLDivElement>, 'onMouseEnter' | 'onMouseLeave'>;

export default function ProductMegaMenu({ catalog, isOpen, onNavigate, onMouseEnter, onMouseLeave }: ProductMegaMenuProps) {
    const { categories, featured } = catalog;

    return (
        <div
            id="products-mega-menu"
            aria-hidden={!isOpen}
            inert={!isOpen ? true : undefined}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={`absolute inset-x-0 top-full hidden origin-top border-b border-gray-200 bg-white shadow-[0_24px_48px_-24px_rgba(15,23,42,0.35)] transition-all duration-200 ease-out dark:border-white/10 dark:bg-slate-950/95 dark:backdrop-blur-xl md:block ${
                isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
            }`}
        >
            <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-8 md:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:px-8">
                <div>
                    <p className="text-xs font-bold uppercase text-pink-600 dark:text-pink-400">
                        หมวดสินค้า
                    </p>

                    <ul className="mt-5 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                                    onClick={onNavigate}
                                    className="group flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-pink-50 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:text-slate-100 dark:hover:bg-white/5 dark:hover:text-pink-400"
                                >
                                    <span>{category.name}</span>
                                    <span className="text-xs font-bold text-gray-400 transition-colors group-hover:text-pink-500 dark:text-slate-500">
                                        {category.productCount}
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <Link
                        href="/products"
                        onClick={onNavigate}
                        className="mt-6 inline-flex items-center gap-2 border-b-2 border-gray-900 pb-1 text-sm font-black uppercase text-gray-900 transition-colors hover:border-pink-500 hover:text-pink-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 dark:border-slate-100 dark:text-slate-100 dark:hover:border-pink-400 dark:hover:text-pink-400"
                    >
                        ดูสินค้าทั้งหมด
                        <ArrowRight size={16} />
                    </Link>
                </div>

                {featured.length > 0 && (
                    <div>
                        <p className="text-xs font-bold uppercase text-pink-600 dark:text-pink-400">
                            สินค้าแนะนำ
                        </p>

                        <div className="mt-5 grid grid-cols-3 gap-4">
                            {featured.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/products/${product.id}`}
                                    onClick={onNavigate}
                                    className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
                                >
                                    <div className="aspect-[4/5] overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-white/10 dark:bg-white/5">
                                        <img
                                            src={product.imageUrl ?? PRODUCTS_FALLBACK_IMAGE}
                                            alt={product.name}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <p className="mt-2 text-[11px] font-bold uppercase text-pink-600 dark:text-pink-400">
                                        {product.category ?? '-'}
                                    </p>
                                    <p className="text-sm font-semibold leading-snug text-gray-900 transition-colors group-hover:text-pink-600 dark:text-slate-100 dark:group-hover:text-pink-400">
                                        {product.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

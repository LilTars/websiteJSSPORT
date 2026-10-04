<?php

namespace App\Domain\Seo\Actions;

use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Support\Str;

/**
 * Builds the meta tags sent in the first HTML response, before the React app
 * boots. Mirrors what each page's <SeoHead> renders on the client so crawlers
 * and link previews get real titles instead of the bare application name.
 */
class ResolvePageSeoAction
{
    private const DESCRIPTION_LIMIT = 160;

    /**
     * @param  array{component?: string, url?: string, props?: array<string, mixed>}  $page
     * @return array{title: string, description: string, canonical: string, image: string, type: string, robots: string, siteName: string, locale: string}
     */
    public function handle(array $page): array
    {
        $siteName = (string) config('seo.site_name');
        $baseUrl = rtrim((string) config('seo.base_url'), '/');
        $component = (string) ($page['component'] ?? '');
        $path = (string) (parse_url((string) ($page['url'] ?? '/'), PHP_URL_PATH) ?: '/');

        $pageConfig = config("seo.pages.{$component}");
        $isPublicPage = is_array($pageConfig) || $component === 'Products/Show';

        $title = is_array($pageConfig) ? ($pageConfig['title'] ?? null) : null;
        $description = is_array($pageConfig) ? ($pageConfig['description'] ?? null) : null;
        $image = (string) config('seo.default_image');
        $type = 'website';

        if ($component === 'Products/Show') {
            $product = $page['props']['product'] ?? [];
            $name = (string) ($product['name'] ?? '');
            $title = $name !== '' ? $name : null;
            $description = $this->plainText($product['description'] ?? null) ?: ($name !== '' ? "{$name} สินค้ากีฬาคุณภาพจาก JSSPORT" : null);
            $image = $this->firstImage($product['images'] ?? null) ?? $image;
            $type = 'product';
        }

        return [
            'title' => $title ? "{$title} | {$siteName}" : (string) config('seo.default_title'),
            'description' => Str::limit($description ?: (string) config('seo.default_description'), self::DESCRIPTION_LIMIT),
            'canonical' => $baseUrl.($path === '/' ? '/' : $path),
            'image' => $this->absoluteUrl($image, $baseUrl),
            'type' => $type,
            'robots' => $isPublicPage
                ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
                : 'noindex, nofollow',
            'siteName' => $siteName,
            'locale' => (string) config('seo.locale'),
        ];
    }

    private function firstImage(mixed $images): ?string
    {
        // Controllers may hand over a Collection or a plain array of URLs.
        if ($images instanceof Arrayable) {
            $images = $images->toArray();
        }

        if (! is_array($images)) {
            return null;
        }

        $first = reset($images);

        return is_string($first) && $first !== '' ? $first : null;
    }

    private function plainText(mixed $value): string
    {
        if (! is_string($value)) {
            return '';
        }

        return trim((string) preg_replace('/\s+/u', ' ', strip_tags($value)));
    }

    private function absoluteUrl(string $value, string $baseUrl): string
    {
        if (preg_match('#^https?://#i', $value)) {
            return $value;
        }

        return $baseUrl.'/'.ltrim($value, '/');
    }
}

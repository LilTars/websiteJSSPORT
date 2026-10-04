<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SitemapTest extends TestCase
{
    use RefreshDatabase;

    private function createProduct(string $slug, array $attributes = []): Product
    {
        $category = ProductCategory::query()->firstOrCreate(
            ['slug' => 'sitemap-category'],
            ['name' => 'Sitemap Category', 'is_active' => true],
        );

        return Product::query()->forceCreate([
            'name' => $slug,
            'slug' => $slug,
            'product_category_id' => $category->id,
            'is_active' => true,
            'published_at' => null,
            ...$attributes,
        ]);
    }

    public function test_sitemap_lists_every_product_that_is_visible_in_the_catalogue(): void
    {
        config(['seo.base_url' => 'https://jssport.co.th']);

        $withoutPublishDate = $this->createProduct('no-publish-date');
        $publishedInPast = $this->createProduct('published-past', ['published_at' => now()->subDay()]);
        $scheduled = $this->createProduct('scheduled', ['published_at' => now()->addDay()]);
        $inactive = $this->createProduct('inactive', ['is_active' => false]);

        $response = $this->get(route('sitemap'));

        $response->assertOk();
        $response->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
        $response->assertSee('<loc>https://jssport.co.th/products/'.$withoutPublishDate->id.'</loc>', false);
        $response->assertSee('<loc>https://jssport.co.th/products/'.$publishedInPast->id.'</loc>', false);
        $response->assertDontSee('<loc>https://jssport.co.th/products/'.$scheduled->id.'</loc>', false);
        $response->assertDontSee('<loc>https://jssport.co.th/products/'.$inactive->id.'</loc>', false);
    }
}

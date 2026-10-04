<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SeoMetaTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();
        config([
            // Production currently serves without an SSR server, so this is the
            // HTML crawlers actually receive.
            'inertia.ssr.enabled' => false,
            'seo.base_url' => 'https://jssport.co.th',
            'seo.site_name' => 'JSSPORT',
            'seo.default_title' => 'JSSPORT | ชุดกีฬาและอุปกรณ์กีฬา',
        ]);
    }

    public function test_home_page_sends_real_meta_tags_in_the_first_html_response(): void
    {
        $response = $this->get(route('home'));

        $response->assertOk();
        $response->assertSee('<html', false);
        $response->assertSee('lang="th"', false);
        $response->assertSee('<title>JSSPORT | ชุดกีฬาและอุปกรณ์กีฬา</title>', false);
        $response->assertDontSee('<title>Laravel</title>', false);
        $response->assertSee('<meta name="description" content="'.e(config('seo.pages.Home.description')).'" data-inertia="description">', false);
        $response->assertSee('<link rel="canonical" href="https://jssport.co.th/" data-inertia="canonical">', false);
        $response->assertSee('content="index, follow', false);
    }

    public function test_static_page_uses_its_own_title_and_canonical(): void
    {
        $response = $this->get(route('about'));

        $response->assertOk();
        $response->assertSee('<title>เกี่ยวกับเรา | JSSPORT</title>', false);
        $response->assertSee('<link rel="canonical" href="https://jssport.co.th/about" data-inertia="canonical">', false);
    }

    public function test_product_page_meta_is_built_from_the_product(): void
    {
        $category = ProductCategory::query()->forceCreate(['name' => 'เสื้อทีม', 'slug' => 'team-shirts', 'is_active' => true]);
        $product = Product::query()->forceCreate([
            'name' => 'เสื้อฟุตบอล <ME> 912',
            'slug' => 'me-912',
            'description' => '<p>ผ้า Micro Polyester ระบายอากาศดี</p>',
            'product_category_id' => $category->id,
            'is_active' => true,
        ]);

        $response = $this->get(route('products.show', $product));

        $response->assertOk();
        // Product names are user content, so they must arrive escaped.
        $response->assertSee('<title>เสื้อฟุตบอล &lt;ME&gt; 912 | JSSPORT</title>', false);
        $response->assertSee('content="ผ้า Micro Polyester ระบายอากาศดี" data-inertia="description"', false);
        $response->assertSee('<meta property="og:type" content="product" data-inertia="og:type">', false);
        $response->assertSee('href="https://jssport.co.th/products/'.$product->id.'" data-inertia="canonical"', false);
    }

    public function test_non_public_pages_are_not_indexed(): void
    {
        $response = $this->get(route('login'));

        $response->assertOk();
        $response->assertSee('<meta name="robots" content="noindex, nofollow" data-inertia="robots">', false);
    }
}

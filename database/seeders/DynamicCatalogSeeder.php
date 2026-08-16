<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\CareerBenefit;
use App\Models\CareerHiringStep;
use App\Models\JobPosting;
use App\Models\Planner;
use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DynamicCatalogSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $panBrand = Brand::query()->firstOrCreate(
                ['slug' => 'pan'],
                ['name' => 'Pan', 'is_active' => true, 'sort_order' => 1],
            );

            $wingzBrand = Brand::query()->firstOrCreate(
                ['slug' => 'wingz'],
                ['name' => 'Wingz', 'is_active' => true, 'sort_order' => 2],
            );

            $mesportPlanner = Planner::query()->firstOrCreate(
                ['slug' => 'mesport-planner'],
                ['name' => 'Mesport Planner', 'is_active' => true, 'sort_order' => 1],
            );

            $panCategory = ProductCategory::query()->firstOrCreate(
                ['slug' => 'pan'],
                ['name' => 'Pan', 'brand_id' => $panBrand->id, 'is_active' => true, 'sort_order' => 1],
            );

            $wingzCategory = ProductCategory::query()->firstOrCreate(
                ['slug' => 'wingz'],
                ['name' => 'Wingz', 'brand_id' => $wingzBrand->id, 'is_active' => true, 'sort_order' => 2],
            );

            $products = [
                [
                    'name' => 'PAN LEGENDA SELECT : PSFS5A2',
                    'slug' => 'pan-legenda-select-psfs5a2',
                    'brand_tag' => 'PAN PERFORMANCE',
                    'product_category_id' => $panCategory->id,
                    'planner_id' => $mesportPlanner->id,
                    'price' => 1890,
                    'description' => 'รองเท้าฟุตบอล PAN LEGENDA SELECT เพื่อการควบคุมบอลที่มั่นใจและความคล่องตัว',
                    'material' => 'PREMIUM SYNTHETIC UPPER + CONTROL SOLE',
                    'turnaround' => 'READY STOCK',
                    'thumbnail_path' => '/images/pan/p1.webp',
                    'show_price_on_card' => true,
                    'show_price_on_detail' => true,
                    'is_active' => true,
                    'published_at' => now(),
                    'images' => [
                        '/images/pan/p1.webp',
                        '/images/pan/p2.webp',
                        '/images/pan/p3.webp',
                    ],
                ],
                [
                    'name' => 'Wingz Vortex Pro',
                    'slug' => 'wingz-vortex-pro',
                    'brand_tag' => 'WINGZ PERFORMANCE',
                    'product_category_id' => $wingzCategory->id,
                    'planner_id' => $mesportPlanner->id,
                    'price' => 1390,
                    'description' => 'รองเท้า Wingz Vortex Pro สำหรับความเร็วและการเปลี่ยนทิศทางอย่างมั่นใจ',
                    'material' => 'ULTRA LIGHT MESH + GRIP SOLE',
                    'turnaround' => 'READY STOCK',
                    'thumbnail_path' => '/images/wingz/w1.jpg',
                    'show_price_on_card' => true,
                    'show_price_on_detail' => true,
                    'is_active' => true,
                    'published_at' => now(),
                    'images' => [
                        '/images/wingz/w1.jpg',
                        '/images/wingz/w2.jpg',
                    ],
                ],
            ];

            foreach ($products as $index => $payload) {
                $imagePaths = $payload['images'];
                unset($payload['images']);
                $payload['sort_order'] = $index + 1;

                $product = Product::query()->updateOrCreate(
                    ['slug' => (string) $payload['slug']],
                    $payload,
                );

                $product->images()->delete();
                foreach ($imagePaths as $imageIndex => $imagePath) {
                    $product->images()->create([
                        'image_path' => $imagePath,
                        'alt_text' => $product->name,
                        'sort_order' => $imageIndex,
                        'is_primary' => $imageIndex === 0,
                    ]);
                }
            }

            $benefits = [
                'ทีมงานเป็นมิตรและเติบโตไปด้วยกัน',
                'ได้ทำงานกับโปรดักชันจริง',
                'เส้นทางเติบโตชัดเจน',
            ];

            foreach ($benefits as $index => $title) {
                CareerBenefit::query()->updateOrCreate(
                    ['title' => $title],
                    [
                        'detail' => $title,
                        'is_active' => true,
                        'sort_order' => $index + 1,
                    ],
                );
            }

            $steps = [
                ['step_number' => 1, 'title' => 'ส่งโปรไฟล์และผลงาน', 'detail' => 'ส่งประวัติ ผลงาน และตำแหน่งที่สนใจ'],
                ['step_number' => 2, 'title' => 'สัมภาษณ์กับหัวหน้าทีม', 'detail' => 'พูดคุยบทบาทงานและความคาดหวัง'],
                ['step_number' => 3, 'title' => 'เริ่มงานและ onboarding', 'detail' => 'เริ่มงานพร้อมแผนการพัฒนาที่ชัดเจน'],
            ];

            foreach ($steps as $step) {
                CareerHiringStep::query()->updateOrCreate(
                    ['step_number' => $step['step_number']],
                    [
                        'title' => $step['title'],
                        'detail' => $step['detail'],
                        'is_active' => true,
                        'sort_order' => $step['step_number'],
                    ],
                );
            }

            $positions = [
                [
                    'title' => 'Graphic Designer (Sportswear)',
                    'team' => 'Creative Team',
                    'location' => 'หนองบัวลำภู',
                    'employment_type' => 'Full-time',
                    'summary' => 'ออกแบบเสื้อทีม งานพิมพ์ และงานสื่อสารแบรนด์',
                ],
                [
                    'title' => 'Sales Executive (B2B / Schools)',
                    'team' => 'Sales Team',
                    'location' => 'หนองบัวลำภู / Hybrid',
                    'employment_type' => 'Full-time',
                    'summary' => 'ดูแลลูกค้าองค์กร โรงเรียน และหน่วยงานราชการ',
                ],
            ];

            foreach ($positions as $index => $position) {
                JobPosting::query()->updateOrCreate(
                    ['slug' => Str::slug($position['title'])],
                    [
                        ...$position,
                        'salary_currency' => 'THB',
                        'is_active' => true,
                        'sort_order' => $index + 1,
                        'published_at' => now(),
                    ],
                );
            }
        });
    }
}

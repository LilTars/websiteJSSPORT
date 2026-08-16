<?php

use App\Http\Controllers\Analytics\ClickTrackingController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Backoffice\BannerController;
use App\Http\Controllers\Backoffice\BrandController;
use App\Http\Controllers\Backoffice\JobApplicationController as BackofficeJobApplicationController;
use App\Http\Controllers\Backoffice\JobPostingController;
use App\Http\Controllers\Backoffice\MemberController;
use App\Http\Controllers\Backoffice\MemberPasswordResetController;
use App\Http\Controllers\Backoffice\PlannerController;
use App\Http\Controllers\Backoffice\ProductCategoryController;
use App\Http\Controllers\Backoffice\ProductController;
use App\Http\Controllers\Public\CareerPageController;
use App\Http\Controllers\Public\HomePageController;
use App\Http\Controllers\Public\JobApplicationController;
use App\Http\Controllers\Public\ProductPageController;
use App\Http\Controllers\Public\SitemapController;
use App\Http\Controllers\Teams\TeamInvitationController;
use App\Http\Middleware\EnsureTeamMembership;
use Illuminate\Support\Facades\Route;

Route::get('/', HomePageController::class)->name('home');
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');
Route::inertia('/about', 'About')->name('about');
Route::get('/careers', CareerPageController::class)->name('careers');
Route::post('/careers/apply', [JobApplicationController::class, 'store'])->name('careers.apply');
Route::get('/products', [ProductPageController::class, 'index'])->name('products.index');
Route::get('/products/{product}', [ProductPageController::class, 'show'])->name('products.show');
Route::post('/analytics/click', [ClickTrackingController::class, 'store'])->name('analytics.click');
Route::inertia('/contact', 'Contact')->name('contact');

Route::prefix('{current_team}')
    ->middleware(['auth', 'verified', EnsureTeamMembership::class])
    ->group(function () {
        Route::get('dashboard', DashboardController::class)->name('dashboard');

        Route::prefix('backoffice')->name('backoffice.')->group(function () {
            Route::resource('members', MemberController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['members' => 'member']);
            Route::put('members/{member}/toggle-active', [MemberController::class, 'toggleActive'])->name('members.toggle-active');
            Route::put('members/{member}/reset-password', MemberPasswordResetController::class)->name('members.reset-password');

            Route::put('banners/{banner}/toggle-active', [BannerController::class, 'toggleActive'])->name('banners.toggle-active');
            Route::post('banners/{banner}/delete', [BannerController::class, 'destroy'])->name('banners.destroy.post');
            Route::resource('banners', BannerController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::put('brands/{brand}/toggle-active', [BrandController::class, 'toggleActive'])->name('brands.toggle-active');
            Route::resource('brands', BrandController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::put('product-categories/{category}/toggle-active', [ProductCategoryController::class, 'toggleActive'])->name('product-categories.toggle-active');
            Route::resource('product-categories', ProductCategoryController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['product-categories' => 'category']);
            Route::resource('planners', PlannerController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::put('products/{product}/toggle-active', [ProductController::class, 'toggleActive'])->name('products.toggle-active');
            Route::resource('products', ProductController::class)->only(['index', 'store', 'update', 'destroy']);
            Route::put('job-postings/{jobPosting}/toggle-active', [JobPostingController::class, 'toggleActive'])->name('job-postings.toggle-active');
            Route::resource('job-postings', JobPostingController::class)->only(['index', 'store', 'update', 'destroy'])->parameters(['job-postings' => 'jobPosting']);
            Route::resource('job-applications', BackofficeJobApplicationController::class)->only(['index', 'update', 'destroy'])->parameters(['job-applications' => 'jobApplication']);
        });
    });

Route::middleware(['auth'])->group(function () {
    Route::get('invitations/{invitation}/accept', [TeamInvitationController::class, 'accept'])->name('invitations.accept');
    Route::delete('invitations/{invitation}', [TeamInvitationController::class, 'decline'])->name('invitations.decline');
});

require __DIR__.'/settings.php';

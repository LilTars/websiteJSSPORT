<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('career_benefits', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->text('detail');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('career_hiring_steps', function (Blueprint $table) {
            $table->id();
            $table->unsignedSmallInteger('step_number');
            $table->string('title', 180);
            $table->text('detail');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->unique('step_number');
            $table->index(['is_active', 'sort_order']);
        });

        Schema::create('job_postings', function (Blueprint $table) {
            $table->id();
            $table->string('title', 180);
            $table->string('slug', 220)->unique();
            $table->string('team', 120)->nullable();
            $table->string('location', 180)->nullable();
            $table->string('employment_type', 50)->nullable();
            $table->string('workplace_type', 50)->nullable();
            $table->text('summary')->nullable();
            $table->longText('description')->nullable();
            $table->longText('requirements')->nullable();
            $table->longText('benefits')->nullable();
            $table->decimal('salary_min', 12, 2)->nullable();
            $table->decimal('salary_max', 12, 2)->nullable();
            $table->char('salary_currency', 3)->default('THB');
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expired_at')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['is_active', 'sort_order']);
            $table->index(['is_active', 'published_at', 'expired_at']);
        });

        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_posting_id')->nullable()->constrained('job_postings')->nullOnDelete();
            $table->string('full_name', 180);
            $table->string('email', 190);
            $table->string('phone', 30)->nullable();
            $table->string('line_id', 120)->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('resume_path')->nullable();
            $table->text('message')->nullable();
            $table->string('source', 120)->nullable();
            $table->string('status', 40)->default('new');
            $table->timestamp('applied_at')->useCurrent();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'applied_at']);
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
        Schema::dropIfExists('job_postings');
        Schema::dropIfExists('career_hiring_steps');
        Schema::dropIfExists('career_benefits');
    }
};

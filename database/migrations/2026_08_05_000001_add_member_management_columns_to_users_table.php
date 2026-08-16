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
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone', 30)->nullable()->after('email');
            $table->string('avatar_path')->nullable()->after('password');
            $table->boolean('is_active')->default(true)->after('remember_token');
            $table->timestamp('last_password_reset_at')->nullable()->after('is_active');

            $table->unique('phone');
            $table->index('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropUnique(['phone']);

            $table->dropColumn([
                'phone',
                'avatar_path',
                'is_active',
                'last_password_reset_at',
            ]);
        });
    }
};

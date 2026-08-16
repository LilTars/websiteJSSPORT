<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            if (! Schema::hasColumn('click_events', 'page_key')) {
                $table->string('page_key', 80)->nullable()->after('page');
                $table->index('page_key');
            }
        });
    }

    public function down(): void
    {
        Schema::table('click_events', function (Blueprint $table) {
            if (Schema::hasColumn('click_events', 'page_key')) {
                $table->dropIndex(['page_key']);
                $table->dropColumn('page_key');
            }
        });
    }
};

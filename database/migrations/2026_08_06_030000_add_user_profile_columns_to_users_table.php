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
            $table->string('first_name', 120)->nullable()->after('id');
            $table->string('last_name', 120)->nullable()->after('first_name');
            $table->string('position', 120)->nullable()->after('last_name');
            $table->string('username', 120)->nullable()->after('position');

            $table->unique('username');
            $table->index('position');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['position']);
            $table->dropUnique(['username']);
            $table->dropColumn(['first_name', 'last_name', 'position', 'username']);
        });
    }
};
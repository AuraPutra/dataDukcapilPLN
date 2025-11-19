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
        Schema::table('data_pelanggan', function (Blueprint $table) {
            $table->string('nik_update', 16)->nullable()->after('nama_update');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_pelanggan', function (Blueprint $table) {
            $table->dropColumn('nik_update');
        });
    }
};

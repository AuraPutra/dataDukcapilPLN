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
            $table->text('ket_lapangan_lainnya')->nullable()->after('ket_lapangan');
            $table->text('ket_pemadanan_lainnya')->nullable()->after('ket_pemadanan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('data_pelanggan', function (Blueprint $table) {
            $table->dropColumn('ket_lapangan_lainnya');
            $table->dropColumn('ket_pemadanan_lainnya');
        });
    }
};

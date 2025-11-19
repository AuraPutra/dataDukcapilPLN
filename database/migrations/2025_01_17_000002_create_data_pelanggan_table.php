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
        Schema::create('data_pelanggan', function (Blueprint $table) {
            $table->id();
            $table->string('unitupi', 50)->nullable();
            $table->string('nm_unitupi', 100)->nullable();
            $table->string('unitap', 50)->nullable();
            $table->string('nama_ap', 100)->nullable();
            $table->string('unitup', 50)->nullable();
            $table->string('nama_up', 100)->nullable();
            $table->string('idpel', 20)->nullable();
            $table->string('nama', 100)->nullable();
            $table->string('nik', 30)->nullable();
            $table->string('ktp', 255)->nullable();
            $table->text('alamat')->nullable();
            $table->string('koordinat_x', 50)->nullable();
            $table->string('koordinat_y', 50)->nullable();
            $table->string('tarif', 20)->nullable();
            $table->integer('daya')->nullable();
            $table->string('kode_golongan', 20)->nullable();
            $table->string('nomor_meter', 50)->nullable();
            $table->string('nama_update', 100)->nullable();
            $table->text('alamat_update')->nullable();
            $table->string('status_lapangan', 100)->nullable();
            $table->text('ket_lapangan')->nullable();
            $table->text('ket_pemadanan')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_pelanggan');
    }
};

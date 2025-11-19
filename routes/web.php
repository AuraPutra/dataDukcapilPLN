<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DataPelangganController;
use App\Http\Controllers\DashboardController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

// Halaman utama
// Route::get('/', [DataPelangganController::class, 'index'])->name('home');
// Route::get('/peta', [DataPelangganController::class, 'map'])->name('peta');
// Route::get('/api/schools', [HomeController::class, 'index']);

// Halaman utama → Data Pelanggan
// Route::get('/', [DataPelangganController::class, 'index'])->name('home');

// Peta pelanggan
// Route::get('/peta', [DataPelangganController::class, 'map'])->name('peta');

// Resource CRUD Data Pelanggan
// Route::resource('data-pelanggan', DataPelangganController::class);



Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard/unit/{unitName}', [DashboardController::class, 'showUnit'])->name('dashboard.unit');

// Data Pelanggan Routes
Route::resource('data-pelanggan', DataPelangganController::class);
Route::get('/peta-pelanggan', [DataPelangganController::class, 'map'])->name('data-pelanggan.map');


Route::get('/pelanggan/export-csv', [DataPelangganController::class, 'exportCsv'])
     ->name('pelanggan.export.csv');

Route::get('/pelanggan/export-xls', [DataPelangganController::class, 'exportXls'])
    ->name('pelanggan.export.xls');

Route::get('/pelanggan/export-excel-images', [DataPelangganController::class, 'exportExcelWithImages'])
    ->name('pelanggan.export.excel.images');
   
Route::get('/data-pelanggan/download-ktp', [DataPelangganController::class, 'downloadAllKtp'])
    ->name('data-pelanggan.download-ktp');


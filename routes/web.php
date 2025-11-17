<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\DataPelangganController;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\Request;

// Halaman utama
Route::get('/', [DataPelangganController::class, 'index'])->name('home');
Route::get('/peta', [DataPelangganController::class, 'map'])->name('peta');
Route::get('/api/schools', [HomeController::class, 'index']);


Route::get('/', function () {
    return Inertia::render('Dashboard');
});

// Data Pelanggan Routes
Route::resource('data-pelanggan', DataPelangganController::class);
Route::get('/peta-pelanggan', [DataPelangganController::class, 'map'])->name('data-pelanggan.map');

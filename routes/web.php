<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\IndustryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PklReportController;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

    Route::get('/industries', [IndustryController::class, 'index'])->name('industries');
    Route::post('/industries', [IndustryController::class, 'store'])->name('industries.store');

    Route::get('/pkl-report', [PklReportController::class, 'index'])->name('pkl-report');
    Route::post('/pkl-report', [PklReportController::class, 'store'])->name('pkl-report.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
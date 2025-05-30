<?php

use Inertia\Inertia;
use App\Models\Student;
use App\Models\Industry;
use App\Models\PKL_Assignment;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisteredUserController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/register', [RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [RegisteredUserController::class, 'store']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/industries', function () {
        $industries = Industry::all();
        return Inertia::render('Industries', [
            'industries' => $industries,
        ]);
    })->name('industries');
    Route::post('/industries', [App\Http\Controllers\IndustryController::class, 'store'])->name('industries.store');

    Route::get('/pkl-report', function () {
        $pklAssignments = PKL_Assignment::with(['student', 'teacher', 'industry'])->get(); // Ambil data PKL dengan relasi
        $students = Student::all();
        $teachers = \App\Models\Teacher::all();
        $industries = Industry::all();
        return Inertia::render('PklReport', [
            'pklAssignments' => $pklAssignments,
            'students' => $students,
            'teachers' => $teachers,
            'industries' => $industries,
        ]);
    })->name('pkl-report');
    Route::post('/pkl-report', [App\Http\Controllers\PklReportController::class, 'store'])->name('pkl-report.store');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

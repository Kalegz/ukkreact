<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\APIUserController;
use App\Http\Controllers\API\APIStudentController;
use App\Http\Controllers\API\APITeacherController;
use App\Http\Controllers\API\APIIndustryController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::apiResource('industries', APIIndustryController::class);
Route::apiResource('students', APIStudentController::class);
Route::apiResource('teachers', APITeacherController::class);
Route::apiResource('users', APIUserController::class);
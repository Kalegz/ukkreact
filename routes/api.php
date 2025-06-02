<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\APIUserController;
use App\Http\Controllers\API\APIStudentController;
use App\Http\Controllers\API\APITeacherController;
use App\Http\Controllers\API\APIIndustryController;


Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('industries', APIIndustryController::class);
    Route::apiResource('students', APIStudentController::class);
    Route::apiResource('teachers', APITeacherController::class);
    Route::apiResource('users', APIUserController::class);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::Post('logout', [AuthController::class, 'logout']);
});

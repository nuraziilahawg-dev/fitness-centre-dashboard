<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [\App\Http\Controllers\AuthController::class, 'login']);
Route::post('/register', [\App\Http\Controllers\AuthController::class, 'register']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);

    Route::get('/user', function (Request $request) { return $request->user();});

    Route::apiResource('members', \App\Http\Controllers\MemberController::class);

    Route::get('/dashboard/stats', [App\Http\Controllers\DashboardController::class, 'index']);

});

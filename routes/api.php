<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// API Routes for User Management
Route::prefix('v1')->group(function () {
    // User routes
    Route::apiResource('users', UserController::class);
    
    // Role routes  
    Route::get('roles', [RoleController::class, 'index']);
});

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productController;
use App\Http\Controllers\userController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\LoginController;

// Roteamento da API para o frontend Angular
Route::apiResource('products', productController::class);
Route::apiResource('users', userController::class);
Route::apiResource('clients', ClientController::class);
// Route::put('/clients/{id}', [ClientController::class, 'update']);
Route::apiResource('services', ServiceController::class);
Route::apiResource('payments', PaymentController::class);
Route::post('/login', [LoginController::class, 'authentication']);
Route::put('payments/{id}/pay', [PaymentController::class, 'pay']);
Route::post('payments/mark-late', [PaymentController::class, 'markLate']);
Route::get('payments/history/{serviceId}', [PaymentController::class, 'history']);

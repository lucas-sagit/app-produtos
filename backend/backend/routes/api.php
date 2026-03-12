<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productController;
use App\Http\Controllers\userController;

// Roteamento da API para o frontend Angular
Route::apiResource('products', productController::class);
Route::apiResource('users', userController::class);

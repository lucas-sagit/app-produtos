<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productController;

Route::get('/', function () {
    return view('welcome');
});

// Rotas para produtos (resource) atendem o crud completo.
Route::resource('products', productController::class);


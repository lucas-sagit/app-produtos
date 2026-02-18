<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// Rotas para produtos (resource) atendem o crud completo.
Route::resource('products', productController::class);


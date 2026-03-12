<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\productController;

Route::get('/', function () {
    return view('welcome');
});

// Rotas removidas e migradas para api.php para acesso via /api/products



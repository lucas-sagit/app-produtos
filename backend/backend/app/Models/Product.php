<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'id',
        'stock',
        'category',
        'description',
        'lote',
        'price',
        'others',
        'quantity',
        'image_url',
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payment';

    protected $fillable = [
        'client_id',
        'description',
        'cash',
        'status',
        'payment_date',
    ];

    protected $casts = [
        'cash' => 'decimal:2',
        'status' => 'boolean',
        'payment_date' => 'datetime',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class, 'client_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'client_id',
        'payment_id',
        'plans',
        'description',
        'price',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}

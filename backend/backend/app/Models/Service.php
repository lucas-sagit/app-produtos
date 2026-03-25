<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'client_id',
        'payment_id',
        'due_date', //data de vencimento
        'plans',
        'description',
        'price',
        'status'
    ];

    protected $casts = [
        'price' => 'decimal:2',
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

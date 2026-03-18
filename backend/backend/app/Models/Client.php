<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'status_client',
        'name',
        'corporate_name',
        'phone',
        'cpf',
        'cnpj',
        'city',
        'address',
        'street',
        'number',
    ];

    protected $hidden = [
        'password',
    ];
}

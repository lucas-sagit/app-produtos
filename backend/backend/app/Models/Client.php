<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'status_client',
        'cpf',
        'name',
        'corporate_name',
        'cnpj',
        'phone',
        'city',
        'address',
        'street',
        'number',
    ];

    protected $hidden = [
        'password',
    ];
}

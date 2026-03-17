<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    protected $table = 'clients';

    protected $fillable = [
        'name',
        'corporate_name',
        'cpf',
        'cnpj',
        'city',
        'address',
        'street',
        'number',
        'phone',
    ];

    protected $hidden = [
        'password',
    ];
}

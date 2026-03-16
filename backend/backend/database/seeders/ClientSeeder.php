<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ClientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('clients')->insert([
            'name' => 'John Doe',
            'phone' => '1234567890',
            'corporate_name' => 'Doe Inc.',
            'cpf' => '123.456.789-00',
            'cnpj' => '12.345.678/0001-00',
            'city' => 'New York',
            'address' => '123 Main St',
            'street' => 'Main St',
            'number' => '123',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);
    }
}

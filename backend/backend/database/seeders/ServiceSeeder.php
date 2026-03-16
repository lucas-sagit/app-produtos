<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('services')->insert([
            [
                'client_id' => 1,
                'payment_id' => 1,
                'plans' => 'Plano Premium Mensal',
                'description' => 'Acesso ilimitado à plataforma com suporte 24h',
                'price' => 500.00,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}

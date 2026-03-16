<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'category' => 'Eletrônicos',
                'description' => 'Smartphone XYZ 128GB',
                'lote' => 'LOTE-A01',
                'price' => 1999.90,
                'others' => 'Cor: Preto, Câmera tripla',
                'quantity' => '50',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'category' => 'Acessórios',
                'description' => 'Fone de Ouvido Bluetooth',
                'lote' => 'LOTE-B02',
                'price' => 249.90,
                'others' => 'Isolamento de ruído, bateria 24h',
                'quantity' => '120',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'category' => 'Periféricos',
                'description' => 'Teclado Mecânico RGB',
                'lote' => 'LOTE-C03',
                'price' => 349.50,
                'others' => 'Switch azul, layout ABNT2',
                'quantity' => '30',
                'image_url' => 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}

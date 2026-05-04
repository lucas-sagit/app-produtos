<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('equipment_description')->nullable()->after('description');
            $table->string('equipment_lote')->nullable()->after('equipment_description');
            $table->unsignedInteger('equipment_quantity')->nullable()->after('equipment_lote');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropColumn([
                'equipment_description',
                'equipment_lote',
                'equipment_quantity',
            ]);
        });
    }
};

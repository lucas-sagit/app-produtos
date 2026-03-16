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
        Schema::create('clients', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name')->varchar(255);
            $table->string('phone')->varchar(255);
            $table->string('corporate_name')->varchar(255);
            $table->string('cpf')->unique();
            $table->string('cnpj')->unique();
            $table->string('city')->varchar(255);
            $table->string('address')->varchar(255);
            $table->string('street')->varchar(255);
            $table->string('number')->varchar(255);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};

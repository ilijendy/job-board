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
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE jobs MODIFY responsibilities TEXT NULL, MODIFY requirements TEXT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        \Illuminate\Support\Facades\DB::statement('ALTER TABLE jobs MODIFY responsibilities VARCHAR(255) NULL, MODIFY requirements VARCHAR(255) NULL');
    }
};

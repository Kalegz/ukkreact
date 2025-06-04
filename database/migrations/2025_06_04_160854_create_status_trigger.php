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
        DB::unprepared("
            CREATE TRIGGER status_trigger
            AFTER INSERT ON p_k_l__assignments
            FOR EACH ROW
            BEGIN
                UPDATE students
                SET pkl_report = 1
                WHERE id = NEW.student_id;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('status_trigger');
    }
};

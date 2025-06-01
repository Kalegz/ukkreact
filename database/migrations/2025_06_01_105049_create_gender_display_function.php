<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // DB::unprepared('DROP FUNCTION IF EXISTS get_gender_display;');
        DB::unprepared('
            CREATE FUNCTION get_gender_display(gender_code CHAR(1))
            RETURNS VARCHAR(20)
            DETERMINISTIC
            BEGIN
                RETURN CASE
                    WHEN gender_code = "L" THEN "Laki-laki"
                    WHEN gender_code = "P" THEN "Perempuan"
                    ELSE "Unknown"
                END;
            END;
        ');
    }

    public function down(): void
    {
        DB::unprepared('DROP FUNCTION IF EXISTS get_gender_display;');
    }
};
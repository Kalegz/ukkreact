<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared("
            CREATE TRIGGER phone_number_trigger_student
            BEFORE INSERT ON students
            FOR EACH ROW
            BEGIN
                IF NEW.contact LIKE '08%' THEN
                    SET NEW.contact = CONCAT('+628', SUBSTRING(NEW.contact, 3));
                END IF;
            END;
        ");

        DB::unprepared("
            CREATE TRIGGER phone_number_trigger_teacher
            BEFORE INSERT ON teachers
            FOR EACH ROW
            BEGIN
                IF NEW.contact LIKE '08%' THEN
                    SET NEW.contact = CONCAT('+628', SUBSTRING(NEW.contact, 3));
                END IF;
            END;
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER IF EXISTS phone_number_trigger_student;');
        DB::unprepared('DROP TRIGGER IF EXISTS phone_number_trigger_teacher;');
    }
};
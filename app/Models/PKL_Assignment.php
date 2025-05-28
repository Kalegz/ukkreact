<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PKL_Assignment extends Model
{
    protected $table = 'p_k_l__assignments';

    protected $fillable = [
        'teacher_id', 'student_id', 'industry_id', 'start_date', 'end_date'
    ];

    protected $dates = ['start_date', 'end_date'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function industry()
    {
        return $this->belongsTo(Industry::class);
    }
}
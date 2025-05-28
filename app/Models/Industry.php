<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Industry extends Model
{
    protected $fillable = [
        'name', 'address', 'contact', 'email', 'website'
    ];

    public function studentTeachers()
    {
        return $this->belongsToMany(Student::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'teacher_id')
                    ->withTimestamps();
    }

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'student_id')
                    ->withTimestamps();
    }
}
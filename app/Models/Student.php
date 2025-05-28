<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'name', 'gender', 'address', 'contact', 'email', 'photo', 'status'
    ];

    public function teacherIndustries()
    {
        return $this->belongsToMany(Teacher::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'industry_id')
                    ->withTimestamps();
    }

    public function industries()
    {
        return $this->belongsToMany(Industry::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'teacher_id')
                    ->withTimestamps();
    }
}
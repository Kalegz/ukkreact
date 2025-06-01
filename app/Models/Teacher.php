<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Teacher extends Model
{
    protected $fillable = [
        'name', 'nip', 'gender', 'address', 'contact', 'email', 'photo'
    ];

    public function studentIndustries()
    {
        return $this->belongsToMany(Student::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'industry_id')
                    ->withTimestamps();
    }

    public function industries()
    {
        return $this->belongsToMany(Industry::class, 'p_k_l__assignments')
                    ->withPivot('start_date', 'end_date', 'student_id')
                    ->withTimestamps();
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'name', 'nis', 'gender', 'address', 'contact', 'email', 'photo', 'pkl_report'
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

    public function pklAssignments()
    {
        return $this->hasMany(PKL_Assignment::class, 'student_id');
    }

    public function pklReport()
    {
        return $this->hasOne(PKLReport::class, 'student_id');
    }
}
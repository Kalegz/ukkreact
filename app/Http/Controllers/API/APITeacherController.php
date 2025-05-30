<?php

namespace App\Http\Controllers\API;

use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class APITeacherController extends Controller
{
    public function index()
    {
        $teacher = Teacher::all();
        $data = [
            'status'=>200, 
            'teachers'=>$teacher
        ];

        return response()->json($data, 200);
    }
}

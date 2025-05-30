<?php

namespace App\Http\Controllers\API;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class APIStudentController extends Controller
{
    public function index()
    {
        $student = Student::all();
        $data = [
            'status'=>200, 
            'students'=>$student
        ];

        return response()->json($data, 200);
    }
}

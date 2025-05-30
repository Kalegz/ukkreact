<?php

namespace App\Http\Controllers\API;

use App\Models\Industry;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class APIIndustryController extends Controller
{
    public function index()
    {
        $industry = Industry::all();
        $data = [
            'status'=>200, 
            'industries'=>$industry
        ];

        return response()->json($data, 200);
    }
}

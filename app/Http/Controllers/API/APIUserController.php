<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class APIUserController extends Controller
{
    public function index()
    {
        $user = User::all();
        $data = [
            'status'=>200, 
            'users'=>$user
        ];

        return response()->json($data, 200);
    }
}

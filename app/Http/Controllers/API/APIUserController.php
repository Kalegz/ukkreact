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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'password' => 'nullable|string|max:255',
        ]);

        User::create($validated);

        return response()->json($validated);
    }

    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|max:255',
        ]);

        $user->update($validated);

        return response()->json($validated);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $name = $user->name;
        User::where('id', $id)->delete();

        return response()->json("Berhasil membumikan user {$name}");
    }
}

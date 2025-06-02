<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

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

        $status = [
            'status'=>201, 
            'content'=>$validated
        ];

        return response()->json($status);
    }

    public function update(Request $request, string $id)
    {
        $user = User::where('id', $id)->first();
        if (!$user) {
            return response()->json([
                'status' => 'User not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string|max:255|unique:users,name,' . $id,
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:3|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'failed',
                'errors' => $validator->errors()->toArray(),
            ], 422);
        }

        $validated = $validator->validated();
        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);
        $user->refresh();

        return response()->json([
            'status' => 200,
            'message' => 'Successfully update user',
            'user' => $user->only('id', 'name', 'email'),
        ], 200);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $name = $user->name;
        User::where('id', $id)->delete();

        return response()->json("Berhasil membumikan user {$name}");
    }
}

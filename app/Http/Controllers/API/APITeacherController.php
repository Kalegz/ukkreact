<?php

namespace App\Http\Controllers\API;

use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class APITeacherController extends Controller
{
    public function index()
    {
        $teachers = Teacher::all();
        $data = [
            'status' => 200,
            'teachers' => $teachers
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nip' => 'required|string|unique:teachers,nip',
            'gender' => 'required|in:L,P',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'required|email|unique:teachers,email',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $teacherData = $request->only(['name', 'nip', 'gender', 'address', 'contact', 'email']);

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos/teachers', 'public');
            $teacherData['photo'] = $photoPath;
        }

        $teacher = Teacher::create($teacherData);

        return response()->json([
            'status' => 201,
            'message' => 'Teacher created successfully',
            'teacher' => $teacher
        ], 201);
    }

    public function show($id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            return response()->json([
                'status' => 404,
                'message' => 'Teacher not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'teacher' => $teacher
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            return response()->json([
                'status' => 404,
                'message' => 'Teacher not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'nip' => 'sometimes|string|unique:teachers,nip,' . $id,
            'gender' => 'sometimes|in:L,P',
            'address' => 'sometimes|string',
            'contact' => 'sometimes|string',
            'email' => 'sometimes|email|unique:teachers,email,' . $id,
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $teacherData = $request->only(['name', 'nip', 'gender', 'address', 'contact', 'email']);

        if ($request->hasFile('photo')) {
            if ($teacher->photo) {
                Storage::disk('public')->delete($teacher->photo);
            }
            $photoPath = $request->file('photo')->store('photos/teachers', 'public');
            $teacherData['photo'] = $photoPath;
        }

        $teacher->update($teacherData);

        return response()->json([
            'status' => 200,
            'message' => 'Teacher updated successfully',
            'teacher' => $teacher
        ], 200);
    }

    public function destroy($id)
    {
        $teacher = Teacher::find($id);

        if (!$teacher) {
            return response()->json([
                'status' => 404,
                'message' => 'Teacher not found'
            ], 404);
        }

        if ($teacher->photo) {
            Storage::disk('public')->delete($teacher->photo);
        }

        $teacher->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Teacher deleted successfully'
        ], 200);
    }
}
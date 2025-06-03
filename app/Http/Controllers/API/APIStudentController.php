<?php

namespace App\Http\Controllers\API;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class APIStudentController extends Controller
{
    public function index()
    {
        $students = Student::all();
        $data = [
            'status' => 200,
            'students' => $students
        ];

        return response()->json($data, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'nis' => 'required|string|unique:students,nis',
            'gender' => 'required|in:L,P',
            'address' => 'required|string',
            'contact' => 'required|string',
            'email' => 'required|email|unique:students,email',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $studentData = $request->only(['name', 'nis', 'gender', 'address', 'contact', 'email']);

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('student-photos', 'public');
            $studentData['photo'] = $photoPath;
        }

        $student = Student::create($studentData);

        return response()->json([
            'status' => 201,
            'message' => 'Student created successfully',
            'student' => $student
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'status' => 404,
                'message' => 'Student not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'nis' => 'sometimes|string|unique:students,nis,' . $id,
            'gender' => 'sometimes|in:in:L,P',
            'address' => 'sometimes|string',
            'contact' => 'sometimes|string',
            'email' => 'sometimes|email|unique:students,email,' . $id,
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors()
            ], 422);
        }

        $studentData = $request->only(['name', 'nis', 'gender', 'address', 'contact', 'email']);

        if ($request->hasFile('photo')) {
            if ($student->photo) {
                Storage::disk('public')->delete($student->photo);
            }
            $photoPath = $request->file('photo')->store('student-photos', 'public');
            $studentData['photo'] = $photoPath;
        }

        $student->update($studentData);

        return response()->json([
            'status' => 200,
            'message' => 'Student updated successfully',
            'student' => $student
        ], 200);
    }

    public function destroy($id)
    {
        $student = Student::find($id);

        if (!$student) {
            return response()->json([
                'status' => 404,
                'message' => 'Student not found'
            ], 404);
        }

        if ($student->photo) {
            Storage::disk('public')->delete($student->photo);
        }

        $student->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Student deleted successfully'
        ], 200);
    }
}
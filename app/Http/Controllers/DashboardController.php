<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\PKL_Assignment;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $dashboardUser = null;
        $pklAssignment = null;

        if ($user) {
            if ($user->hasRole('student')) {
                $student = Student::where('email', $user->email)->first();
                if ($student) {
                    $pklAssignment = PKL_Assignment::where('student_id', $student->id)
                        ->with(['industry', 'teacher'])
                        ->latest('start_date')
                        ->first();
                    $teacher = Teacher::where('id', $pklAssignment->teacher->id)->first();
                    $dashboardUser = [
                        'role' => 'student',
                        'name' => $student->name,
                        'nis' => $student->nis ?? null,
                        'gender' => $student->gender ?? null,
                        'address' => $student->address ?? null,
                        'contact' => $student->contact ?? null,
                        'email' => $student->email ?? null,
                        'photo' => $student->photo ? asset('storage/' . $student->photo) : null,
                        'pkl_assignment' => $pklAssignment ? [
                            'industry' => $pklAssignment->industry ? [
                                'name' => $pklAssignment->industry->name,
                                'address' => $pklAssignment->industry->address,
                                'business_field' => $pklAssignment->industry->business_field ?? 'N/A',
                                'contact' => $pklAssignment->industry->contact ?? 'N/A',
                                'email' => $pklAssignment->industry->email ?? 'N/A',
                                'website' => $pklAssignment->industry->website ?? 'N/A',
                            ] : null,
                            'teacher' => $pklAssignment->teacher ? [
                                'name' => $pklAssignment->teacher->name,
                                'nip' => $pklAssignment->teacher->nip ?? 'N/A',
                                'gender' => $pklAssignment->teacher->gender ?? 'N/A',
                                'address' => $pklAssignment->teacher->address ?? 'N/A',
                                'contact' => $pklAssignment->teacher->contact ?? 'N/A',
                                'email' => $pklAssignment->teacher->email ?? 'N/A',
                                'photo' => $teacher->photo ? asset('storage/' . $teacher->photo) : null,
                            ] : null,
                            'start_date' => $pklAssignment->start_date->toDateString(),
                            'end_date' => $pklAssignment->end_date->toDateString(),
                        ] : null,
                    ];
                }
            } elseif ($user->hasRole('teacher')) {
                $teacher = Teacher::where('email', $user->email)->first();
                if ($teacher) {
                    $dashboardUser = [
                        'role' => 'teacher',
                        'name' => $teacher->name,
                        'nip' => $teacher->nip ?? null,
                        'gender' => $teacher->gender ?? null,
                        'address' => $teacher->address ?? null,
                        'contact' => $teacher->contact ?? null,
                        'email' => $teacher->email ?? null,
                        'photo' => $teacher->photo ? asset('storage/' . $teacher->photo) : null,
                    ];
                }
            }

            if (!$dashboardUser) {
                $dashboardUser = [
                    'role' => $user->hasRole('student') ? 'student' : ($user->hasRole('teacher') ? 'teacher' : 'unknown'),
                    'name' => $user->name ?? 'Unknown User',
                    'nis' => null,
                    'nip' => null,
                    'gender' => null,
                    'address' => null,
                    'contact' => null,
                    'email' => $user->email ?? null,
                    'photo' => null,
                    'pkl_assignment' => null,
                ];
            }
        }

        return Inertia::render('dashboard', [
            'user' => $dashboardUser,
        ]);
    }
}
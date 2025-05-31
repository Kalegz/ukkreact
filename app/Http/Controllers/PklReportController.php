<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Industry;
use App\Models\PKL_Assignment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class PklReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 9;

        $pklAssignments = PKL_Assignment::query()
            ->with(['student', 'teacher', 'industry'])
            ->when($search, function ($query, $search) {
                return $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            })
            ->paginate($perPage, ['*'], 'page', $page);

        $students = Student::all();
        $teachers = Teacher::all();
        $industries = Industry::all();

        return Inertia::render('PklReport', [
            'pklAssignments' => $pklAssignments->items(),
            'pagination' => [
                'current_page' => $pklAssignments->currentPage(),
                'last_page' => $pklAssignments->lastPage(),
                'per_page' => $pklAssignments->perPage(),
                'total' => $pklAssignments->total(),
            ],
            'filters' => ['search' => $search],
            'students' => $students,
            'teachers' => $teachers,
            'industries' => $industries,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'teacher_id' => 'required|exists:teachers,id',
            'industry_id' => 'required|exists:industries,id',
            'start_date' => 'required|date',
            'end_date' => [
                'required',
                'date',
                'after:start_date', 
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = Carbon::parse($request->input('start_date')); 
                    $endDate = Carbon::parse($value); 
                    
                    if ($endDate->lessThanOrEqualTo($startDate)) {
                        $fail('The end date must be after the start date.');
                        return;
                    }

                    $daysDifference = $startDate->diffInDays($endDate);

                    if ($daysDifference < 90) {
                        $fail('The PKL duration must be at least 90 days.');
                    }
                },
            ],
        ]);

        DB::beginTransaction();

        try {
            $student = Student::find($validated['student_id']);
            $existingReport = PKL_Assignment::where('student_id', $student->id)->exists();
            if ($existingReport) {
                DB::rollBack();
                return redirect()->route('pkl-report')->with('error', "You've already made a report.");
            }

            PKL_Assignment::create($validated);
            $student->update(['pkl_report' => '1']);
            DB::commit();

            return redirect()->route('pkl-report')->with('success', 'PKL Report created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('pkl-report')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }
}
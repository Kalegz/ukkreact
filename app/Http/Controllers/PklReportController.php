<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Industry;
use Illuminate\Http\Request;
use App\Models\PKL_Assignment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;

class PklReportController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 9;

        $pklAssignments = PKL_Assignment::query()
            ->with([
                'student' => function ($query) {
                    $query->select('id', 'name', 'email', 'gender')
                          ->addSelect(DB::raw('get_gender_display(gender) as gender_display'));
                },
                'teacher' => function ($query) {
                    $query->select('id', 'name', 'gender')
                          ->addSelect(DB::raw('get_gender_display(gender) as gender_display'));
                },
                'industry'
            ])
            ->when($search, function ($query, $search) {
                return $query->whereHas('student', function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%');
                });
            })
            ->paginate($perPage, ['*'], 'page', $page);

        $students = Student::all();
        $teachers = Teacher::all();
        $industries = Industry::all();

        $authEmail = Auth::user()->email;
        $authStudent = Student::where('email', $authEmail)->first();

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
            'authStudent' => $authStudent ? [
                'id' => $authStudent->id,
                'name' => $authStudent->name,
                'email' => $authStudent->email,
            ] : null,
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
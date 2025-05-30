<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use App\Models\PKL_Assignment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;

class PklReportController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        // Log raw input data
        Log::info('Raw Start Date: ' . $request->input('start_date') . ', Raw End Date: ' . $request->input('end_date'));

        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'teacher_id' => 'required|exists:teachers,id',
            'industry_id' => 'required|exists:industries,id',
            'start_date' => 'required|date', // Accepts YYYY-MM-DD
            'end_date' => [
                'required',
                'date', // Accepts YYYY-MM-DD
                'after:start_date', // Ensures end_date is after start_date
                function ($attribute, $value, $fail) use ($request) {
                    $startDate = Carbon::parse($request->input('start_date')); // Parse YYYY-MM-DD
                    $endDate = Carbon::parse($value); // Parse YYYY-MM-DD
                    Log::info('Parsed Start Date: ' . $startDate->toDateString() . ', Parsed End Date: ' . $endDate->toDateString());

                    // Ensure end_date is after start_date (redundant check for safety)
                    if ($endDate->lessThanOrEqualTo($startDate)) {
                        $fail('The end date must be after the start date.');
                        return;
                    }

                    // Calculate positive difference with startDate first
                    $daysDifference = $startDate->diffInDays($endDate);
                    Log::info('Days Difference: ' . $daysDifference);

                    if ($daysDifference < 90) {
                        $fail('The PKL duration must be at least 90 days.');
                    }
                },
            ],
        ]);

        DB::beginTransaction();

        try {
            $student = Student::find($validated['student_id']);
            // Check if a PKL report already exists for this student
            $existingReport = PKL_Assignment::where('student_id', $student->id)->exists();
            if ($existingReport) {
                DB::rollBack();
                return redirect()->route('pkl-report')->with('error', "You've already made a report.");
            }

            PKL_Assignment::create($validated);

            // Update the student's report_status to 1
            $student->update(['report_status' => 1]);

            DB::commit();

            return redirect()->route('pkl-report')->with('success', 'PKL Report created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('pkl-report')->with('error', 'An error occurred: ' . $e->getMessage());
        }
    }
}
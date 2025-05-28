<?php

namespace App\Http\Controllers;

use App\Models\PKL_Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class PklReportController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'teacher_id' => 'required|exists:teachers,id',
            'industry_id' => 'required|exists:industries,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        PKL_Assignment::create($validated);

        return redirect()->route('pkl-report')->with('success', 'PKL Report created successfully.');
    }
}
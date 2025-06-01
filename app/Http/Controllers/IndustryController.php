<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class IndustryController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search');
        $page = $request->query('page', 1);
        $perPage = 9;

        $industries = Industry::query()
            ->when($search, function ($query, $search) {
                return $query->where('name', 'like', '%' . $search . '%');
            })
            ->paginate($perPage, ['*'], 'page', $page);

        $authEmail = Auth::user()->email;
        $authStudent = Student::where('email', $authEmail)->select('id', 'name', 'email')->first();

        return Inertia::render('Industries', [
            'industries' => $industries->items(),
            'pagination' => [
                'current_page' => $industries->currentPage(),
                'last_page' => $industries->lastPage(),
                'per_page' => $industries->perPage(),
                'total' => $industries->total(),
            ],
            'filters' => ['search' => $search],
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
            'name' => 'required|string|max:255',
            'business_field' => 'nullable|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        $authEmail = Auth::user()->email;
        $authStudent = Student::where('email', $authEmail)->first();

        if (!$authStudent) {
            return redirect()->route('industries')->with('error', 'Only students can create industries.');
        }

        Industry::create($validated);

        return redirect()->route('industries')->with('success', 'Industry created successfully.');
    }
}
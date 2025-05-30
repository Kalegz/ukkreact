<?php

namespace App\Http\Controllers;

use App\Models\Industry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;

class IndustryController extends Controller
{
    public function index()
    {
        //
    }
    
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_field' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'contact' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'website' => 'nullable|url|max:255',
        ]);

        Industry::create($validated);

        return redirect()->route('industries')->with('success', 'Industry created successfully.');
    }
}
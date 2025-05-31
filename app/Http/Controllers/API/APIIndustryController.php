<?php

namespace App\Http\Controllers\API;

use App\Models\Industry;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class APIIndustryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $industry = Industry::all()->map(function($industry) {
            return [
                'id' => $industry->id,
                'name' => $industry->name,
                'business_field' => $industry->business_field,
                'address' => $industry->address,
                'contact' => $industry->contact,
                'email' => $industry->email,
                'website' => $industry->website
            ];
        });
        return response()->json($industry);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
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

        return response()->json('success', 'Industry created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

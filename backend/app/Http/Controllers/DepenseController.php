<?php

namespace App\Http\Controllers;

use App\Models\Depense;
use App\Models\Notification;
use Illuminate\Http\Request;

class DepenseController extends Controller
{
    public function index()
    {
        return response()->json(Depense::orderBy('date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'amount' => 'required|numeric',
            'category' => 'required|string',
            'date' => 'required|date',
            'description' => 'nullable|string',
        ]);

        $depense = Depense::create($validated);
        
        Notification::create([
            'user_id' => 1,
            'type' => 'expense',
            'message' => "Nouvelle dépense enregistrée : {$depense->title} ({$depense->amount} €)"
        ]);

        return response()->json($depense, 201);
    }

    public function show(Depense $depense)
    {
        return response()->json($depense);
    }

    public function update(Request $request, Depense $depense)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string',
            'amount' => 'sometimes|required|numeric',
            'category' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'description' => 'nullable|string',
        ]);

        $depense->update($validated);
        return response()->json($depense);
    }

    public function destroy(Depense $depense)
    {
        $depense->delete();
        return response()->json(null, 204);
    }
}

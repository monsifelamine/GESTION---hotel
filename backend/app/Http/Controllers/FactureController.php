<?php

namespace App\Http\Controllers;

use App\Models\Facture;
use App\Models\Reservation;
use Illuminate\Http\Request;

class FactureController extends Controller
{
    public function index()
    {
        return response()->json(Facture::with('reservation.client')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|exists:reservations,id|unique:factures',
            'due_date' => 'required|date',
        ]);

        $reservation = Reservation::find($validated['reservation_id']);
        $validated['total_amount'] = $reservation->total_price;
        $validated['amount_paid'] = 0;
        $validated['status'] = 'unpaid';

        $facture = Facture::create($validated);
        return response()->json($facture, 201);
    }

    public function show(Facture $facture)
    {
        return response()->json($facture->load(['reservation.client', 'payments']));
    }

    public function update(Request $request, Facture $facture)
    {
        $validated = $request->validate([
            'due_date' => 'sometimes|required|date',
            'status' => 'sometimes|required|in:unpaid,partially_paid,paid',
        ]);

        $facture->update($validated);
        return response()->json($facture);
    }
}

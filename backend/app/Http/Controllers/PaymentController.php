<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Facture;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function index()
    {
        return response()->json(Payment::with('facture.reservation.client')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'facture_id' => 'required|exists:factures,id',
            'amount' => 'required|numeric|min:0.01',
            'payment_method' => 'required|in:cash,credit_card,bank_transfer,online',
            'transaction_id' => 'nullable|string',
        ]);

        $validated['payment_date'] = now();

        return DB::transaction(function () use ($validated) {
            $payment = Payment::create($validated);
            
            $facture = Facture::find($validated['facture_id']);
            $facture->amount_paid += $payment->amount;
            
            if ($facture->amount_paid >= $facture->total_amount) {
                $facture->status = 'paid';
            } elseif ($facture->amount_paid > 0) {
                $facture->status = 'partially_paid';
            }
            $facture->save();

            // Update reservation payment status
            $reservation = $facture->reservation;
            $reservation->payment_status = $facture->status;
            $reservation->save();

            Notification::create([
                'user_id' => 1,
                'type' => 'payment',
                'message' => "Paiement de {$payment->amount} € reçu pour la facture #{$facture->id}."
            ]);

            return response()->json($payment, 201);
        });
    }

    public function show(Payment $payment)
    {
        return response()->json($payment->load('facture.reservation.client'));
    }
}

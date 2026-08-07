<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Facture;
use App\Models\Notification;
use App\Models\User;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json(Reservation::with(['client', 'room'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'room_id' => 'required|exists:rooms,id',
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
            'status' => 'nullable|in:pending,confirmed,cancelled,completed',
            'notes' => 'nullable|string',
        ]);

        // Calculate total price based on room price and number of nights
        $room = Room::find($validated['room_id']);
        $checkIn = new \DateTime($validated['check_in']);
        $checkOut = new \DateTime($validated['check_out']);
        $nights = $checkIn->diff($checkOut)->days;
        if ($nights == 0) $nights = 1;
        $validated['total_price'] = $room->price_per_night * $nights;

        return DB::transaction(function () use ($validated) {
            $reservation = Reservation::create($validated);
            
            // Notification for Admin
            Notification::create([
                'user_id' => 1, // Default admin
                'type' => 'reservation',
                'message' => "Nouvelle réservation " . ($reservation->status === 'pending' ? 'en attente' : 'confirmée') . " de {$reservation->client->first_name} {$reservation->client->last_name} (Chambre {$reservation->room->room_number})"
            ]);

            // If status is confirmed, create a facture
            if ($reservation->status === 'confirmed') {
                Facture::create([
                    'reservation_id' => $reservation->id,
                    'total_amount' => $reservation->total_price,
                    'amount_paid' => 0,
                    'due_date' => $reservation->check_out,
                    'status' => 'unpaid'
                ]);

                // Update room status if check-in is today
                if ($reservation->check_in <= now()->toDateString()) {
                    $reservation->room->update(['status' => 'occupied']);
                }
            }

            return response()->json($reservation->load(['client', 'room']), 201);
        });
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['client', 'room', 'facture.payments']));
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,confirmed,cancelled,completed',
            'payment_status' => 'sometimes|required|in:unpaid,partially_paid,paid',
            'notes' => 'nullable|string',
        ]);

        return DB::transaction(function () use ($request, $validated, $reservation) {
            $oldStatus = $reservation->status;
            $reservation->update($validated);

            // Handle status transitions
            if ($oldStatus !== $reservation->status) {
                if ($reservation->status === 'confirmed') {
                    // Create facture if not exists
                    if (!$reservation->facture) {
                        Facture::create([
                            'reservation_id' => $reservation->id,
                            'total_amount' => $reservation->total_price,
                            'amount_paid' => 0,
                            'due_date' => $reservation->check_out,
                            'status' => 'unpaid'
                        ]);
                    }
                    // Update room status
                    $reservation->room->update(['status' => 'occupied']);
                    
                    Notification::create([
                        'user_id' => 1,
                        'type' => 'reservation',
                        'message' => "La réservation #{$reservation->id} a été confirmée."
                    ]);
                } elseif ($reservation->status === 'completed' || $reservation->status === 'cancelled') {
                    $reservation->room->update(['status' => 'available']);

                    Notification::create([
                        'user_id' => 1,
                        'type' => 'reservation',
                        'message' => "La réservation #{$reservation->id} est désormais " . ($reservation->status === 'completed' ? 'terminée.' : 'annulée.')
                    ]);
                }
            }

            return response()->json($reservation->load(['client', 'room', 'facture']));
        });
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(null, 204);
    }

    public function myReservations(Request $request)
    {
        $user = $request->user();
        return response()->json(
            Reservation::with(['room', 'facture'])
                ->whereHas('client', function($query) use ($user) {
                    $query->where('user_id', $user->id);
                })
                ->latest()
                ->get()
        );
    }
}

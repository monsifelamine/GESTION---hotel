<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Room;
use App\Models\Reservation;
use App\Models\Facture;
use App\Models\Depense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total_clients' => Client::count(),
            'total_rooms' => Room::count(),
            'available_rooms' => Room::where('status', 'available')->count(),
            'occupied_rooms' => Room::where('status', 'occupied')->count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'total_revenue' => Facture::sum('amount_paid'),
            'total_expenses' => Depense::sum('amount'),
            'recent_reservations' => Reservation::with(['client', 'room'])->latest()->take(5)->get(),
        ];

        // Revenue by month (last 6 months)
        $revenue_chart = Facture::select(
            DB::raw('sum(amount_paid) as aggregate'),
            DB::raw("strftime('%m', created_at) as month")
        )
        ->where('created_at', '>=', now()->subMonths(6))
        ->groupBy('month')
        ->get();

        $stats['revenue_chart'] = $revenue_chart;

        return response()->json($stats);
    }
}

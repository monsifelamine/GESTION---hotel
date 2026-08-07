<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default Admin User
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@hotel.com',
            'password' => bcrypt('password'),
        ]);

        // Sample Rooms
        $rooms = [
            ['room_number' => '101', 'type' => 'single', 'price_per_night' => 50, 'status' => 'available', 'capacity' => 1],
            ['room_number' => '102', 'type' => 'single', 'price_per_night' => 50, 'status' => 'occupied', 'capacity' => 1],
            ['room_number' => '201', 'type' => 'double', 'price_per_night' => 80, 'status' => 'available', 'capacity' => 2],
            ['room_number' => '202', 'type' => 'double', 'price_per_night' => 80, 'status' => 'available', 'capacity' => 2],
            ['room_number' => '301', 'type' => 'suite', 'price_per_night' => 150, 'status' => 'available', 'capacity' => 4],
            ['room_number' => '401', 'type' => 'deluxe', 'price_per_night' => 250, 'status' => 'maintenance', 'capacity' => 2],
        ];

        foreach ($rooms as $room) {
            \App\Models\Room::create($room);
        }

        // Sample Clients
        $clients = [
            ['first_name' => 'John', 'last_name' => 'Doe', 'phone' => '123456789', 'cin_passport' => 'AB123456', 'nationality' => 'American'],
            ['first_name' => 'Jane', 'last_name' => 'Smith', 'phone' => '987654321', 'cin_passport' => 'CD789012', 'nationality' => 'British'],
        ];

        foreach ($clients as $client) {
            \App\Models\Client::create($client);
        }

        // Sample Reservation
        \App\Models\Reservation::create([
            'client_id' => 1,
            'room_id' => 2,
            'check_in' => now(),
            'check_out' => now()->addDays(3),
            'total_price' => 150,
            'status' => 'confirmed',
            'payment_status' => 'paid',
        ]);

        // Sample Facture for the reservation
        \App\Models\Facture::create([
            'reservation_id' => 1,
            'total_amount' => 150,
            'amount_paid' => 150,
            'due_date' => now()->addDays(3),
            'status' => 'paid',
        ]);

        // Sample Expenses
        $expenses = [
            ['title' => 'Électricité Mars', 'amount' => 450, 'category' => 'Utility', 'date' => now()->subDays(10), 'description' => 'Facture EDF Mars 2026'],
            ['title' => 'Produits Nettoyage', 'amount' => 120, 'category' => 'Supplies', 'date' => now()->subDays(5), 'description' => 'Achat mensuel'],
            ['title' => 'Maintenance Ascenseur', 'amount' => 300, 'category' => 'Maintenance', 'date' => now()->subDays(2)],
        ];

        foreach ($expenses as $expense) {
            \App\Models\Depense::create($expense);
        }

        // Sample Notifications
        \App\Models\Notification::create([
            'user_id' => 1,
            'type' => 'system',
            'message' => 'Bienvenue dans votre nouveau système de gestion hôtelière !',
            'is_read' => false
        ]);
    }
}

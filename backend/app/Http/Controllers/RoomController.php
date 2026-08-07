<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index()
    {
        return response()->json(Room::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'room_number' => 'required|string|unique:rooms',
            'type' => 'required|in:single,double,suite,deluxe',
            'price_per_night' => 'required|numeric',
            'status' => 'required|in:available,occupied,maintenance',
            'capacity' => 'required|integer',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $room = Room::create($validated);
        return response()->json($room, 201);
    }

    public function show(Room $room)
    {
        return response()->json($room);
    }

    public function update(Request $request, Room $room)
    {
        $validated = $request->validate([
            'room_number' => 'sometimes|required|string|unique:rooms,room_number,' . $room->id,
            'type' => 'sometimes|required|in:single,double,suite,deluxe',
            'price_per_night' => 'sometimes|required|numeric',
            'status' => 'sometimes|required|in:available,occupied,maintenance',
            'capacity' => 'sometimes|required|integer',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
        ]);

        $room->update($validated);
        return response()->json($room);
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return response()->json(null, 204);
    }
}

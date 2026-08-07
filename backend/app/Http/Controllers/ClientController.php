<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return response()->json(Client::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'phone' => 'nullable|string',
            'cin_passport' => 'required|string|unique:clients',
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $client = Client::create($validated);
        return response()->json($client, 201);
    }

    public function show(Client $client)
    {
        return response()->json($client);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string',
            'last_name' => 'sometimes|required|string',
            'phone' => 'nullable|string',
            'cin_passport' => 'sometimes|required|string|unique:clients,cin_passport,' . $client->id,
            'address' => 'nullable|string',
            'nationality' => 'nullable|string',
        ]);

        $client->update($validated);
        return response()->json($client);
    }

    public function destroy(Client $client)
    {
        $client->delete();
        return response()->json(null, 204);
    }
}

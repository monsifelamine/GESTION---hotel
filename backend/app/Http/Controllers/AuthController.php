<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\VerificationCode;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // can be email or cin
            'password' => 'required',
        ]);

        $login = $request->input('login');
        $user = null;

        // 1. Try to find by email
        $user = User::where('email', $login)->first();

        // 2. If not found, try to find by client CIN
        if (!$user) {
            $client = Client::where('cin_passport', $login)->first();
            if ($client && $client->user_id) {
                $user = User::find($client->user_id);
            }
        }

        if ($user && Hash::check($request->password, $user->password)) {
            $token = $user->createToken('auth_token')->plainTextToken;

            $client = null;
            if ($user->role === 'client') {
                $client = Client::where('user_id', $user->id)->first();
            }

            return response()->json([
                'user' => $user,
                'token' => $token,
                'client' => $client
            ]);
        }

        return response()->json(['message' => 'Identifiants invalides (Email/CIN ou mot de passe)'], 401);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'date_of_birth' => 'nullable|date',
        ]);

        $user = User::create([
            'name' => $validated['first_name'] . ' ' . $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'client',
        ]);

        $client = Client::create([
            'user_id' => $user->id,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Compte créé avec succès.',
            'user' => $user,
            'client' => $client,
            'token' => $token
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }
}


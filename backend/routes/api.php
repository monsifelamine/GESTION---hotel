<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DepenseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/dashboard', [DashboardController::class, 'index']);

Route::get('/notifications', [NotificationController::class, 'index']);
Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

Route::get('/my-reservations', [ReservationController::class, 'myReservations'])->middleware('auth:sanctum');

Route::apiResource('clients', ClientController::class);
Route::apiResource('rooms', RoomController::class);
Route::apiResource('reservations', ReservationController::class);
Route::apiResource('factures', FactureController::class);
Route::apiResource('payments', PaymentController::class);
Route::apiResource('depenses', DepenseController::class);

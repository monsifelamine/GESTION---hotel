<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        // For simplicity, we assume we want all notifications for now
        // In a real app, we would use $request->user()->notifications
        return response()->json(Notification::latest()->take(10)->get());
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);
        return response()->json($notification);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('is_read', false)->update(['is_read' => true]);
        return response()->json(['message' => 'All marked as read']);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();
        return response()->json(null, 204);
    }
}

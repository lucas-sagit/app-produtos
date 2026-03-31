<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class notificationController extends Controller
{
    public function notification(){
        $latePayments = Payment::where('status', 'pending')
            ->whereDate('due_date', '<', now())
            ->with(['service.client'])
            ->get();

        return response()->json([
            'count' => $latePayments->count(),
            'data' => $latePayments
        ]);
    }
}

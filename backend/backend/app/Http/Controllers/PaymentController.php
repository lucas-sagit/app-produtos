<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;



class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'description' => 'required|string|max:255',
            'cash' => 'required|numeric',
            'status' => 'boolean',
            'payment_date' => 'required|date',
        ]);

        $payment = payment::create($validated);

        return response()->json([
            'message' => 'Pagamento realizado com sucesso',
            'payment' => $payment
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payment = Payment::with('client')->findOrFail($id);
        return response()->json($payment);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'description' => 'string|max:255',
            'cash' => 'numeric',
            'status' => 'boolean',
            'payment_date' => 'nullable|date',
        ]);

        $payment->update($validated);

        return response()->json([
            'message' => 'Pagamento atualizado com sucesso!',
            'data' => $payment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Payment::destroy($id);


        return response()->json([
            'message' => 'pagamento deletado com sucesso!'
        ]);
    }
}

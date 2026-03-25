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
        return response()->json(Payment::with('service.client')->get()
        );
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
            'service_id' => 'required|exists::services.id',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        $payment = Payment::create([
            ...$validated,
            'status' => 'pedding'
        ]);


        return response()->json([
            'message' => 'Pagamento feito com sucesso',
            'payment' => $payment
        ], 201);

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $payment = Payment::with('service.client')->findOrFail($id);
        return response()->json($payment);
    }

    public function pay(string $id){
        $payment = Payment::findOrFail($id);
        $payment->update([
            'status' => 'paid',
            'paid_id' => now()
        ]);

        return response()->json([
            'message'=>'pagamento confirmado',
            'paymente' => $payment
        ]);
    }

    public function markLate(){
        $payments = Payment::where('status', 'pending')
         ->where('due_date', '<', now())
         ->get();

         foreach ($payments as $payment){
            $payment->update([
                'status' => 'late'
            ]);
         }

         return response()->json([
            'message' => 'Pagamentos atrasados atualizados'
         ]);
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
            'amount' => 'numeric',
            'due_date' => 'date',
            'status' => 'in(pedding, paid, late)'
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
            'message' => 'Pagamento deletado com sucesso!'
        ]);
    }
}

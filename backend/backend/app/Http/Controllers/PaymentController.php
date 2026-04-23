<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Pega o pagamento mais recente de cada serviço (maior ID)
        $subQuery = Payment::selectRaw('MAX(id) as max_id')
            ->groupBy('service_id');

        $payments = Payment::whereIn('id', $subQuery)
            ->with(['service.client'])
            ->get();

        $payments->transform(function ($payment){
            $lastPaid = Payment::where('service_id', $payment->service_id)
                ->whereNot('paid_at')
                ->orderBy('paid_at')
                ->first();

                $payment->last_paid_at = $lastPaid?->paid_at;
                return $payment;
        });

        return response()->json($payments);
    }

    /**
     * Get payment history by service ID
     */
    public function history(int $serviceId)
    {
        $payments = Payment::where('service_id', $serviceId)
            ->orderBy('due_date', 'desc')
            ->get();

        return response()->json($payments);
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
            'service_id' => 'required|exists:services,id',
            'amount' => 'required|numeric',
            'due_date' => 'required|date',
        ]);

        $payment = null;

        DB::transaction(function () use ($validated, &$payment) {
            $payment = Payment::create([
                ...$validated,
                'status' => 'pending'
            ]);

            $service = $payment->service;

            if ($service) {
                $service->update([
                    'due_date' => $validated['due_date'],
                ]);
            }
        });


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

    // Evita pagar duas vezes
    if ($payment->status === 'paid') {
        return response()->json([
            'message' => 'Pagamento já foi realizado'
        ], 400);
    }

    // Atualiza pagamento atual
    $payment->update([
        'status' => 'paid',
        'paid_at' => now()
    ]);

    // 🔥 Gera próxima data
    $nextDueDate = Carbon::parse($payment->due_date)->addMonth();

    // 🔥 Verifica se já existe pagamento pendente para este serviço
    $existingPendingPayment = Payment::where('service_id', $payment->service_id)
        ->where('status', 'pending')
        ->where('id', '!=', $payment->id)
        ->first();

    // 🔥 Cria novo pagamento apenas se não existir um pendente
    if (!$existingPendingPayment) {
        $newPayment = Payment::create([
            'service_id' => $payment->service_id,
            'amount' => $payment->amount,
            'due_date' => $nextDueDate,
            'status' => 'pending'
        ]);

        // 🔥 Atualiza service
        $service = $payment->service;
        $service->update([
            'due_date' => $nextDueDate
        ]);

        return response()->json([
            'message' => 'Pagamento confirmado e próximo gerado',
            'payment' => $payment,
            'next_payment' => $newPayment
        ]);
    }

    return response()->json([
        'message' => 'Pagamento confirmado',
        'payment' => $payment
    ]);
}

    public function markLate(){
        $payments = Payment::where('status', 'pending')
         ->where('due_date', '<', now()->subDay(10))
         ->get();

         foreach ($payments as $payment){
            $payment->update([
                'status' => 'late'
            ]);
         }

         return response()->json([
            'message' => 'Pagamentos atrasados há mais de 10 dias.'
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
            'status' => 'in:pending,paid,late'
        ]);

        DB::transaction(function () use ($payment, $validated) {
            $payment->update($validated);

            if (array_key_exists('due_date', $validated)) {
                $service = $payment->service;

                if ($service) {
                    $service->update([
                        'due_date' => $validated['due_date'],
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Pagamento atualizado com sucesso!',
            'data' => $payment->fresh(['service.client'])
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


    public function dashboard(){
        // Retorna todos os pagamentos para o dashboard calcular
        $payments = Payment::with('service')->get();

        return response()->json($payments);
    }
}

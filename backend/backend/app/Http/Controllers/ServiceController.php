<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Service::with('client')->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'plans' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'started_at' => 'required|date',
            'status' => 'required|in:ativo,suspenso,cancelado',
        ]);

        $startedAt = Carbon::createFromFormat('Y-m-d', $validated['started_at']);
        $dueDate = $startedAt->copy()->addDays(30);

        $service = Service::create([
            'client_id' => $validated['client_id'],
            'due_date' => $dueDate->format('Y-m-d'),
            'plans' => $validated['plans'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'status' => $validated['status'],
            'started_at' => $validated['started_at'],
        ]);

        Payment::create([
            'service_id' => $service->id,
            'amount' => $service->price,
            'due_date' => $dueDate,
            'status' => 'pending'
        ]);

        return response()->json([
            'message' => 'Serviço criado com sucesso',
            'service' => $service
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $service = Service::with('client', 'payment')->findOrFail($id);
        return response()->json($service);
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
        $service = Service::findOrFail($id);
        $newDueDate = null;

        $validated = $request->validate([
            'plans' => 'string|max:255',
            'description' => 'string|max:255',
            'price' => 'numeric',
            'status' => 'in:ativo,suspenso,cancelado',
            'started_at' => 'date'
        ]);

        // Recalcula o vencimento quando a data de início mudar.
        if (isset($validated['started_at'])) {
            $newDueDate = Carbon::createFromFormat('Y-m-d', $validated['started_at'])
                ->addDays(30)
                ->format('Y-m-d');

            $validated['due_date'] = $newDueDate;
        }

        DB::transaction(function () use ($service, $validated, $newDueDate) {
            $service->update($validated);

            if ($newDueDate) {
                $latestPayment = Payment::where('service_id', $service->id)
                    ->orderByDesc('id')
                    ->first();

                if ($latestPayment) {
                    $latestPayment->update([
                        'due_date' => $newDueDate,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Serviço atualizado com sucesso!',
            'data' => $service->fresh(['client', 'payment'])
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        Service::destroy($id);

        return response()->json([
            'message' => 'Serviço excluído com sucesso!'
        ]);
    }
}

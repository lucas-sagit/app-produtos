<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;
use App\Models\Payment;
use Carbon\Carbon;


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
            'client_id' => 'required|exists:clients.id',
            // 'payment_id' => 'nullable|exists:payments,id',
            'due_day'=> 'required|integer|min:1|max:31',
            'plans' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'price' => 'required|numeric',
            'started_at' => 'required|date',
            'status' => 'required|in:ativo,suspenso,cancelado',
        ]);


        $service = Service::create($validated);

        $due_date = Carbon::now()->day($service->due_day);

        if($due_date < now()){
            $due_date = $due_date->addMonth();
        }

        Payment::create([
            'service_id' => $service->id,
            'amount' => $service->price,
            'due_date' => $due_date,
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

        $validated = $request->validate([
            'plans' => 'string|max:255',
            'description' => 'string|max:255',
            'price' => 'numeric',
            'status' => 'in:ativo, suspenso, cancelado'
        ]);

        $service->update($validated);

        return response()->json([
            'message' => 'Serviço atualizado com sucesso!',
            'data' => $service
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

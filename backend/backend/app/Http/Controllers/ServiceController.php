<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Product;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Validation\ValidationException;

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
            'equipment_description' => 'nullable|string|max:255',
            'equipment_lote' => 'nullable|string|max:255',
            'equipment_quantity' => 'nullable|integer|min:1',
            'price' => 'required|numeric',
            'started_at' => 'required|date',
            'status' => 'required|in:ativo,suspenso,cancelado',
        ]);

        $startedAt = Carbon::createFromFormat('Y-m-d', $validated['started_at']);
        $dueDate = $startedAt->copy()->addDays(30);
        $equipment = $this->normalizeEquipmentData($validated);
        $service = null;

        DB::transaction(function () use ($validated, $dueDate, $equipment, &$service) {
            $serviceData = [
                'client_id' => $validated['client_id'],
                'due_date' => $dueDate->format('Y-m-d'),
                'plans' => $validated['plans'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'status' => $validated['status'],
                'started_at' => $validated['started_at'],
            ];

            if ($this->serviceSupportsEquipmentFields() && $equipment) {
                $serviceData['equipment_description'] = $equipment['description'] ?? null;
                $serviceData['equipment_lote'] = $equipment['lote'] ?? null;
                $serviceData['equipment_quantity'] = $equipment['quantity'] ?? null;
            }

            $service = Service::create($serviceData);

            Payment::create([
                'service_id' => $service->id,
                'amount' => $service->price,
                'due_date' => $dueDate,
                'status' => 'pending'
            ]);

            $this->decrementStockForEquipment($equipment);
        });

        return response()->json([
            'message' => 'Servico criado com sucesso',
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
            'equipment_description' => 'nullable|string|max:255',
            'equipment_lote' => 'nullable|string|max:255',
            'equipment_quantity' => 'nullable|integer|min:1',
            'price' => 'numeric',
            'status' => 'in:ativo,suspenso,cancelado',
            'started_at' => 'date'
        ]);

        $newEquipment = $this->normalizeEquipmentData([
            'equipment_description' => array_key_exists('equipment_description', $validated)
                ? $validated['equipment_description']
                : $service->equipment_description,
            'equipment_lote' => array_key_exists('equipment_lote', $validated)
                ? $validated['equipment_lote']
                : $service->equipment_lote,
            'equipment_quantity' => array_key_exists('equipment_quantity', $validated)
                ? $validated['equipment_quantity']
                : $service->equipment_quantity,
        ]);

        $originalEquipment = $this->normalizeEquipmentData([
            'equipment_description' => $service->equipment_description,
            'equipment_lote' => $service->equipment_lote,
            'equipment_quantity' => $service->equipment_quantity,
        ]);

        // Recalcula o vencimento quando a data de inicio mudar.
        if (isset($validated['started_at'])) {
            $newDueDate = Carbon::createFromFormat('Y-m-d', $validated['started_at'])
                ->addDays(30)
                ->format('Y-m-d');

            $validated['due_date'] = $newDueDate;
        }

        DB::transaction(function () use ($service, $validated, $newDueDate, $originalEquipment, $newEquipment) {
            if ($this->serviceSupportsEquipmentFields() && $originalEquipment) {
                $this->restoreStockForEquipment($originalEquipment);
            }

            $serviceData = [
                'plans' => $validated['plans'] ?? $service->plans,
                'description' => $validated['description'] ?? $service->description,
                'price' => $validated['price'] ?? $service->price,
                'status' => $validated['status'] ?? $service->status,
                'started_at' => $validated['started_at'] ?? $service->started_at,
                'due_date' => $validated['due_date'] ?? $service->due_date,
            ];

            if ($this->serviceSupportsEquipmentFields() && $newEquipment) {
                $serviceData['equipment_description'] = $newEquipment['description'] ?? null;
                $serviceData['equipment_lote'] = $newEquipment['lote'] ?? null;
                $serviceData['equipment_quantity'] = $newEquipment['quantity'] ?? null;
            }

            $service->update($serviceData);

            if ($this->serviceSupportsEquipmentFields() && $newEquipment) {
                $this->decrementStockForEquipment($newEquipment);
            }

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
            'message' => 'Servico atualizado com sucesso!',
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
            'message' => 'Servico excluido com sucesso!'
        ]);
    }

    private function normalizeEquipmentData(array $data): ?array
    {
        $description = trim((string) ($data['equipment_description'] ?? ''));
        $lote = trim((string) ($data['equipment_lote'] ?? ''));
        $quantity = $data['equipment_quantity'] ?? null;

        if ($description === '' && $lote === '' && ($quantity === null || $quantity === '')) {
            return null;
        }

        if ($quantity === null || $quantity === '') {
            throw ValidationException::withMessages([
                'equipment_quantity' => 'Informe a quantidade do equipamento para dar baixa no estoque.',
            ]);
        }

        $quantity = (int) $quantity;

        if ($quantity <= 0) {
            throw ValidationException::withMessages([
                'equipment_quantity' => 'A quantidade do equipamento deve ser maior que zero.',
            ]);
        }

        if ($description === '' && $lote === '') {
            throw ValidationException::withMessages([
                'equipment_description' => 'Informe a descricao ou o lote do equipamento.',
            ]);
        }

        return [
            'description' => $description !== '' ? $description : null,
            'lote' => $lote !== '' ? $lote : null,
            'quantity' => $quantity,
        ];
    }

    private function decrementStockForEquipment(?array $equipment): void
    {
        if (!$equipment) {
            return;
        }

        $query = Product::query()->lockForUpdate();

        if (!empty($equipment['description'])) {
            $query->where('description', $equipment['description']);
        }

        if (!empty($equipment['lote'])) {
            $query->where('lote', $equipment['lote']);
        }

        $product = $query->first();

        if (!$product) {
            throw ValidationException::withMessages([
                'equipment_description' => 'Nao foi possivel localizar o produto no estoque.',
            ]);
        }

        $currentQuantity = (int) $product->quantity;
        $requestedQuantity = (int) $equipment['quantity'];

        if ($requestedQuantity > $currentQuantity) {
            throw ValidationException::withMessages([
                'equipment_quantity' => 'Quantidade insuficiente em estoque.',
            ]);
        }

        $product->quantity = $currentQuantity - $requestedQuantity;
        $product->save();
    }

    private function restoreStockForEquipment(?array $equipment): void
    {
        if (!$equipment) {
            return;
        }

        $query = Product::query()->lockForUpdate();

        if (!empty($equipment['description'])) {
            $query->where('description', $equipment['description']);
        }

        if (!empty($equipment['lote'])) {
            $query->where('lote', $equipment['lote']);
        }

        $product = $query->first();

        if (!$product) {
            throw ValidationException::withMessages([
                'equipment_description' => 'Nao foi possivel localizar o produto para restaurar o estoque.',
            ]);
        }

        $product->quantity = (int) $product->quantity + (int) $equipment['quantity'];
        $product->save();
    }

    private function serviceSupportsEquipmentFields(): bool
    {
        return Schema::hasColumn('services', 'equipment_description')
            && Schema::hasColumn('services', 'equipment_lote')
            && Schema::hasColumn('services', 'equipment_quantity');
    }
}

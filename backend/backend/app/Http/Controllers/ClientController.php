<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Client::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'status_client' => 'boolean',
            'name' => 'required|string',
            'corporate_name' => 'nullable|string',
            'phone' => 'required|string',
            'cpf' => 'nullable|string|unique:clients,cpf',
            'cnpj' => 'nullable|string|unique:clients,cnpj',
            'city' => 'required|string',
            'address' => 'required|string',
            'street' => 'required|string',
            'number' => 'required|string',
        ]);

        $client = Client::create($validated);

       return response()->json([
            'message' => 'Cliente criado com sucesso!',
            'data' => $client
        ], 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $client = Client::findOrFail($id);
        return response()->json($client);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'corporate_name' => 'nullable|string',
            'cpf' => 'nullable|string|unique:clients,cpf,' . $id,
            'cnpj' => 'nullable|string|unique:clients,cnpj,' . $id,
            'city' => 'required|string',
            'address' => 'required|string',
            'street' => 'required|string',
            'number' => 'required|string',
        ]);

        $client = Client::findOrFail($id);
        $client->update($validated);

        return response()->json([
            'message' => 'Cliente atualizado com sucesso!',
            'data' => $client
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);
        $client->delete();

        return response()->json([
            'message' => 'Cliente excluído com sucesso!'
        ], 200);
    }
}

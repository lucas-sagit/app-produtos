<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class productController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $product = new Product();
        $product->category = $request->category;
        $product->description = $request->description;
        $product->lote = $request->lote;
        $product->price = $request->price;
        $product->others = $request->others;
        $product->quantity = $request->quantity;
        $product->image_url = $request->image_url;
        $product->save();
        return response()->json($product);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $product = new Product();
        $product->category = $request->category;
        $product->description = $request->description;
        $product->lote = $request->lote;
        $product->price = $request->price;
        $product->others = $request->others;
        $product->quantity = $request->quantity;
        $product->image_url = $request->image_url;
        $product->save();
        return response()->json($product);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::find($id);
        return response()->json($product);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $product = Product::find($id);
        return response()->json($product);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $product = Product::find($id);
        $product->category = $request->category;
        $product->description = $request->description;
        $product->lote = $request->lote;
        $product->price = $request->price;
        $product->others = $request->others;
        $product->quantity = $request->quantity;
        $product->image_url = $request->image_url;
        $product->save();
        return response()->json($product);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $product = Product::find($id);
        $product->delete();
        return response()->json($product);
    }
}

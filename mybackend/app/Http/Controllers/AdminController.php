<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Traemos las peticiones con su categoría, el conteo de firmas y OJO: el usuario creador
        $peticiones = Petition::with(['category', 'user', 'file'])
            ->withCount('signers')
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json([
            'success' => true,
            'data' => $peticiones
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $petition = Petition::findOrFail($id);
// Opcional: Aquí podrías añadir lógica para borrar los archivos físicos del servidor antes de borrar el registro
        $petition->delete();
        return response()->json([
            'success' => true,
            'message' => 'Petición eliminada correctamente por el administrador.'
        ], 200);

    }
}

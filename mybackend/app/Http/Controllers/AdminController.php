<?php

namespace App\Http\Controllers;

use App\Models\Petition;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Traemos las peticiones con su categoría, el conteo de firmas y OJO: el usuario creador
        try{
            $peticiones = Petition::with(['category', 'user', 'file'])
                ->withCount('signers')
                ->orderBy('created_at', 'desc')
                ->get();
        }catch (\Exception $e){
            return response()->json(['error' => $e->getMessage()], 500);
        }
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
    function update(Request $request, $id)
    {
        try {

            $request->validate([
                "title" => "max:255|nullable",
                "description" => "nullable|max:255",
                "destinatary" => "nullable|max:255",
                "category" => "required|exists:categories,id",
                "signers" => "numeric|min:0",
                "status" => "required|in:accepted,pending",
                "image" => "nullable|file|mimes:jpg,jpeg,png,webp"
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "la validación ha fallado, por favor, introduce correctamente los datos"], 400);
//            return response()->json(["message" => "error", $e->getMessage()], 400);
        }
        try {
            $petition = Petition::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["hubo un error"], 401);
        }
        // Autorización (Policy)
        $this->authorize('update', $petition);
        try {
            if (!is_null($request->title)) {
                $petition->title = strtolower($request->title);
            }
            if (!is_null($request->description)) {
                $petition->description = $request->description;
            }
            try {
                if (!is_null($request->image))
                    $this->fileReUpload($request, $petition->id);
                {
                }
            } catch (\Exception $e) {
                return response()->json([
                    "message" => "error",
                    "error" => $e->getMessage(),
                    "line" => $e->getLine(),
                    "file" => $e->getFile(),
                    "trace" => $e->getTraceAsString(),
                ], 400);
            }
            if (!is_null($request->destinatary)) {
                $petition->destinatary = $request->destinatary;
            }
            if ((!is_null($request->status)) && ($petition->status != $request->status)) {
                $petition->status = $request->status;
            }
            if (!(is_null($request->category)) && ($petition->category_id != $request->category)) {
                $petition->category_id = $request->category;
            }
        } catch (\Exception $e) {
            return response()->json(["message" => "error",
                "ha ocurrido un error"
//                $e->getMessage()
            ], 400);
        }
        $petition->save();
        return response()->json([
            "message" => "success",
//            "se ha editado exitosamente la peticion"

        ], 200);
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

    function cambiarEstado($id)
    {
        try {
            $petition = Petition::findOrFail($id);
            $petitionStatus = $petition->status;
            switch ($petitionStatus) {
                case "accepted":
                    $petition->status = "pending";
                    break;
                case "pending":
                    $petition->status = "accepted";
                    break;
            }
            $petition->save();
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "ha ocurrido un error"], 400);
        }
        return response()->json(["se ha actualizado el estado correctamente."], 200);
    }

}

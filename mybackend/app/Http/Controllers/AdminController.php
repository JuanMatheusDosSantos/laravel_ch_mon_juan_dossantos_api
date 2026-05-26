<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Petition;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File as FileFacade;

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
//                ->withCount('userSigners')
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
    function show($id)
    {
        try {
            $petition = Petition::with('file', "user", "userSigners")->findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["message" => "error",
//                    "no se ha podido encontrar la peticion"
                    $e->getMessage()
                ]
                , 404);
        }
        return response()->json($petition);
    }

    /**
     * Update the specified resource in storage.
     */
    function update(Request $request, $id)
    {
        try {

            $request->validate([
                "title" => "max:255|",
                "description" => "max:255",
                "destinatary" => "max:255",
                "category" => "required|exists:categories,id",
                "signers" => "numeric|min:0",
                "status" => "required|in:accepted,pending",
                "files" => "array",
                "files.*" => "file|mimes:jpg,jpeg,png,webp"
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
                if ($request->hasFile('files')) {
                    $this->fileReUpload($request, $petition->id);
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
    function fileReUpload(Request $request, $id)
    {
        if (!$request->hasFile('files')) return false; // guard

        try {
            $file = $request->file("files")[0]; // ← una sola referencia

            $imagenOriginal = File::where("petition_id", $id)->first();

            // Borrar fichero físico anterior si existe
            if ($imagenOriginal) {
                $original = public_path("/storage/assets/img/petitions/" . $imagenOriginal->file_path);
                if (FileFacade::exists($original)) {
                    FileFacade::delete($original);
                }
            }

            $image    = time() . '.' . $file->extension();
            $path     = public_path('/storage/assets/img/petitions');
            $pathName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $temp     = $file->getPathname();

            if (!copy($temp, $path . DIRECTORY_SEPARATOR . $image)) {
                return false;
            }

            if ($imagenOriginal) {
                $imagenOriginal->update([
                    "name"      => $pathName,
                    "file_path" => $image
                ]);
            } else {
                $petition = Petition::findOrFail($id);
                $petition->file()->create([
                    'name'        => $pathName,
                    'file_path'   => $image,
                    'petition_id' => $id
                ]);
            }

            return true;

        } catch (\Exception $e) {
            throw $e; // relanza para que el try/catch del update() lo capture
        }
    }

}

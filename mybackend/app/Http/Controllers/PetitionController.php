<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\File;
use App\Models\Petition;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File as FileFacade;
use App\Http\Controllers\Controller;


class PetitionController extends Controller
{
    public function index()
    {
        $petitions = Petition::with('file', "user","category")->where("status","accepted")->get();
        return response()->json($petitions, 200);
    }

    public function getCategories()
    {
        $categories = Category::all();
        return response()->json($categories, 200);
    }

    function show($id)
    {
        try {
            $petition = Petition::with('file', "user", "signers")->findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "no se ha podido encontrar la peticion"], 404);
        }
        return response()->json($petition);
    }

    function destroy($id)
    {
        try {

            $petition = Petition::findOrFail($id);


        } catch (\Exception $e) {
            return response()->json(["message" => "error", "no se ha podido encontrar la petición"], 400);
        }

        $this->authorize('delete', $petition);

        $petition->delete();
        return response()->json(["se ha eliminado la publicación $petition->name"], 200);
    }

    function update(Request $request, $id)
    {
        try {

            $request->validate([
                "title" => "max:255|",
                "description" => "max:255",
                "destinatary" => "max:255",
                "category" => "required|exists:categories,id",
                "signers" => "numeric|min:0",
                "status" => "required|in:accepted,pending","
                files" => "array",
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


    function store(Request $request)
    {
        try {
            $request->validate([
                "title" => "required|max:255|unique:petitions,title",
                "description" => "required",
                "destinatary" => "required",
                "category" => "required",
                "files"   => "nullable|array",
                "files.*" => "file|mimes:jpg,jpeg,png,webp",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "error",
                "la validación ha fallado, por favor, introduce correctamente los datos"
//                $e->getMessage()
            ], 400);
        }

        try {
            $user =
              Auth::user();
//                1;
            $categoryId = $request->category;
            $petition = Petition::create([
                "title" => $request->get("title"),
                "description" => $request->get("description"),
                "destinatary" => $request->get("destinatary"),
                "category_id" => $categoryId,
                "user_id" => $user->id,
//                "user_id" => $user,
                "signers" => 0,
                "status" => "pending"
            ]);
            if ($request->hasFile("files")) {

                $response = $this->fileUpload($request, $petition->id);
                if (!$response) {
                    return response()->json(["message" => 'error', 'No se pudo subir la imagen'], 400);
                }
            } else {
                // Esto es un caso raro, normalmente el validator ya impide que pase
//                return response()->json(['message' =>"error", 'Debes seleccionar una imagen'],400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => "error",
//                'se ha producido un error a la hora de crear la peticion'
                $e->getMessage()
            ],
                400);
        }
        return response()->json(["message" => "success", "se ha creado exitosamente la peticion"], 201);
    }
    private function fileUpload(Request $request, $id = null)
    {
        if (!$request->hasFile("files")) return false;

        $file     = $request->file("files")[0];
        $image    = time() . '.' . $file->extension();
        $path     = public_path('storage/assets/img/petitions');
        $pathName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $temp     = $file->getPathname();

        if (!copy($temp, $path . DIRECTORY_SEPARATOR . $image)) {
            return false;
        }

        $petition = Petition::findOrFail($id);
        $petition->file()->create([
            'name'        => $pathName,
            'file_path'   => $image,
            'petition_id' => $id
        ]);

        return true;
    }
    function sign($id)
    {

        try {
            $petition = Petition::findOrFail($id);
            $userId = Auth::id();
//            if (!$petition->userSigners->contains(Auth::id())) {
            $petition->signers()->attach($userId);
            $petition->signers = $petition->signers + 1;
//            } else {
//                $petition->userSigners()->detach($userId);
//                $petition->signers = $petition->signers - 1;
//            }
            $petition->save();
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
        return response()->json([
            'message' => 'se ha firmado la peticion'
        ], 200);
    }

    function listMine()
    {
        $user = Auth::id();
        try {
            $petitions = Petition::where("user_id", $user)->with("file","user")->get();
            return response()->json($petitions);
        } catch (\Exception $exception) {
            return response()->json(["ha habido un error a la hora de mostrar tus peticiones"], 500);
        }
    }

    function mysignatures()
    {
        $user = Auth::user();
        try {
            $petitions = $user->signedPetitions()->with("file","user")->get();
            return response()->json($petitions);
        } catch (\Exception $exception) {
            return response()->json(["ha habido un error a la hora de mostrar tus peticiones"], 500);
        }
    }

    function unsign($id)
    {

        try {
            $petition = Petition::findOrFail($id);
            $userId = Auth::id();
//            if (!$petition->userSigners->contains(Auth::id())) {
//                $petition->userSigners()->attach($userId);
//                $petition->signers = $petition->signers + 1;
//            } else {
            $petition->signers()->detach($userId);
            $petition->signers = $petition->signers - 1;
//            }
            $petition->save();
        } catch (\Exception $e) {
            return response()->json($e->getMessage(), 400);
        }
        return response()->json([
            'message' => 'se ha desfirmado la peticion'
        ], 200);
    }

}

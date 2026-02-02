<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\File;
use App\Models\Petition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File as FileFacade;

class PetitionController extends Controller
{
    public function index()
    {
        $count = Petition::all()->count();
        $petitions = Petition::paginate(10);
        return response()->json($petitions, 200);
    }

//    function cambiarEstado($id)
//    {
//        try {
//            $petition = Petition::findOrFail($id);
//            $petitionStatus = $petition->status;
//            switch ($petitionStatus) {
//                case "accepted":
//                    $petition->status = "pending";
//                    break;
//                case "pending":
//                    $petition->status = "accepted";
//                    break;
//            }
//            $petition->save();
//        } catch (\Exception $e) {
//            return response()->json(["message" => "error", "ha ocurrido un error"], 400);
//        }
//        return response()->json("se ha podido cambiar el estado",200);
//    }

    function show($id)
    {
        try {
            $petition = Petition::findOrFail($id);
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "no se ha podido encontrar la peticion"], 401);
        }
        return response()->json($petition);
    }

    function delete($id)
    {
        try {
            $name = Petition::findOrFail($id)->name;
            Petition::findOrFail($id)->delete();
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "no se ha podido encontrar la petición"], 400);
        }
        return response()->json("se ha eliminado la publicación $name", 200);
    }

//    function edit($id)
//    {
//        try {
//            $categories = Category::all();
//            $petition = Petition::findOrFail($id);
//        }catch (\Exception $e){
//            return response()->json(["message"=>"error","no se ha podido encontrar la peticion"],400);
//        }
//        return response()->json($petition);
//    }

    function update(Request $request, $id)
    {
        try {

            $request->validate([
                "title" => "max:255|nullable",
                "description" => "nullable|max:255",
                "destinatary" => "nullable|max:255",
                "category" => "required",
                "signers" => "numeric|min:0",
                "status" => "required|in:accepted,pending",
                "image" => "nullable|file|mimes:jpg,jpeg,png,webp"
            ]);
        } catch (\Exception $e) {
            return response()->json(["message" => "error", "la validación ha fallado, por favor, introduce correctamente los datos"], 400);
        }
        try {
            $petition = Petition::findOrFail($id);
            if (!is_null($request->title)) {
                $petition->title = strtolower($request->title);
            }
            if (!is_null($request->description)) {
                $petition->title = $request->description;
            }
            try {
                if (!is_null($request->image)) {
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
        try {
            $imagenOriginal = File::where("petition_id", $id)->first();
            $original = public_path("assets/img/petitions/" . $imagenOriginal->file_path);
            if (FileFacade::exists($original)) {
                FileFacade::delete($original);
            }
            $image = time() . '.' . $request->image->extension();
            $path = public_path('assets\img\petitions');
            $pathName = pathinfo($request->file("image")->getClientOriginalName(), PATHINFO_FILENAME);
            $temp = $request->file("image")->getPathname();
            if (!copy($temp, $path . DIRECTORY_SEPARATOR . $image)) {
                return false;
            }
            $petition = Petition::findOrFail($id);
            if ($imagenOriginal) {
                $imagenOriginal->update([
                    "name" => $pathName,
                    "file_path" => $image
                ]);
            } else {
                $petition->file()->create([
                    'name' => $pathName,
                    'file_path' => $image,
                    'petition_id' => $id
                ]);
                return true;
            }
        } catch (\Exception $e) {
            return response()->json(["message" => "error",
//                "ha ocurrido un error"
                $e
            ], 400);
        }
        return false;
    }

//    function create(Request $request)
//    {
//        $categories = Category::all();
//        return view("admin.petitions.create", compact("categories"));
//    }

    function store(Request $request)
    {
        try {
            $request->validate([
                "title" => "required|max:255|unique:petitions,title",
                "description" => "required",
                "destinatary" => "required",
                "category" => "required",
                "image" => "nullable|file|mimes:jpg,jpeg,png,webp"
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
//              Auth::user();
                1;
            $categoryId = $request->category;
            $petition = Petition::create([
                "title" => $request->get("title"),
                "description" => $request->get("description"),
                "destinatary" => $request->get("destinatary"),
                "category_id" => $categoryId,
//                "user_id" => $user->id,
                "user_id" => $user,
                "signers" => 0,
                "status" => "pending"
            ]);
            if ($request->hasFile("image")) {

                $response = $this->fileUpload($request, $petition->id);
                if (!$response) {
                    return response()->json(["message" => 'error', 'No se pudo subir la imagen'], 400);
                }
            } else {
                // Esto es un caso raro, normalmente el validator ya impide que pase
//                return response()->json(['message' =>"error", 'Debes seleccionar una imagen'],400);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => "error", 'se ha producido un error a la hora de crear la peticion'], 400);
        }
        return response()->json(["message" => "success", "se ha creado exitosamente la peticion"], 201);
    }

//    function search(Request $request)
//    {
//        $petitions = Petition::where("title", "like", "%$request->title%")
//            ->orWhere("description", "like", "%$request->title%")
//            ->paginate(10);
//        $count = Petition::where("title", "like", "%$request->title%")
//            ->orWhere("description", "like", "%$request->title%")
//            ->count();
//        return view("admin.home", compact("count", "petitions"));
//    }


    private function fileUpload(Request $request, $id = null)
    {
        $image = null;
        if ($request->hasFile("image")) {
            $image = time() . '.' . $request->image->extension();
            $path = public_path('assets\img\petitions');
            $pathName = pathinfo($request->file("image")->getClientOriginalName(), PATHINFO_FILENAME);
            $temp = $request->file("image")->getPathname();
            if (!copy($temp, $path . DIRECTORY_SEPARATOR . $image)) {
                return false; // Error al copiar
            }

            // Asociar archivo a la petición
            $petition = Petition::findOrFail($id);
            $petition->file()->create([
                'name' => $pathName,
                'file_path' => $image,
                'petition_id' => $id
            ]);
            return true;
        }
        return false;
    }
}

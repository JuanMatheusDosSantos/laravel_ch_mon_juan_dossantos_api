<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');
//Route::group([
//    'middleware' => 'api',
//    'prefix' => 'auth',
//], function () {
//    Route::post('register', [AuthController::class, 'register']);
//    Route::post('login', [AuthController::class, 'login']);
//    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
//    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
//    Route::get('userProfile', [AuthController::class, 'userProfile'])->middleware('auth:api');
//});

//Route::post('login', [AuthController::class, 'login']);
//Route::post('register', [AuthController::class, 'register']);
//Route::middleware('auth:api')->group(function () {
//    Route::post('logout', [AuthController::class, 'logout']);
//    Route::post('refresh', [AuthController::class, 'refresh']);
//    Route::get('me', [AuthController::class, 'me']);
//});
//
//Route::controller(PetitionController::class)->group(function () {
//    Route::get("petitions/index", "index");
//    Route::get("petitions/category/{id}", "filterByCategory");
//    Route::get("mypetitions", "listMine");
//    Route::get("petitions", "signedPetitions");
//
//    Route::get("petition/{id}", "show");
//    Route::post("petition", "store");
//    Route::get("petitions/add", "create");
//    Route::get('petition/edit/{id}', 'edit');
//    Route::delete("petition/{id}", "delete");
//    Route::put('petition/{id}', 'update');
//    Route::post('petition/sign/{id}', 'sign');
//});
//// Rutas Públicas (Login y Registro)
//Route::post('login', [AuthController::class, 'login']);
//Route::post('register', [AuthController::class, 'register']);
//// Rutas Protegidas (Requieren Token válido)
//// CAMBIO IMPORTANTE: Cambia 'middleware('api')' por 'middleware('auth:api')'
//Route::middleware('auth:api')->group(function () {
//    Route::post('logout', [AuthController::class, 'logout']);
//    Route::get('me', [AuthController::class, 'me']);
//});
// Ruta de Refresh (Fuera del auth:api estricto)
// Laravel intentará leer el token del header, y si es válido (aunque expirado), lo refrescará.
//Route::middleware('api')->post('refresh', [AuthController::class, 'refresh']);
// Auth (Públicas)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Peticiones Públicas
Route::get('/petitions', [PetitionController::class, 'index']);
Route::get('/petitions/{id}', [PetitionController::class, 'show']);
// Rutas Protegidas (Requieren Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Si implementas refresh
    Route::post('/petition', [PetitionController::class, 'store']);
// IMPORTANTE: Update usa POST con _method por el tema de ficheros
    Route::put('/petitions/{id}', [PetitionController::class, 'update']);
    Route::delete('/petitions/{id}', [PetitionController::class, 'destroy']);
    Route::post('/petitions/firmar/{id}', [PetitionController::class, "sign"]);
});

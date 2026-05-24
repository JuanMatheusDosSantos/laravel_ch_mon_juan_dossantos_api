<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminUsersController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Peticiones Públicas
Route::get('/petitions', [PetitionController::class, 'index']);
Route::get('/petitions/categories', [PetitionController::class, 'getCategories']);
// Rutas Protegidas (Requieren Token)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Si implementas refresh
    Route::post('/petitions/petition', [PetitionController::class, 'store']);
// IMPORTANTE: Update usa POST con _method por el tema de ficheros
//    Route::get('/petitions/categories', [PetitionController::class, 'getCategories']);
    Route::get("/petitions/mypetitions", [PetitionController::class, "listMine"]);
    Route::get("/petitions/mysignatures", [PetitionController::class, "mysignatures"]);
    Route::post('/petitions/{id}', [PetitionController::class, 'update']);
    Route::delete('/petitions/{id}', [PetitionController::class, 'destroy']);
    Route::post('/petitions/firmar/{id}', [PetitionController::class, "sign"]);
    Route::post('/petitions/desfirmar/{id}', [PetitionController::class, "unsign"]);
});

// RUTAS DE ADMINISTRADOR
Route::middleware(['auth:api', 'is_admin'])->prefix('admin')->group(function () {
//ATENCIÓN: TAMBIÉN SE PODRÍA PONER EN LUGAR DE 'auth:api', 'jwt:auth' porque estamos
    //haciendo la seguridad con ese middleware o incluso 'auth:sanctum', que es también la forma por
//defecto de Laravel de hacer ese control de seguridad.
// Listar todas las peticiones
    Route::get('/petitions', [AdminController::class, 'index']);
// Eliminar una petición
    Route::delete('/petitions/{id}', [AdminController::class, 'destroy']);

    Route::put('petitions/estado/{id}', [AdminController::class,'cambiarEstado']);

    Route::put('petitions/edit/{id}', [AdminController::class,'update']);

    Route::get('/users', [AdminUsersController::class, 'getUsers']);
    Route::get('/users/{id}', [AdminUsersController::class, 'showUser']);
    Route::put('/users/{id}', [AdminUsersController::class, 'updateUser']);
    Route::put('/users/role/{id}', [AdminUsersController::class, 'roleUser']);
    Route::delete('/users/{id}', [AdminUsersController::class, 'destroyUser']);

});

Route::get('/petitions/{id}', [PetitionController::class, 'show']);

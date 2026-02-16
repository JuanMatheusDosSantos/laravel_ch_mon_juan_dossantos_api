<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PetitionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
// Peticiones Públicas
Route::get('/petitions', [PetitionController::class, 'index']);
Route::get('/petitions/categories', [PetitionController::class, 'getCategories']);
Route::get('/petitions/{id}', [PetitionController::class, 'show']);
// Rutas Protegidas (Requieren Token)
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Si implementas refresh
    Route::post('/petitions/petition', [PetitionController::class, 'store']);
// IMPORTANTE: Update usa POST con _method por el tema de ficheros
//    Route::get('/petitions/categories', [PetitionController::class, 'getCategories']);
    Route::put('/petitions/{id}', [PetitionController::class, 'update']);
    Route::delete('/petitions/{id}', [PetitionController::class, 'destroy']);
    Route::post('/petitions/firmar/{id}', [PetitionController::class, "sign"]);
});

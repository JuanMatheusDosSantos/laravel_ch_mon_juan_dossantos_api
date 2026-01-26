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

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);
Route::middleware('auth:api')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::get('me', [AuthController::class, 'me']);
});

Route::controller(PetitionController::class)->group(function () {
    Route::get("petitions/index", "index");
    Route::get("petitions/category/{id}", "filterByCategory");
    Route::get("mypetitions", "listMine");
    Route::get("petitions", "signedPetitions");

    Route::get("petition/{id}", "show");
    Route::post("petition", "store");
    Route::get("petitions/add", "create");
    Route::get('petition/edit/{id}', 'edit');
    Route::delete("petition/{id}", "delete");
    Route::put('petition/{id}', 'update');
    Route::post('petition/sign/{id}', 'sign');
});

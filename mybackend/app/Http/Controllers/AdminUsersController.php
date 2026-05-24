<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUsersController extends Controller
{
    public function getUsers()
    {
        $users = User::withCount(['petitions', 'signedPetitions'])->get();
        return response()->json(['data' => $users]);
    }

    public function showUser($id)
    {
        $user = User::withCount(['petitions', 'signedPetitions'])->findOrFail($id);
        return response()->json(['data' => $user]);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id, // Permite guardar su propio email
            'role' => 'required|in:user,admin', // Solo estos dos roles
            'password' => 'nullable|min:6' // Opcional
        ]);
        $user->name = $request->name;
        $user->email = $request->email;
        $user->role = $request->role;
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();
        return response()->json(['message' => 'Usuario actualizado correctamente', 'data' =>
            $user]);
    }

    public function destroyUser($id)
    {
        $user = User::with(['petitions', 'signedPetitions'])->findOrFail($id);

        if ($user->petitions->count() > 0 || $user->signedPetitions->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: El usuario tiene peticiones creadas o firmas activas.'
            ], 403);
        }
        $user->delete();
        return response()->json(['success' => true, 'message' => 'Usuario eliminado correctamente']);
    }
    public function roleUser($id)
    {
        try{
            $user = User::withCount(['petitions', 'signedPetitions'])->findOrFail($id);
            $user->role = $user->role === 'admin' ? 'user' : 'admin';
            $user->save();
        }catch (\Exception $e){
            return response()->json([$e->getMessage()],400);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUsersController extends Controller
{
    public function getUsers()
    {
// Traemos los usuarios y contamos sus peticiones y firmas para mostrarlo en la tabla
        $users = User::withCount(['petitions', 'signedPetitions'])->get();
        return response()->json(['data' => $users]);
    }

// 2. Ver un usuario concreto
    public function showUser($id)
    {
        $user = User::withCount(['petitions', 'signedPetitions'])->findOrFail($id);
        return response()->json(['data' => $user]);
    }

// 3. Editar usuario (Nombre, Email, Rol y Contraseña opcional)
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
// Magia: Si el admin escribió algo en contraseña, la encriptamos y la cambiamos
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password);
        }
        $user->save();
        return response()->json(['message' => 'Usuario actualizado correctamente', 'data' =>
            $user]);
    }

// 4. Borrar usuario (CON PROTECCIÓN)
    public function destroyUser($id)
    {
        $user = User::withCount(['petitions', 'signedPetitions'])->findOrFail($id);
// Aplicamos tu regla de negocio
        if (count($user->petitions) > 0 || count($user->signers) > 0) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar: El usuario tiene peticiones creadas o firmas activas.'
            ], 403); // 403 Forbidden o 422 Unprocessable Entity
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

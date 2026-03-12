<?php
//
namespace App\Http\Controllers;
//
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Login y generación del token JWT
     */
    public function login(Request $request){
        $validator = Validator::make($request->all(),[
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $token = auth('api')->attempt($request->only('email', 'password'));

        if (!$token){
            return response()->json([
                'error' => 'Unauthorized. Either email or password is wrong.'
            ], 401);
        }

        $user = Auth::user();

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => $user,
            'expires_in' => env('JWT_TTL') * 60,
        ]);
    }

    /**
     * Registro de usuario (NO login automático)
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);
        $data['password'] = Hash::make($data['password']);
        $user = User::create($data);
        return response()->json([
            'message' => 'Usuario registrado correctamente',

            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    /**
     * Usuario autenticado
     */
    public function me()
    {
        return response()->json(Auth::user());
    }

    /**
     * Logout (invalida el token)
     */
    public function logout()
    {
        Auth::logout();
        return response()->json([
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    /**
     * Refrescar token
     */
    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh());
    }

    /**
     * Respuesta estándar con token
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
            // AÑADE ESTO:
            'user' => Auth::user()
        ]);
    }

}

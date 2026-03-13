<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function authentication(Request $request)
    {
        $credentials = [
            'cpf' => $request->cpf,
            'password' => $request->password,
        ];

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            return response()->json($user);
        } else {
            return response()->json(['message' => 'Usuário não encontrado'], 401);
        }
    }
}

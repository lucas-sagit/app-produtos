<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class userController extends Controller
{
    public function authentication(Request $request)
    {
     $User  = User::where('cpf', $request->cpf)->first();

     if(!$User || !Hash::check($request->getPassword, $User->password)){
        return response()->json([
            'message' => 'usuário ou senha inválidos'
        ], 401);
     }
     return response()->json($User);
    }
}


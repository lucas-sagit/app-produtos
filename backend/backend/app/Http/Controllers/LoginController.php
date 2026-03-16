<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class LoginController extends Controller
{
    public function authentication(Request $request)
    {
        $credentials = $request->only('cpf', 'password');

        // Explicitly resolve the User model to guarantee HasApiTokens is available.
        $user = User::where('cpf', $credentials['cpf'] ?? null)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Não autorizado'
            ], 401);
        }

        $plainPassword = $credentials['password'] ?? '';
        $storedPassword = $user->password ?? '';

        // If the stored password is plain text (legacy data), allow login and upgrade it.
        $looksLikeBcrypt = str_starts_with($storedPassword, '$2y$') || str_starts_with($storedPassword, '$2b$');
        if ($looksLikeBcrypt) {
            if (!Hash::check($plainPassword, $storedPassword)) {
                return response()->json([
                    'message' => 'Não autorizado'
                ], 401);
            }
        } else {
            if ($plainPassword !== $storedPassword) {
                return response()->json([
                    'message' => 'Não autorizado'
                ], 401);
            }

            // Upgrade to a hashed password after a successful legacy login.
            $user->password = Hash::make($plainPassword);
            $user->save();
        }

        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(RegisterRequest $request){
        $user=User::create($request->validated());
        $token=$user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message'=>'User registered successfully',
            'access_token'=>$token,
            'user'=>$user,
        ],201);
    }
public function login(LoginRequest $request)
{
    $credentials = $request->only('email', 'password');

    if (!Auth::attempt($credentials)) {
        return response()->json([
            'message' => 'Invalid credentials'
        ], 401);
    }

    $user = $request->user();

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'User logged in successfully',
        'access_token' => $token,
        'user' => $user,
    ], 200);
}
public function Logout(Request $request){
    $request->user()->currentAccessToken()->delete();
    return response()->json([
        'message'=>'User logged out successfully'
    ],200);
}
}


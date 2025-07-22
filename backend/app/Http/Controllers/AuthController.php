<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Helpers\ResponseHelper;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:employer,candidate',
            'company_name' => 'nullable|string|required_if:role,employer',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
            'role'     => $request->role,
            'company_name' => $request->company_name,
        ]);

        $token = JWTAuth::fromUser($user);

        return ResponseHelper::success(
            ['user' => $user, 'token' => $token],
            'User registered successfully',
            201
        );
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return ResponseHelper::error('Invalid credentials', [], 401);
        }

        return ResponseHelper::success(['token' => $token], 'Login successful');
    }

    public function logout()
    {
        auth()->logout();
        return ResponseHelper::success([], 'Logged out successfully');
    }

    public function me()
    {
        return ResponseHelper::success(auth()->user(), 'User data fetched');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Get the current authenticated user's info.
     */
    public function show(Request $request)
    {
        $user = $request->user()->load(['candidateProfile', 'employerProfile']);

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Update name, phone, and optionally password.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:30',
            'password'              => 'nullable|string|min:8|confirmed',
            'password_confirmation' => 'nullable|string',
        ]);

        $updateData = [
            'name'  => $data['name'],
            'phone' => $data['phone'] ?? $user->phone,
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * Upload / update avatar photo.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:3072',
        ]);

        $user = $request->user();

        // Delete old avatar file if it exists
        if ($user->avatar) {
            \Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->update(['avatar' => $path]);

        return response()->json([
            'message'    => 'Avatar uploaded successfully',
            'avatar_url' => asset('storage/' . $path),
            'avatar'     => $path,
            'user'       => $user->fresh(),
        ]);
    }
}

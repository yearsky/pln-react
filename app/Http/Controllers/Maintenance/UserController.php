<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('maintenance/user', [
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'user_roles' => 'required|string|in:admin,user,vendor',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'user_roles' => $validated['user_roles'],
        ]);

        return redirect()->route('maintenance.user')->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id, // Pastikan email unik, kecuali untuk user ini
            'user_roles' => 'required|string|in:admin,user,vendor',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'user_roles' => $validated['user_roles'],
        ]);

        return redirect()->route('maintenance.user')->with('success', 'User updated successfully.');
    }

    public function destroy(Request $request, User $user)
    {
        // Validasi input konfirmasi
        $request->validate([
            'confirmation' => ['required', 'string', function ($attribute, $value, $fail) {
                if (strtolower($value) !== 'delete') {
                    $fail("The confirmation must be 'delete'.");
                }
            }],
        ]);

        $user->delete();

        return redirect()->route('maintenance.user')->with('success', 'User deleted successfully.');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of users grouped by roles.
     */
    public function index(): JsonResponse
    {
        try {
            $roles = Role::with(['users' => function ($query) {
                $query->select('users.id', 'users.full_name', 'users.email', 'users.created_at');
            }])->get();

            $usersByRole = $roles->map(function ($role) {
                return [
                    'role' => $role->name,
                    'users' => $role->users->map(function ($user) {
                        return [
                            'id' => $user->id,
                            'full_name' => $user->full_name,
                            'email' => $user->email,
                            'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                        ];
                    })
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $usersByRole
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created user with roles.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validatedData = $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|max:255',
                'roles' => 'required|array|min:1',
                'roles.*' => 'exists:roles,id'
            ]);

            DB::beginTransaction();

            // Create the user
            $user = User::create([
                'full_name' => $validatedData['full_name'],
                'email' => $validatedData['email'],
            ]);

            // Attach roles to user
            $user->roles()->attach($validatedData['roles']);

            // Load the user with roles for response
            $user->load('roles:id,name');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User created successfully',
                'data' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'created_at' => $user->created_at->format('Y-m-d H:i:s')
                ]
            ], 201);

        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::with('roles:id,name')->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'created_at' => $user->created_at->format('Y-m-d H:i:s')
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'User not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            $validatedData = $request->validate([
                'full_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255|unique:users,email,' . $id,
                'roles' => 'sometimes|required|array|min:1',
                'roles.*' => 'exists:roles,id'
            ]);

            DB::beginTransaction();

            // Update user basic info
            $user->update([
                'full_name' => $validatedData['full_name'] ?? $user->full_name,
                'email' => $validatedData['email'] ?? $user->email,
            ]);

            // Update roles if provided
            if (isset($validatedData['roles'])) {
                $user->roles()->sync($validatedData['roles']);
            }

            $user->load('roles:id,name');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User updated successfully',
                'data' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'updated_at' => $user->updated_at->format('Y-m-d H:i:s')
                ]
            ]);

        } catch (ValidationException $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);
            
            DB::beginTransaction();
            
            // Delete user (roles will be automatically detached due to cascade)
            $user->delete();
            
            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

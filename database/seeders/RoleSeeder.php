<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['name' => 'Author', 'description' => 'Content author role'],
            ['name' => 'Editor', 'description' => 'Content editor role'],
            ['name' => 'Subscriber', 'description' => 'Basic subscriber role'],
            ['name' => 'Administrator', 'description' => 'Administrator role'],
        ];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role['name']], $role);
        }
    }
}

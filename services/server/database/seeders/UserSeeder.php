<?php

namespace Database\Seeders;

use App\Models\User;

use Illuminate\Database\Seeder;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'uuid' => Str::uuid(),
            'email' => 'leasy.helpdesk@gmail.com',
            'full_name' => 'Ofir Goldberg',
            'password' => Hash::make('Aa123!@#'),
        ]);
    }
}

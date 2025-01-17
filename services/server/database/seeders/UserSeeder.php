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
            'email' => 'ofirgoldofir@gmail.com',
            'full_name' => 'Ofir Goldberg',
            'phone_number' => '052-7576444',
            'password' => Hash::make('Aa123!@#'),
        ]);
    }
}

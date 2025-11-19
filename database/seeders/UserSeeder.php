<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\File;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Read CSV file
        $csvPath = base_path('user.csv');

        if (!File::exists($csvPath)) {
            $this->command->error('File user.csv tidak ditemukan!');
            return;
        }

        $file = fopen($csvPath, 'r');

        // Skip header row
        $header = fgetcsv($file);

        // Process each row
        while (($row = fgetcsv($file)) !== false) {
            $name = $row[0];
            $email = $row[1];
            $password = $row[2];
            $jabatan = $row[3];
            $ul_up = $row[4];
            $ui_up = $row[5];

            // Skip rows without email (only ADMIN has email in your CSV)
            // For others, we'll generate email from password (username)
            if (empty($email) && !empty($password)) {
                $email = $password . '@pln.co.id';
            }

            if (!empty($email)) {
                User::updateOrCreate(
                    ['email' => $email],
                    [
                        'name' => $name,
                        'password' => Hash::make($password),
                        'jabatan' => $jabatan,
                        'ul_up' => $ul_up,
                        'ui_up' => $ui_up,
                    ]
                );
            }
        }

        fclose($file);

        $this->command->info('Users berhasil di-import dari user.csv!');
    }
}

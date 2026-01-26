<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement("SET FOREIGN_KEY_CHECKS=0;");
        DB::table("users")->truncate();
        DB::statement("ALTER TABLE users AUTO_INCREMENT = 1;");

        DB::table("users")->insert([
            [
                "id" => 1,
                "name" => "admin",
                "email" => "admin@gmail.com",
                "password" => bcrypt("12345678"),
                "role_id" => true,
                "created_at" => "2025-11-03 10:15:00",
                "updated_at" => "2025-11-03 10:15:00",
            ],
            [
                "id" => 2,
                "name" => "prueba",
                "email" => "prueba@prueba.com",
                "password" => bcrypt("12345678"),
                "role_id" => false,
                "created_at" => "2025-11-15 14:42:00",
                "updated_at" => "2025-11-15 14:42:00",
            ],
            [
                "id" => 3,
                "name" => "Cristina",
                "email" => "profe@gmail.com",
                "password" => bcrypt("12345678"),
                "role_id" => false,
                "created_at" => "2025-11-28 09:30:00",
                "updated_at" => "2025-11-28 09:30:00",
            ],
            [
                "id" => 4,
                "name" => "Cristian",
                "email" => "cristian@gmail.com",
                "password" => bcrypt("12345678"),
                "role_id" => false,
                "created_at" => "2025-12-05 16:12:00",
                "updated_at" => "2025-12-05 16:12:00",
            ],
            [
                "id" => 5,
                "name" => "Juan",
                "email" => "juan@gmail.com",
                "password" => bcrypt("12345678"),
                "role_id" => false,
                "created_at" => "2025-12-12 11:55:00",
                "updated_at" => "2025-12-12 11:55:00",
            ],
            [
                "id" => 6,
                "name" => "Laura",
                "email" => "laura@gmail.com",
                "password" => bcrypt("12345678"),
                "role_id" => false,
                "created_at" => "2025-12-20 18:27:00",
                "updated_at" => "2025-12-20 18:27:00",
            ]
        ]);


        DB::statement("SET FOREIGN_KEY_CHECKS=1;");
    }
}

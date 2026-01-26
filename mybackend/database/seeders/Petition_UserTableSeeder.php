<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class Petition_UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::statement("set foreign_key_checks=0;");
        DB::table("petition_user")->truncate();
        DB::statement("ALTER TABLE petition_user AUTO_INCREMENT = 1;");
        DB::table("petition_user")->insert([

            ["petition_id" => 1, "user_id" => 1],
            ["petition_id" => 2, "user_id" => 2],
            ["petition_id" => 3, "user_id" => 3],

            // Peticiones de Tecnología
            ["petition_id" => 4, "user_id" => 1],
            ["petition_id" => 5, "user_id" => 2],
            ["petition_id" => 6, "user_id" => 4],

            // Peticiones de Deportes
            ["petition_id" => 7, "user_id" => 2],
            ["petition_id" => 8, "user_id" => 5],

            // Peticiones de Música
            ["petition_id" => 9, "user_id" => 3],
            ["petition_id" => 10, "user_id" => 6],

            // Peticiones de Cine
            ["petition_id" => 11, "user_id" => 1],
            ["petition_id" => 12, "user_id" => 4],

            // Peticiones de Viajes
            ["petition_id" => 13, "user_id" => 5],
            ["petition_id" => 14, "user_id" => 6],
        ]);
        DB::statement("set foreign_key_checks=1");

    }
}

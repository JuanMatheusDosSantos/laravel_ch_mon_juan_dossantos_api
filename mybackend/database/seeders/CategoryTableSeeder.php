<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoryTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement("set foreign_key_checks=0;");
        DB::table("categories")->truncate();
        DB::statement("ALTER TABLE categories AUTO_INCREMENT = 1;");
        DB::table("categories")->insert([
            [
                "id" => 1,
                "name" => "Animales",
                "description" => "Categoría de animales"
            ],
            [
                "id" => 2,
                "name" => "Tecnología",
                "description" => "Categoría de tecnología"
            ],
            [
                "id" => 3,
                "name" => "Deportes",
                "description" => "Categoría de deportes"
            ],
            [
                "id" => 4,
                "name" => "Música",
                "description" => "Categoría de música"
            ],
            [
                "id" => 5,
                "name" => "Cine",
                "description" => "Categoría de cine"
            ],
            [
                "id" => 6,
                "name" => "Viajes",
                "description" => "Categoría de viajes"
            ]
        ]);
        DB::statement("set foreign_key_checks=1");
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FileTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement("set foreign_key_checks=0;");
        DB::table("files")->truncate();
        DB::statement("ALTER TABLE files AUTO_INCREMENT = 1;");

        DB::table("files")->insert([
            ["id" => 1,
                "name" => "tabibito",
                "file_path" => "tabibito.jpg",
                "petition_id" => 1],
            ["id" => 2,
                "name" => "tabibito",
                "file_path" => "1764591351.jpg",
                "petition_id" => 2],
            ["id" => 3,
                "name" => "piopio",
                "file_path" => "piopio.jpg",
                "petition_id" => 3],// Archivos para Peticiones de Tecnología (Categoría 2)
            [
                "id" => 4,
                "name" => "conectividad_rural",
                "file_path" => "rural-internet.jpg",
                "petition_id" => 4
            ],
            [
                "id" => 5,
                "name" => "cursos_programacion",
                "file_path" => "coding-class.jpg",
                "petition_id" => 5
            ],
            [
                "id" => 6,
                "name" => "robotica_escuela",
                "file_path" => "robotics-kids.jpg",
                "petition_id" => 6
            ],

            // Archivos para Peticiones de Deportes (Categoría 3)
            [
                "id" => 7,
                "name" => "canchas_deporte",
                "file_path" => "sport-courts.jpg",
                "petition_id" => 7
            ],
            [
                "id" => 8,
                "name" => "clases_futbol",
                "file_path" => "free-football.jpg",
                "petition_id" => 8
            ],

            // Archivos para Peticiones de Música (Categoría 4)
            [
                "id" => 9,
                "name" => "festival_local",
                "file_path" => "local-festival.jpg",
                "petition_id" => 9
            ],
            [
                "id" => 10,
                "name" => "musica_gratis",
                "file_path" => "free-music.jpg",
                "petition_id" => 10
            ],

            // Archivos para Peticiones de Cine (Categoría 5)
            [
                "id" => 11,
                "name" => "cine_gratuito",
                "file_path" => "outdoor-cinema.jpg",
                "petition_id" => 11
            ],
            [
                "id" => 12,
                "name" => "taller_cine",
                "file_path" => "film-workshop.jpg",
                "petition_id" => 12
            ],

            // Archivos para Peticiones de Viajes (Categoría 6)
            [
                "id" => 13,
                "name" => "rutas_turisticas",
                "file_path" => "tourist-route.jpg",
                "petition_id" => 13
            ],
            [
                "id" => 14,
                "name" => "guia_viajes",
                "file_path" => "travel-guide.jpg",
                "petition_id" => 14
            ],
        ]);
        DB::statement("set foreign_key_checks=1");
    }
}

<?php

namespace Database\Seeders;

use App\Models\Petition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PetitionsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        DB::statement("set foreign_key_checks=0;");
        DB::table("petitions")->truncate();
        DB::statement("ALTER TABLE petitions AUTO_INCREMENT = 1;");
        DB::table("petitions")->insert([
            // Peticiones Animales
            [
                "id" => 1,
                "title" => "Perros navideños",
                "description" => "¡Es navidad! ¿Por qué no le ponemos gorro a los perros?",
                "destinatary" => "Ayuntamiento",
                "status" => "accepted",
                "user_id" => 1,
                "signers" => 0,
                "category_id" => 1
            ],
            [
                "id" => 2,
                "title" => "Han llegado los perros navideños!",
                "description" => "Mira que monos son",
                "destinatary" => "Vecinos",
                "status" => "accepted",
                "user_id" => 2,
                "signers" => 0,
                "category_id" => 1
            ],
            [
                "id" => 3,
                "title" => "Protejamos a los pájaros en invierno",
                "description" => "Queremos que los refugios locales cuiden a las aves durante la temporada fría",
                "destinatary" => "Refugio de aves local",
                "status" => "accepted",
                "user_id" => 3,
                "signers" => 0,
                "category_id" => 1
            ],

// Peticiones Tecnología
            [
                "id" => 4,
                "title" => "Internet rápido para zonas rurales",
                "description" => "Solicitamos al gobierno mejorar la conectividad en áreas remotas",
                "destinatary" => "Ministerio de Tecnología",
                "status" => "accepted",
                "user_id" => 1,
                "signers" => 0,
                "category_id" => 2
            ],
            [
                "id" => 5,
                "title" => "Cursos de programación accesibles",
                "description" => "Queremos que todos los jóvenes tengan acceso a cursos gratuitos de programación",
                "destinatary" => "Escuelas locales de tecnología",
                "status" => "accepted",
                "user_id" => 2,
                "signers" => 0,
                "category_id" => 2
            ],
            [
                "id" => 6,
                "title" => "Más talleres de robótica escolar",
                "description" => "Solicitamos fomentar la robótica en las escuelas para niños y jóvenes",
                "destinatary" => "Gobierno local",
                "status" => "accepted",
                "user_id" => 4,
                "signers" => 0,
                "category_id" => 2
            ],

// Peticiones Deportes
            [
                "id" => 7,
                "title" => "Construcción de nuevas canchas deportivas",
                "description" => "Queremos más espacios para practicar deporte en la ciudad",
                "destinatary" => "Ayuntamiento local",
                "status" => "accepted",
                "user_id" => 2,
                "signers" => 0,
                "category_id" => 3
            ],
            [
                "id" => 8,
                "title" => "Clases gratuitas de fútbol para todos",
                "description" => "Queremos que los niños y jóvenes puedan aprender fútbol sin coste",
                "destinatary" => "Club deportivo local",
                "status" => "accepted",
                "user_id" => 5,
                "signers" => 0,
                "category_id" => 3
            ],

// Peticiones Música
            [
                "id" => 9,
                "title" => "Festival de música local",
                "description" => "Apoyemos a los artistas locales con un festival gratuito",
                "destinatary" => "Concejo Cultural",
                "status" => "accepted",
                "user_id" => 3,
                "signers" => 0,
                "category_id" => 4
            ],
            [
                "id" => 10,
                "title" => "Clases de música gratuitas para la comunidad",
                "description" => "Queremos que todos tengan acceso a aprender música sin coste",
                "destinatary" => "Escuelas de música locales",
                "status" => "accepted",
                "user_id" => 6,
                "signers" => 0,
                "category_id" => 4
            ],

// Peticiones Cine
            [
                "id" => 11,
                "title" => "Proyecciones de cine gratuitas",
                "description" => "Solicitamos cine abierto para todos los vecinos",
                "destinatary" => "Biblioteca local",
                "status" => "accepted",
                "user_id" => 1,
                "signers" => 0,
                "category_id" => 5
            ],
            [
                "id" => 12,
                "title" => "Taller de cine para jóvenes",
                "description" => "Queremos enseñar a jóvenes a hacer cortometrajes y documentales",
                "destinatary" => "Centro cultural local",
                "status" => "accepted",
                "user_id" => 4,
                "signers" => 0,
                "category_id" => 5
            ],

// Peticiones Viajes
            [
                "id" => 13,
                "title" => "Promoción de rutas turísticas locales",
                "description" => "Solicitamos mejorar la información y señalización para turistas",
                "destinatary" => "Oficina de turismo local",
                "status" => "accepted",
                "user_id" => 5,
                "signers" => 0,
                "category_id" => 6
            ],
            [
                "id" => 14,
                "title" => "Guías de viaje gratuitas",
                "description" => "Queremos facilitar información de turismo local a todos",
                "destinatary" => "Gobierno local",
                "status" => "accepted",
                "user_id" => 6,
                "signers" => 0,
                "category_id" => 6
            ],
        ]);

        DB::statement("set foreign_key_checks=1");
    }
}

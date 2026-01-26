<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('petition_user', function (Blueprint $table) {
            //$table->id();
            $table->primary(["user_id", "petition_id"]);
            $table->bigInteger("petition_id")->unsigned();
            $table->bigInteger("user_id")->unsigned();
            $table->timestamps();
            $table->foreign("petition_id")
                ->references("id")
                ->on("petitions")
                ->onDelete("cascade");
            $table->foreign("user_id")
                ->references("id")
                ->on("users")
                ->onDelete("cascade");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('petition_user');
    }
};

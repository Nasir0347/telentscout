<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('candidate_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('headline')->nullable();
            $table->text('bio')->nullable();
            $table->string('resume_path')->nullable();
            $table->json('skills')->nullable(); // stored as JSON array
            $table->json('experience')->nullable(); // stored as JSON
            $table->json('education')->nullable(); // stored as JSON
            $table->string('phone')->nullable();
            $table->string('city')->nullable();
            $table->integer('profile_completeness')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidate_profiles');
    }
};

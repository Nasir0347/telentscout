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
        Schema::create('job_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Recruiter ID
            $table->string('title');
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->string('location')->nullable();
            $table->string('salary_range')->nullable();
            $table->string('job_type')->default('Full-time'); // Full-time, Part-time, Contract
            $table->enum('status', ['open', 'closed'])->default('open');
            $table->json('required_skills')->nullable();
            $table->string('experience_level')->nullable(); // Junior, Mid, Senior
            $table->timestamp('deadline')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};

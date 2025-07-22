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
            $table->foreignId('employer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->longText('description');
            $table->foreignId('category_id')->constrained('job_categories')->onDelete('restrict');
            $table->foreignId('type_id')->constrained('job_types')->onDelete('restrict');
            $table->foreignId('location_id')->constrained('job_locations')->onDelete('restrict');
            $table->foreignId('location_type_id')->constrained('job_location_types')->onDelete('restrict');
            $table->boolean('status')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_posts');
    }
};

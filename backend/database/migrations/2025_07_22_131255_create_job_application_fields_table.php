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
        Schema::create('job_application_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained('job_posts')->onDelete('cascade');
            $table->string('field_name');
            $table->text('field_description')->nullable();
            $table->enum('field_type', ['text', 'textarea', 'number', 'date', 'file', 'select']);
            $table->boolean('is_required')->default(false);
            $table->boolean('status')->default(true);
            $table->integer('order')->default(0);
            $table->json('options')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_application_fields');
    }
};

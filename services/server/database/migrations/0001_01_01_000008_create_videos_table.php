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
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->uuid();

            $table->string('video_path')->unique();
            $table->string('video_url')->unique();
            $table->string('video_name')->unique();
            $table->string('video_mime_type');
            $table->integer('video_duration');

            $table->string('preview_image_path')->unique();
            $table->string('preview_image_url')->unique();
            $table->string('preview_image_name')->unique();
            $table->string('preview_image_mime_type');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};

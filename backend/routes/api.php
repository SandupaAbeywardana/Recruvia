<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobPostController;
use App\Http\Controllers\JobMetaController;
use App\Http\Controllers\JobApplicationController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    // User routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Job Post routes
    Route::get('/jobs', [JobPostController::class, 'index']);
    Route::get('/jobs/my', [JobPostController::class, 'myJobs']);
    Route::post('/jobs', [JobPostController::class, 'store']);
    Route::put('/jobs/{id}', [JobPostController::class, 'update']);
    Route::delete('/jobs/{id}', [JobPostController::class, 'destroy']);
    Route::get('/jobs/search', [JobPostController::class, 'search']);
    Route::get('/jobs/{id}', [JobPostController::class, 'show']);
    Route::put('/jobs/{id}/status/{status}', [JobPostController::class, 'updateStatus']);

    // Job Category routes
    Route::get('/job-categories', [JobMetaController::class, 'categories']);
    Route::post('/job-categories', [JobMetaController::class, 'storeCategory']);
    Route::delete('/job-categories/{id}', [JobMetaController::class, 'deleteCategory']);

    // Job Location routes
    Route::get('/job-locations', [JobMetaController::class, 'locations']);
    Route::post('/job-locations', [JobMetaController::class, 'storeLocation']);
    Route::delete('/job-locations/{id}', [JobMetaController::class, 'deleteLocation']);

    // Job Types and Location Types
    Route::get('/job-types', [JobMetaController::class, 'types']);
    Route::get('/job-location-types', [JobMetaController::class, 'locationTypes']);

    // Job Application routes
    Route::post('/jobs/{jobPostId}/apply', [JobApplicationController::class, 'apply']);
});

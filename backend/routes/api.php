<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\EmployerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    // auth
    Route::post('/logout', [AuthController::class, 'Logout']);

    // employer
    Route::prefix('employer')->group(function () {
        // profile
        Route::get('profile', [EmployerController::class, 'showProfile']);
        Route::post('profile', [EmployerController::class, 'updateProfile']);

        // jobs
        Route::get('jobs', [EmployerController::class, 'myJobs']);
        Route::post('job', [EmployerController::class, 'Store']);
        Route::put('job/{job}', [EmployerController::class, 'updateJob']);
        Route::delete('job/{job}', [EmployerController::class, 'deleteJob']);

        // applications
        Route::get('job/{job}/applications', [EmployerController::class, 'jobApplications']);
        Route::put('job/{job}/application/{applicationId}/status', [EmployerController::class, 'updateApplicationStatus']);
    });

    // candidate
    Route::prefix('candidate')->group(function () {
        // profile
        Route::get('profile', [CandidateController::class, 'showProfile']);
        Route::post('profile', [CandidateController::class, 'updateProfile']);
        Route::post('resume', [CandidateController::class, 'uploadResume']);

        // jobs
        Route::post('job/{job}/apply', [CandidateController::class, 'apply']);

        // applications
        Route::get('applications', [CandidateController::class, 'myApplications']);
        Route::delete('application/{application}', [CandidateController::class, 'cancelApplication']);
    });
    // admin
    Route::prefix('admin')->group(function () {
        Route::get('pending-jobs', [AdminController::class, 'pendingJobs']);
        Route::put('job/{job}/approve', [AdminController::class, 'approveJob']);
        Route::put('job/{job}/reject', [AdminController::class, 'rejectJob']);
        Route::get('stats', [AdminController::class, 'stats']);
    });
});
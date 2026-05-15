<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CandidateController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// public
Route::get('jobs', [JobController::class, 'index']);
Route::get('jobs/{job}', [JobController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('users/{id}', [UserController::class, 'publicProfile']);

// auth
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    // logout
    Route::post('/logout', [AuthController::class, 'Logout']);

    // current user profile (all roles)
    Route::get('/user', [UserController::class, 'show']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);

    // employer
    Route::middleware('role:employer')->prefix('employer')->group(function () {
        Route::get('profile', [EmployerController::class, 'showProfile']);
        Route::post('profile', [EmployerController::class, 'updateProfile']);
        Route::get('jobs', [EmployerController::class, 'myJobs']);
        Route::post('job', [EmployerController::class, 'Store']);
        Route::put('job/{job}', [EmployerController::class, 'updateJob']);
        Route::delete('job/{job}', [EmployerController::class, 'deleteJob']);
        Route::get('job/{job}/applications', [EmployerController::class, 'jobApplications']);
        Route::put('job/{job}/application/{applicationId}/status', [EmployerController::class, 'updateApplicationStatus']);
    });

    // candidate
    Route::middleware('role:candidate')->prefix('candidate')->group(function () {
        Route::get('profile', [CandidateController::class, 'showProfile']);
        Route::post('profile', [CandidateController::class, 'updateProfile']);
        Route::post('resume', [CandidateController::class, 'uploadResume']);
        Route::post('job/{job}/apply', [CandidateController::class, 'apply']);
        Route::get('applications', [CandidateController::class, 'myApplications']);
        Route::delete('application/{application}', [CandidateController::class, 'cancelApplication']);
    });

    // admin
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('users', [AdminController::class, 'users']);
        Route::delete('user/{user}', [AdminController::class, 'deleteUser']);
        Route::put('user/{id}/restore', [AdminController::class, 'restoreUser']);
        Route::get('jobs', [AdminController::class, 'jobs']);
        Route::delete('job/{job}', [AdminController::class, 'deleteJob']);
        Route::put('job/{id}/restore', [AdminController::class, 'restoreJob']);
        Route::get('pending-jobs', [AdminController::class, 'pendingJobs']);
        Route::put('job/{job}/approve', [AdminController::class, 'approveJob']);
        Route::put('job/{job}/reject', [AdminController::class, 'rejectJob']);
        Route::get('stats', [AdminController::class, 'stats']);
    });
});

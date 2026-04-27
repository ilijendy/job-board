<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\EmployerController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::prefix('auth')->group(function(){
    Route::post('/register',[AuthController::class, 'register']);
    Route::post('/login',[AuthController::class, 'login']);
});
Route::middleware('auth:sanctum')->group(function(){
    //auth
    Route::post('/logout',[AuthController::class, 'Logout']);

    //employer
    Route::prefix('employer')->group(function(){
        //profile
        Route::get('profile',[EmployerController::class,'showProfile']);
        Route::post('profile',[EmployerController::class,'updateProfile']);

        //jobs
        Route::get('jobs',[EmployerController::class,'myJobs']);
        Route::post('job',[EmployerController::class,'Store']);
        Route::put('job/{job}',[EmployerController::class,'updateJob']);
        Route::delete('job/{job}',[EmployerController::class,'deleteJob']);

        //aplicattions
        Route::get('job/{job}/applications',[EmployerController::class,'jobApplications']);
        Route::put('job/{job}/application/{applicationId}/status',[EmployerController::class,'updateApplicationStatus']);
    });


    


    
});
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

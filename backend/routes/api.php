<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\JobController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;

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

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/jobs', [JobController::class, 'index']); // Public job listings
Route::get('/jobs/{id}', [JobController::class, 'show']); // View single job

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Profile Management
    Route::post('/profile/candidate', [ProfileController::class, 'updateCandidateProfile']);
    Route::post('/profile/recruiter', [ProfileController::class, 'updateRecruiterProfile']);

    // Job Posting (Recruiter Only)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{id}', [JobController::class, 'update']);
    Route::delete('/jobs/{id}', [JobController::class, 'destroy']);
    Route::get('/my-jobs', [JobController::class, 'myJobs']);

    // Applications
    Route::post('/jobs/{id}/apply', [ApplicationController::class, 'apply']); // Candidate apply
    Route::get('/applications/my-applications', [ApplicationController::class, 'myApplications']); // Candidate view
    Route::get('/jobs/{id}/applications', [ApplicationController::class, 'jobApplications']); // Recruiter view
    Route::post('/applications/{id}/status', [ApplicationController::class, 'updateStatus']); // Recruiter update status

    // Admin Routes
    Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
    Route::post('/admin/recruiters/{id}/verify', [AdminController::class, 'verifyRecruiter']);
    Route::post('/admin/jobs/{id}/moderate', [AdminController::class, 'moderateJob']);
    Route::get('/admin/stats', [AdminController::class, 'stats']);

    // Reports
    Route::get('/reports/users', [ReportController::class, 'exportUsers']);
    Route::get('/reports/applications', [ReportController::class, 'exportApplications']);
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
});

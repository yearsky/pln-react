<?php

use App\Http\Controllers\Maintenance\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/maintenance/user', [UserController::class, 'index'])->name('maintenance.user');
    Route::post('/maintenance/user', [UserController::class, 'store'])->name('maintenance.user.store');
    Route::put('/maintenance/user/{user}', [UserController::class, 'update'])->name('maintenance.user.update'); // Route untuk edit
    Route::delete('/maintenance/user/{user}', [UserController::class, 'destroy'])->name('maintenance.user.destroy');
});

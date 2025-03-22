<?php

use App\Http\Controllers\Maintenance\UserController;
use App\Http\Controllers\Maintenance\VendorController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/maintenance/user', [UserController::class, 'index'])->name('maintenance.user');
    Route::post('/maintenance/user', [UserController::class, 'store'])->name('maintenance.user.store');
    Route::put('/maintenance/user/{user}', [UserController::class, 'update'])->name('maintenance.user.update'); // Route untuk edit
    Route::delete('/maintenance/user/{user}', [UserController::class, 'destroy'])->name('maintenance.user.destroy');

    Route::get('/maintenance/vendor', [VendorController::class, 'index'])->name('maintenance.vendor');
    Route::post('/maintenance/vendor', [VendorController::class, 'store'])->name('maintenance.vendor.store');
    Route::put('/maintenance/vendor/{vendor}', [VendorController::class, 'update'])->name('maintenance.vendor.update');
    Route::delete('/maintenance/vendor/{vendor}', [VendorController::class, 'destroy'])->name('maintenance.vendor.destroy');
});

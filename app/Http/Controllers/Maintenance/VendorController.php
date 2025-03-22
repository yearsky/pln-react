<?php

namespace App\Http\Controllers\Maintenance;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    public function index()
    {
        $vendors = Vendor::all();

        return Inertia::render('maintenance/vendor', [
            'vendors' => $vendors,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_vendor' => 'required|string|max:255|unique:vendors',
            'types' => 'required'
        ]);

        Vendor::create([
            'nama_vendor' => $validated['nama_vendor'],
            'types' => $validated['types'],
        ]);

        return redirect()->route('maintenance.vendor')->with('success', 'Vendor created successfully.');
    }

    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'nama_vendor' => 'required|string|max:255|unique:vendors,nama_vendor,' . $vendor->id,
            'types' => 'required|string',
        ]);

        $vendor->update([
            'nama_vendor' => $validated['nama_vendor'],
            'types' => $validated['types'],
        ]);

        return redirect()->route('maintenance.vendor')->with('success', 'Vendor updated successfully.');
    }

    public function destroy(Request $request, Vendor $vendor)
    {
        $request->validate([
            'confirmation' => ['required', 'string', function ($attribute, $value, $fail) {
                if (strtolower($value) !== 'delete') {
                    $fail("The confirmation must be 'delete'.");
                }
            }],
        ]);

        $vendor->delete();

        return redirect()->route('maintenance.vendor')->with('success', 'Vendor deleted successfully.');
    }
}

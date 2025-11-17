<?php

namespace App\Http\Controllers;

use App\Models\DataPelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DataPelangganController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = DataPelanggan::query();

        // Search functionality
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%")
                    ->orWhere('idpel', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Filter by unitup
        if ($request->has('unitup') && $request->unitup != '') {
            $query->where('unitup', $request->unitup);
        }

        // Filter by tarif
        if ($request->has('tarif') && $request->tarif != '') {
            $query->where('tarif', $request->tarif);
        }

        $pelanggan = $query->paginate(50)->withQueryString();

        // Get unique values for filters
        $unitupList = DataPelanggan::distinct()->pluck('unitup')->filter()->values();
        $tarifList = DataPelanggan::distinct()->pluck('tarif')->filter()->values();

        return Inertia::render('DataPelanggan/Index', [
            'pelanggan' => $pelanggan,
            'unitupList' => $unitupList,
            'tarifList' => $tarifList,
            'filters' => $request->only(['search', 'unitup', 'tarif'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('DataPelanggan/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'nik' => 'nullable|string|max:30',
            'idpel' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'koordinat_x' => 'nullable|string|max:50',
            'koordinat_y' => 'nullable|string|max:50',
            'unitupi' => 'nullable|string|max:50',
            'nm_unitupi' => 'nullable|string|max:100',
            'unitap' => 'nullable|string|max:50',
            'nama_ap' => 'nullable|string|max:100',
            'unitup' => 'nullable|string|max:50',
            'nama_up' => 'nullable|string|max:100',
            'tarif' => 'nullable|string|max:20',
            'daya' => 'nullable|integer',
            'kode_golongan' => 'nullable|string|max:20',
            'nomor_meter' => 'nullable|string|max:50',
        ]);

        DataPelanggan::create($validated);

        return redirect()->route('data-pelanggan.index')
            ->with('success', 'Data pelanggan berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(DataPelanggan $dataPelanggan)
    {
        return Inertia::render('DataPelanggan/Show', [
            'pelanggan' => $dataPelanggan
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DataPelanggan $dataPelanggan)
    {
        return Inertia::render('DataPelanggan/Edit', [
            'pelanggan' => $dataPelanggan
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DataPelanggan $dataPelanggan)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:100',
            'nik' => 'nullable|string|max:30',
            'idpel' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'koordinat_x' => 'nullable|string|max:50',
            'koordinat_y' => 'nullable|string|max:50',
            'unitupi' => 'nullable|string|max:50',
            'nm_unitupi' => 'nullable|string|max:100',
            'unitap' => 'nullable|string|max:50',
            'nama_ap' => 'nullable|string|max:100',
            'unitup' => 'nullable|string|max:50',
            'nama_up' => 'nullable|string|max:100',
            'tarif' => 'nullable|string|max:20',
            'daya' => 'nullable|integer',
            'kode_golongan' => 'nullable|string|max:20',
            'nomor_meter' => 'nullable|string|max:50',
            'nama_update' => 'nullable|string|max:100',
            'alamat_update' => 'nullable|string',
            'status_lapangan' => 'nullable|string|max:100',
            'ket_lapangan' => 'nullable|string',
            'ket_pemadanan' => 'nullable|string',
        ]);

        $dataPelanggan->update($validated);

        return redirect()->route('data-pelanggan.index')
            ->with('success', 'Data pelanggan berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DataPelanggan $dataPelanggan)
    {
        $dataPelanggan->delete();

        return redirect()->route('data-pelanggan.index')
            ->with('success', 'Data pelanggan berhasil dihapus.');
    }

    /**
     * Get all data for map view.
     */
    public function map()
    {
        $pelanggan = DataPelanggan::whereNotNull('koordinat_x')
            ->whereNotNull('koordinat_y')
            ->where('koordinat_x', '!=', '')
            ->where('koordinat_y', '!=', '')
            ->get();

        return Inertia::render('DataPelanggan/Map', [
            'pelanggan' => $pelanggan
        ]);
    }
}

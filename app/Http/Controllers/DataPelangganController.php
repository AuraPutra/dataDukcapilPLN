<?php

namespace App\Http\Controllers;

use App\Models\DataPelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use ZipArchive;
use Illuminate\Support\Facades\File;

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
            'ktp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

        // Handle KTP file upload
        if ($request->hasFile('ktp')) {
            $file = $request->file('ktp');
            $filename = 'ktp_' . time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('ktp', $filename, 'public');
            $validated['ktp'] = $path;
        }

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
        // Debug logging
        \Log::info('Update request received', [
            'has_file' => $request->hasFile('ktp'),
            'all_files' => array_keys($request->allFiles()),
            'all_input' => $request->all(),
            'content_type' => $request->header('Content-Type'),
        ]);

        $validated = $request->validate([
            'nama_update' => 'nullable|string|max:100',
            'ktp' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'email' => 'nullable|email|max:100',
            'alamat_update' => 'nullable|string',
            'status_lapangan' => 'nullable|string|max:100',
            'ket_lapangan' => 'nullable|string',
            'ket_lapangan_lainnya' => 'nullable|string',
            'ket_pemadanan' => 'nullable|string',
            'ket_pemadanan_lainnya' => 'nullable|string',
        ]);

        \Log::info('Validation passed', ['has_ktp_in_validated' => isset($validated['ktp'])]);

        // Handle KTP file upload - hanya jika ada file baru
        if ($request->hasFile('ktp')) {
            \Log::info('File KTP diterima');
            $file = $request->file('ktp');
            if ($file->isValid()) {
                $filename = 'ktp_' . time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('ktp', $filename, 'public');
                \Log::info('File stored', ['path' => $path]);
                if ($path) {
                    $validated['ktp'] = $path;
                    \Log::info('Path added to validated', ['ktp' => $validated['ktp']]);
                } else {
                    \Log::error('storeAs returned false');
                    return back()->with('error', 'Gagal menyimpan file KTP');
                }
            } else {
                \Log::error('File not valid');
                return back()->with('error', 'File KTP tidak valid');
            }
        } else {
            \Log::info('No KTP file in request');
            unset($validated['ktp']);
        }

        \Log::info('Updating pelanggan', ['data' => $validated]);
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

    public function exportCsv()
    {
        $filename = "data_pelanggan_" . date('YmdHis') . ".csv";

        $pelanggan = DataPelanggan::all();

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=$filename",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $columns = ['IDPEL', 'Nama', 'Alamat', 'Tarif', 'Daya'];

        $callback = function () use ($pelanggan, $columns) {
            $file = fopen('php://output', 'w');

            // Header CSV
            fputcsv($file, $columns);

            // Data
            foreach ($pelanggan as $p) {
                fputcsv($file, [
                    $p->idpel,
                    $p->nama,
                    $p->alamat,
                    $p->tarif,
                    $p->daya
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function exportXls()
    {
        $filename = "data_survei_" . date('YmdHis') . ".xlsx";
        
        $pelanggan = DataPelanggan::all();

        // Define header columns sesuai template
        $headers = [
            'Idpel',
            'Email_Owner',
            'Nama_Survei',
            'Nik_Survei',
            'Alamat_Survei',
            'Longitude_Survei',
            'Latitude_Survei',
            'Status_Lapangan',
            'Keterangan_Lapangan',
            'Keterangan_Hasil_Pemadanan',
        ];

        // Gunakan OpenSpout untuk membuat Excel
        $writer = new \OpenSpout\Writer\XLSX\Writer();
        $writer->openToFile(storage_path('temp/' . $filename));

        // Write header
        $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues($headers));

        // Write data
        foreach ($pelanggan as $p) {
            // Handle Keterangan Lapangan
            $ket_lapangan = ($p->ket_lapangan === 'Lainnya' && $p->ket_lapangan_lainnya) 
                ? $p->ket_lapangan_lainnya 
                : ($p->ket_lapangan ?? '');
            
            // Handle Keterangan Pemadanan
            $ket_pemadanan = ($p->ket_pemadanan === 'Lainnya' && $p->ket_pemadanan_lainnya) 
                ? $p->ket_pemadanan_lainnya 
                : ($p->ket_pemadanan ?? '');
            
            $row = [
                $p->idpel,
                $p->email ?? '',
                $p->nama_update ?? '',
                $p->nik ?? '',
                $p->alamat_update ?? $p->alamat ?? '',
                $p->koordinat_y ?? '',
                $p->koordinat_x ?? '',
                $p->status_lapangan ?? '',
                $ket_lapangan,
                $ket_pemadanan,
            ];
            $writer->addRow(\OpenSpout\Common\Entity\Row::fromValues($row));
        }

        $writer->close();

        return response()->download(storage_path('temp/' . $filename))->deleteFileAfterSend(true);
    }

    /**
     * Export data pelanggan dengan link gambar KTP ke Excel
     * File Excel dapat dibuka di MS Excel dan menampilkan link ke gambar
     */
    // public function downloadAllKtp()
    // {
    //     $pelanggan = DataPelanggan::whereNotNull('ktp')->get();

    //     $zipFileName = 'ktp_pelanggan_' . date('YmdHis') . '.zip';
    //     $zipPath = storage_path('temp/' . $zipFileName);

    //     if (!is_dir(storage_path('temp'))) {
    //         mkdir(storage_path('temp'), 0755, true);
    //     }

    //     $zip = new ZipArchive();
    //     if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {

    //         foreach ($pelanggan as $p) {
    //             $fileName = basename($p->ktp);
    //             $filePath = public_path('storage/ktp/' . $fileName);

    //             if (file_exists($filePath)) {
    //                 $safeName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $p->nama);
    //                 $zip->addFile($filePath, $safeName . '.' . pathinfo($filePath, PATHINFO_EXTENSION));
    //             } else {
    //                 \Log::warning("File KTP tidak ditemukan: " . $filePath);
    //             }
    //         }

    //         $zip->close();
    //     }

    //     return response()->download($zipPath)->deleteFileAfterSend(true);
    // }
}


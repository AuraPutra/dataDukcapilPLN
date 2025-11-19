<?php

namespace App\Http\Controllers;

use App\Models\DataPelanggan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil semua data dan kelompokkan berdasarkan nama_ap (Unit UP3) dan unitap (ULP)
        $allData = DataPelanggan::all();

        // Kelompokkan data
        $dashboardData = [];

        foreach ($allData as $item) {
            $unitUp3 = $item->nama_ap ?? 'Tidak Terdata';
            $ulp = $item->unitap ?? 'Tidak Terdata';

            // Inisialisasi unit UP3 jika belum ada
            if (!isset($dashboardData[$unitUp3])) {
                $dashboardData[$unitUp3] = [];
            }

            // Inisialisasi ULP jika belum ada
            if (!isset($dashboardData[$unitUp3][$ulp])) {
                $dashboardData[$unitUp3][$ulp] = [
                    'ulp' => $ulp,
                    'jumlah' => 0,
                    'bisa_didata' => 0,
                    'tidak_bisa_didata' => 0,
                    'belum_disurvei' => 0,
                ];
            }

            // Hitung statistik
            $dashboardData[$unitUp3][$ulp]['jumlah']++;

            if ($item->status_lapangan === 'Bisa didata') {
                $dashboardData[$unitUp3][$ulp]['bisa_didata']++;
            } elseif ($item->status_lapangan === 'Tidak bisa didata') {
                $dashboardData[$unitUp3][$ulp]['tidak_bisa_didata']++;
            } else {
                $dashboardData[$unitUp3][$ulp]['belum_disurvei']++;
            }
        }

        // Format data untuk ditampilkan
        $formattedData = [];
        foreach ($dashboardData as $unitUp3 => $ulps) {
            foreach ($ulps as $ulpData) {
                $totalDisurvei = $ulpData['bisa_didata'] + $ulpData['tidak_bisa_didata'];
                $persentase = $ulpData['jumlah'] > 0 ? round(($totalDisurvei / $ulpData['jumlah']) * 100, 2) : 0;

                $formattedData[] = [
                    'unit_up3' => $unitUp3,
                    'ulp' => $ulpData['ulp'],
                    'jumlah' => $ulpData['jumlah'],
                    'bisa_didata' => $ulpData['bisa_didata'],
                    'tidak_bisa_didata' => $ulpData['tidak_bisa_didata'],
                    'belum_disurvei' => $ulpData['belum_disurvei'],
                    'persentase' => $persentase,
                    'sisa' => $ulpData['jumlah'] - $totalDisurvei,
                ];
            }
        }

        // Hitung grand total
        $grandTotal = [
            'jumlah' => 0,
            'bisa_didata' => 0,
            'tidak_bisa_didata' => 0,
            'belum_disurvei' => 0,
        ];

        foreach ($formattedData as $row) {
            $grandTotal['jumlah'] += $row['jumlah'];
            $grandTotal['bisa_didata'] += $row['bisa_didata'];
            $grandTotal['tidak_bisa_didata'] += $row['tidak_bisa_didata'];
            $grandTotal['belum_disurvei'] += $row['belum_disurvei'];
        }

        $grandTotal['persentase'] = $grandTotal['jumlah'] > 0 
            ? round((($grandTotal['bisa_didata'] + $grandTotal['tidak_bisa_didata']) / $grandTotal['jumlah']) * 100, 2) 
            : 0;
        $grandTotal['sisa'] = $grandTotal['jumlah'] - ($grandTotal['bisa_didata'] + $grandTotal['tidak_bisa_didata']);

        return Inertia::render('Dashboard', [
            'dashboardData' => $formattedData,
            'grandTotal' => $grandTotal,
        ]);
    }

    public function showUnit($unitName)
    {
        // Decode URL encoded unit name
        $unitName = urldecode($unitName);

        // Ambil semua data dengan unit UP3 (nama_ap) tertentu
        $allData = DataPelanggan::where('nama_ap', $unitName)->get();

        // Kelompokkan berdasarkan ULP (unitup dan nama_up)
        $ulpData = [];

        foreach ($allData as $item) {
            $ulpCode = $item->unitup ?? 'Tidak Terdata';
            $ulpName = $item->nama_up ?? '';
            $ulp = $ulpCode . ($ulpName ? ' - ' . $ulpName : '');

            if (!isset($ulpData[$ulp])) {
                $ulpData[$ulp] = [
                    'ulp' => $ulp,
                    'jumlah' => 0,
                    'bisa_didata' => 0,
                    'tidak_bisa_didata' => 0,
                    'belum_disurvei' => 0,
                ];
            }

            $ulpData[$ulp]['jumlah']++;

            if ($item->status_lapangan === 'Bisa didata') {
                $ulpData[$ulp]['bisa_didata']++;
            } elseif ($item->status_lapangan === 'Tidak bisa didata') {
                $ulpData[$ulp]['tidak_bisa_didata']++;
            } else {
                $ulpData[$ulp]['belum_disurvei']++;
            }
        }

        // Format data
        $formattedData = [];
        $grandTotal = [
            'jumlah' => 0,
            'bisa_didata' => 0,
            'tidak_bisa_didata' => 0,
            'belum_disurvei' => 0,
        ];

        foreach ($ulpData as $data) {
            $totalDisurvei = $data['bisa_didata'] + $data['tidak_bisa_didata'];
            $persentase = $data['jumlah'] > 0 ? round(($totalDisurvei / $data['jumlah']) * 100, 2) : 0;

            $formattedData[] = [
                'ulp' => $data['ulp'],
                'jumlah' => $data['jumlah'],
                'bisa_didata' => $data['bisa_didata'],
                'tidak_bisa_didata' => $data['tidak_bisa_didata'],
                'belum_disurvei' => $data['belum_disurvei'],
                'persentase' => $persentase,
                'sisa' => $data['jumlah'] - $totalDisurvei,
            ];

            $grandTotal['jumlah'] += $data['jumlah'];
            $grandTotal['bisa_didata'] += $data['bisa_didata'];
            $grandTotal['tidak_bisa_didata'] += $data['tidak_bisa_didata'];
            $grandTotal['belum_disurvei'] += $data['belum_disurvei'];
        }

        $grandTotal['persentase'] = $grandTotal['jumlah'] > 0 
            ? round((($grandTotal['bisa_didata'] + $grandTotal['tidak_bisa_didata']) / $grandTotal['jumlah']) * 100, 2) 
            : 0;
        $grandTotal['sisa'] = $grandTotal['jumlah'] - ($grandTotal['bisa_didata'] + $grandTotal['tidak_bisa_didata']);

        return Inertia::render('DashboardDetail', [
            'unitName' => $unitName,
            'ulpData' => $formattedData,
            'grandTotal' => $grandTotal,
        ]);
    }
}

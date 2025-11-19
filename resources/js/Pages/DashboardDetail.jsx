import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import React, { useState, useEffect } from 'react';

export default function DashboardDetail({ unitName, ulpData, grandTotal }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Helper function untuk cek status
    const getStatusInfo = (persentase) => {
        const isComplete = Number(persentase) >= 100;
        return {
            text: isComplete ? "Survei Selesai" : "Survei Belum Selesai",
            colorClass: isComplete ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"
        };
    };

    const grandStatus = getStatusInfo(grandTotal.persentase);

    return (
        <UserLayout>
            <Head title={`Detail Unit - ${unitName}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Detail Unit: {unitName}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                                    Monitoring Pendataan NIK ID Pelanggan Ganda - ULP
                                </p>
                            </div>
                            <Link
                                href={route('dashboard')}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
                            >
                                ← Kembali
                            </Link>
                        </div>
                    </div>

                    {/* Table - Responsive */}
                    {isMobile ? (
                        // Mobile Card View
                        <div className="space-y-3">

                            {/* --- KARTU TOTAL UNTUK MOBILE --- */}
                            <div className="bg-cyan-500 rounded-lg shadow-md p-4 text-white mb-4 border border-cyan-600 relative overflow-hidden">
                                <h3 className="font-bold text-lg border-b border-cyan-400 pb-2 mb-3 text-center">TOTAL KESELURUHAN</h3>
                                
                                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                                    <div>
                                        <p className="text-cyan-100 text-xs uppercase">Total Data</p>
                                        <p className="font-bold text-xl">{grandTotal.jumlah}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-cyan-100 text-xs uppercase">Persentase</p>
                                        <p className="font-bold text-xl">{Number(grandTotal.persentase).toFixed(2)}%</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 text-xs text-center mb-3">
                                    <div className="bg-white/20 p-2 rounded backdrop-blur-sm">
                                        <p className="text-cyan-50 mb-1">Bisa</p>
                                        <p className="font-bold text-lg">{grandTotal.bisa_didata}</p>
                                    </div>
                                    <div className="bg-red-500/30 p-2 rounded backdrop-blur-sm">
                                        <p className="text-red-100 mb-1">Tidak</p>
                                        <p className="font-bold text-lg">{grandTotal.tidak_bisa_didata}</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded backdrop-blur-sm">
                                        <p className="text-cyan-50 mb-1">Sisa</p>
                                        <p className="font-bold text-lg">{grandTotal.sisa}</p>
                                    </div>
                                </div>

                                {/* Status Bar Mobile */}
                                <div className={`text-center py-1.5 rounded text-xs font-bold uppercase ${
                                    Number(grandTotal.persentase) >= 100 ? "bg-green-500 text-white" : "bg-orange-400 text-white"
                                }`}>
                                    {Number(grandTotal.persentase) >= 100 ? "✓ Survei Selesai" : "⚠ Survei Belum Selesai"}
                                </div>
                            </div>
                            {/* --- END KARTU TOTAL --- */}

                            {ulpData.map((row, idx) => (
                                <div key={idx} className="bg-white rounded-lg shadow-md p-4">
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase">ULP</p>
                                            {/* Di Mobile biarkan menyatu agar tidak memakan tempat, atau bisa dipisah jika mau */}
                                            <p className="font-semibold text-gray-800 text-sm">{row.ulp}</p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                                            <div>
                                                <p className="text-xs text-gray-500">Jumlah</p>
                                                <p className="font-bold text-gray-800">{row.jumlah}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Persentase</p>
                                                <p className="font-bold text-green-600">{Number(row.persentase).toFixed(2)}%</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-xs">
                                            <div className="bg-green-100 p-2 rounded">
                                                <p className="text-gray-600">Bisa</p>
                                                <p className="font-bold text-green-700">{row.bisa_didata}</p>
                                            </div>
                                            <div className="bg-red-100 p-2 rounded">
                                                <p className="text-gray-600">Tidak</p>
                                                <p className="font-bold text-red-700">{row.tidak_bisa_didata}</p>
                                            </div>
                                            <div className="bg-gray-100 p-2 rounded">
                                                <p className="text-gray-600">Sisa</p>
                                                <p className="font-bold text-gray-700">{row.sisa}</p>
                                            </div>
                                        </div>
                                        <div className={`p-2 rounded text-xs text-center font-bold mt-2 ${
                                            Number(row.persentase) >= 100 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                                        }`}>
                                            {Number(row.persentase) >= 100 ? "Selesai" : "Belum Selesai"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        // Desktop Table View
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-cyan-400">
                                        <tr>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-white border-r">KODE UNIT</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-bold text-white border-r">UNIT</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white border-r">JUMLAH</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white bg-lime-300 text-black border-r">BISA DIDATA</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white bg-red-500 border-r">TIDAK BISA DIDATA</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white border-r">JUMLAH</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white bg-lime-300 text-black border-r">PERSENTASE</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white border-r">SISA</th>
                                            <th className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs font-bold text-white border-r">KETERANGAN</th>
                                        </tr>
                                        <tr>
                                            <th colSpan="3" className="text-left px-2 sm:px-4 py-1 sm:py-2 text-xs font-semibold bg-gray-100"></th>
                                            <th colSpan="2" className="text-center px-2 sm:px-4 py-1 sm:py-2 text-xs font-semibold bg-gray-100 border-r">PROGRES PENDATAAN</th>
                                            <th className="text-center px-2 sm:px-4 py-1 sm:py-2 text-xs font-semibold bg-gray-100 border-r">JUMLAH</th>
                                            <th colSpan="3" className="text-center px-2 sm:px-4 py-1 sm:py-2 text-xs font-semibold bg-gray-100 border-r">HASIL</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {ulpData.map((row, idx) => {
                                            // LOGIKA PEMISAHAN STRING DI SINI
                                            // Contoh format: "18110 - PEKANBARU KOTA TIMUR"
                                            const splitData = row.ulp ? row.ulp.split(' - ') : [];
                                            const kodeUnit = splitData.length > 0 ? splitData[0] : '-';
                                            const namaUnit = splitData.length > 1 ? splitData[1] : row.ulp;

                                            return (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    {/* Kolom Kode Unit */}
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-r">
                                                        {kodeUnit}
                                                    </td>
                                                    {/* Kolom Nama Unit */}
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 border-r">
                                                        {namaUnit}
                                                    </td>
                                                    
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium border-r">{row.jumlah}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium bg-lime-100 border-r">{row.bisa_didata}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium bg-red-100 border-r">{row.tidak_bisa_didata}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r">{row.bisa_didata + row.tidak_bisa_didata}</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-medium bg-lime-100 border-r">{Number(row.persentase).toFixed(2)}%</td>
                                                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r">{row.sisa}</td>
                                                    
                                                    {/* Keterangan Per Baris */}
                                                    <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm font-bold border-r ${
                                                        Number(row.persentase) >= 100 ? "text-green-600" : "text-orange-600"
                                                    }`}>
                                                        {Number(row.persentase) >= 100 ? "Selesai" : "Belum"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="bg-cyan-200 font-bold">
                                        <tr>
                                            <td colSpan="2" className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border-r">TOTAL</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r">{grandTotal.jumlah}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm bg-lime-300 border-r">{grandTotal.bisa_didata}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm bg-red-200 border-r">{grandTotal.tidak_bisa_didata}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r">{grandTotal.bisa_didata + grandTotal.tidak_bisa_didata}</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm bg-lime-300 border-r">{Number(grandTotal.persentase).toFixed(2)}%</td>
                                            <td className="px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r">{grandTotal.sisa}</td>
                                            
                                            {/* Keterangan Grand Total Desktop */}
                                            <td className={`px-2 sm:px-4 py-2 sm:py-3 text-center text-xs sm:text-sm border-r ${grandStatus.colorClass}`}>
                                                {grandStatus.text}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
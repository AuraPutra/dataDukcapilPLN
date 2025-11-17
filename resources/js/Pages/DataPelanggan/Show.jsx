import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Show({ pelanggan }) {
    return (
        <>
            <Head title={`Detail Pelanggan - ${pelanggan.nama}`} />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Detail Pelanggan
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Informasi lengkap pelanggan PLN
                                </p>
                            </div>
                            <Link
                                href={route('data-pelanggan.index')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                Kembali
                            </Link>
                        </div>
                    </div>

                    {/* Detail Content */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informasi Identitas */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Identitas
                                    </h2>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Nama</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.nama || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">NIK</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.nik || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">ID Pelanggan</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.idpel || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Nomor Meter</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.nomor_meter || '-'}</p>
                                    </div>
                                </div>

                                {/* Informasi Listrik */}
                                <div className="space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Listrik
                                    </h2>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Tarif</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.tarif || '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Daya</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.daya ? `${pelanggan.daya} VA` : '-'}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Kode Golongan</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.kode_golongan || '-'}</p>
                                    </div>
                                </div>

                                {/* Lokasi */}
                                <div className="md:col-span-2 space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                        Lokasi
                                    </h2>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Alamat</label>
                                        <p className="text-gray-900 mt-1">{pelanggan.alamat || '-'}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Koordinat X</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.koordinat_x || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Koordinat Y</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.koordinat_y || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Unit */}
                                <div className="md:col-span-2 space-y-4">
                                    <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Unit
                                    </h2>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Unit UPI</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.unitupi || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Nama UPI</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.nm_unitupi || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Unit AP</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.unitap || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Nama AP</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.nama_ap || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Unit UP</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.unitup || '-'}</p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-600">Nama UP</label>
                                            <p className="text-gray-900 mt-1">{pelanggan.nama_up || '-'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Informasi Update */}
                                {(pelanggan.nama_update || pelanggan.alamat_update) && (
                                    <div className="md:col-span-2 space-y-4">
                                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                            Informasi Update
                                        </h2>

                                        {pelanggan.nama_update && (
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">Nama Update</label>
                                                <p className="text-gray-900 mt-1">{pelanggan.nama_update}</p>
                                            </div>
                                        )}

                                        {pelanggan.alamat_update && (
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">Alamat Update</label>
                                                <p className="text-gray-900 mt-1">{pelanggan.alamat_update}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Keterangan Lapangan */}
                                {(pelanggan.status_lapangan || pelanggan.ket_lapangan || pelanggan.ket_pemadanan) && (
                                    <div className="md:col-span-2 space-y-4">
                                        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">
                                            Keterangan Lapangan
                                        </h2>

                                        {pelanggan.status_lapangan && (
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">Status Lapangan</label>
                                                <p className="text-gray-900 mt-1">{pelanggan.status_lapangan}</p>
                                            </div>
                                        )}

                                        {pelanggan.ket_lapangan && (
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">Keterangan Lapangan</label>
                                                <p className="text-gray-900 mt-1">{pelanggan.ket_lapangan}</p>
                                            </div>
                                        )}

                                        {pelanggan.ket_pemadanan && (
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">Keterangan Pemadanan</label>
                                                <p className="text-gray-900 mt-1">{pelanggan.ket_pemadanan}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                            <Link
                                href={route('data-pelanggan.edit', pelanggan.id)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Edit Data
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

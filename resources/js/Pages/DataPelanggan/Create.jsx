import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama: '',
        nik: '',
        idpel: '',
        alamat: '',
        koordinat_x: '',
        koordinat_y: '',
        unitupi: '',
        nm_unitupi: '',
        unitap: '',
        nama_ap: '',
        unitup: '',
        nama_up: '',
        tarif: '',
        daya: '',
        kode_golongan: '',
        nomor_meter: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('data-pelanggan.store'));
    };

    return (
        <>
            <Head title="Tambah Data Pelanggan" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">
                                    Tambah Data Pelanggan
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Masukkan data pelanggan baru
                                </p>
                            </div>
                            <Link
                                href={route('data-pelanggan.index')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="space-y-6">
                            {/* Informasi Identitas */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                                    Informasi Identitas
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nama <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.nama ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            required
                                        />
                                        {errors.nama && <p className="text-red-500 text-sm mt-1">{errors.nama}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">NIK</label>
                                        <input
                                            type="text"
                                            value={data.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">ID Pelanggan</label>
                                        <input
                                            type="text"
                                            value={data.idpel}
                                            onChange={(e) => setData('idpel', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Meter</label>
                                        <input
                                            type="text"
                                            value={data.nomor_meter}
                                            onChange={(e) => setData('nomor_meter', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Listrik */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                                    Informasi Listrik
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tarif</label>
                                        <input
                                            type="text"
                                            value={data.tarif}
                                            onChange={(e) => setData('tarif', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Daya (VA)</label>
                                        <input
                                            type="number"
                                            value={data.daya}
                                            onChange={(e) => setData('daya', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Kode Golongan</label>
                                        <input
                                            type="text"
                                            value={data.kode_golongan}
                                            onChange={(e) => setData('kode_golongan', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lokasi */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                                    Lokasi
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                                        <textarea
                                            value={data.alamat}
                                            onChange={(e) => setData('alamat', e.target.value)}
                                            rows="3"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat X</label>
                                            <input
                                                type="text"
                                                value={data.koordinat_x}
                                                onChange={(e) => setData('koordinat_x', e.target.value)}
                                                placeholder="Contoh: 0.5074"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Koordinat Y</label>
                                            <input
                                                type="text"
                                                value={data.koordinat_y}
                                                onChange={(e) => setData('koordinat_y', e.target.value)}
                                                placeholder="Contoh: 101.4478"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Informasi Unit */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
                                    Informasi Unit
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit UPI</label>
                                        <input
                                            type="text"
                                            value={data.unitupi}
                                            onChange={(e) => setData('unitupi', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama UPI</label>
                                        <input
                                            type="text"
                                            value={data.nm_unitupi}
                                            onChange={(e) => setData('nm_unitupi', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit AP</label>
                                        <input
                                            type="text"
                                            value={data.unitap}
                                            onChange={(e) => setData('unitap', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama AP</label>
                                        <input
                                            type="text"
                                            value={data.nama_ap}
                                            onChange={(e) => setData('nama_ap', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Unit UP</label>
                                        <input
                                            type="text"
                                            value={data.unitup}
                                            onChange={(e) => setData('unitup', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Nama UP</label>
                                        <input
                                            type="text"
                                            value={data.nama_up}
                                            onChange={(e) => setData('nama_up', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="mt-8 flex justify-end gap-3">
                            <Link
                                href={route('data-pelanggan.index')}
                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Data'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

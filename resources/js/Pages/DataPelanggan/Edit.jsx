import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Edit({ pelanggan }) {
    const [ktpPreview, setKtpPreview] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const { flash, auth } = usePage().props;

    // Check if user is admin (UIDRKR)
    const isAdmin = auth?.user?.ul_up === 'UIDRKR';

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (flash.success) {
            setAlertType('success');
            setAlertMessage(flash.success);
            setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
        }
        if (flash.error) {
            setAlertType('error');
            setAlertMessage(flash.error);
            setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
        }
    }, [flash]);

    const sudahDisurvei =
        pelanggan.nama_update ||
        pelanggan.alamat_update ||
        pelanggan.status_lapangan ||
        pelanggan.ket_lapangan ||
        pelanggan.ket_pemadanan;

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama: pelanggan.nama || '',
        nik: pelanggan.nik || '',
        idpel: pelanggan.idpel || '',
        nomor_meter: pelanggan.nomor_meter || '',
        tarif: pelanggan.tarif || '',
        daya: pelanggan.daya || '',
        kode_golongan: pelanggan.kode_golongan || '',
        alamat: pelanggan.alamat || '',
        koordinat_x: pelanggan.koordinat_x || '',
        koordinat_y: pelanggan.koordinat_y || '',
        unitupi: pelanggan.unitupi || '',
        nm_unitupi: pelanggan.nm_unitupi || '',
        unitap: pelanggan.unitap || '',
        nama_ap: pelanggan.nama_ap || '',
        unitup: pelanggan.unitup || '',
        nama_up: pelanggan.nama_up || '',
        nama_update: pelanggan.nama_update || '',
        ktp: null,
        nik_update: pelanggan.nik_update || '',
        alamat_update: pelanggan.alamat_update || '',
        status_lapangan: pelanggan.status_lapangan || '',
        ket_lapangan: pelanggan.ket_lapangan || '',
        ket_lapangan_lainnya: '',
        ket_pemadanan: pelanggan.ket_pemadanan || '',
        ket_pemadanan_lainnya: '',
    });

    const handleKtpChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('ktp', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setKtpPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // --- VALIDASI MANUAL SEBELUM SUBMIT ---

        // 1. Cek field dasar
        if (!data.nama_update || !data.alamat_update || !data.status_lapangan) {
            setAlertType('error');
            setAlertMessage('Mohon lengkapi semua kolom wajib (Nama, Status, Alamat Update).');
            window.scrollTo(0,0);
            return;
        }

        // 1a. Validasi NIK Update jika diisi
        if (data.nik_update && data.nik_update.length !== 16) {
            setAlertType('error');
            setAlertMessage('NIK Update harus tepat 16 digit.');
            window.scrollTo(0,0);
            return;
        }

        // 2. Cek KTP (Wajib jika belum ada data lama dan tidak ada upload baru)
        if (!pelanggan.ktp && !data.ktp) {
            setAlertType('error');
            setAlertMessage('Foto KTP wajib diunggah.');
            window.scrollTo(0,0);
            return;
        }

        // 3. Cek Logika Status Lapangan
        if (data.status_lapangan === 'Tidak bisa didata') {
            if (!data.ket_lapangan) {
                setAlertType('error');
                setAlertMessage('Keterangan lapangan wajib dipilih.');
                return;
            }
            if (data.ket_lapangan === 'Lainnya' && !data.ket_lapangan_lainnya) {
                setAlertType('error');
                setAlertMessage('Mohon isi detail keterangan lainnya.');
                return;
            }
        } else if (data.status_lapangan === 'Bisa didata') {
            if (!data.ket_pemadanan) {
                setAlertType('error');
                setAlertMessage('Keterangan pemadanan wajib dipilih.');
                return;
            }
            if (data.ket_pemadanan === 'Lainnya' && !data.ket_pemadanan_lainnya) {
                setAlertType('error');
                setAlertMessage('Mohon isi detail keterangan lainnya.');
                return;
            }
        }

        // --- PERSIAPAN DATA ---

        // Jika ket_lapangan bukan "Lainnya", kosongkan ket_lapangan_lainnya
        const submitData = { ...data };
        if (data.ket_lapangan !== 'Lainnya') {
            submitData.ket_lapangan_lainnya = '';
        }
        // Jika ket_pemadanan bukan "Lainnya", kosongkan ket_pemadanan_lainnya
        if (data.ket_pemadanan !== 'Lainnya') {
            submitData.ket_pemadanan_lainnya = '';
        }

        post(route('data-pelanggan.update', pelanggan.id), {
            data: submitData,
            forceFormData: true,
            onSuccess: () => {
                setAlertType('success');
                setAlertMessage('Data pelanggan berhasil diperbarui!');
                setTimeout(() => {
                    setAlertMessage(null);
                }, 3000);
            },
            onError: (errors) => {
                setAlertType('error');
                setAlertMessage('Gagal memperbarui data. Periksa isian Anda.');
                setTimeout(() => {
                    setAlertMessage(null);
                }, 3000);
            }
        });
    };

    return (
        <UserLayout>
            <Head title={`Edit Pelanggan - ${pelanggan.nama}`} />

            {alertMessage && (
                <div className={`fixed top-2 sm:top-4 right-2 sm:right-4 z-50 p-3 sm:p-4 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3 text-sm sm:text-base ${
                    alertType === 'success'
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                }`}>
                    {alertType === 'success' ? (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{alertMessage}</span>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-3 sm:py-8 px-2 sm:px-4">
                <div className="max-w-4xl mx-auto">

                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-6 mb-3 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div className="flex-1">
                                <h1 className="text-lg sm:text-3xl font-bold text-gray-800">
                                    Edit Data Pelanggan
                                </h1>

                                {sudahDisurvei ? (
                                    <span className="inline-block mt-2 px-3 sm:px-4 py-1 bg-green-600 text-white text-xs sm:text-sm font-semibold rounded-full">
                                        ✓ Telah Disurvei
                                    </span>
                                ) : (
                                    <span className="inline-block mt-2 px-3 sm:px-4 py-1 bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-full">
                                        Belum Disurvei
                                    </span>
                                )}
                            </div>

                            <Link
                                href={route('data-pelanggan.index', pelanggan.id)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-300 transition-colors duration-200 text-center"
                            >
                                Batal
                            </Link>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-3 sm:p-6">
                        <div className="space-y-4 sm:space-y-6">

                            {/* Bagian Identitas (Disabled) */}
                            <section>
                                <h2 className="text-base sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                    Informasi Identitas
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Nama
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.nama : pelanggan.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            NIK
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.nik : pelanggan.nik}
                                            onChange={(e) => setData('nik', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            ID Pelanggan
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.idpel : pelanggan.idpel}
                                            onChange={(e) => setData('idpel', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Nomor Meter
                                        </label>
                                        <input
                                            type="text"
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.nomor_meter : pelanggan.nomor_meter}
                                            onChange={(e) => setData('nomor_meter', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Bagian Listrik (Disabled) */}
                            <section>
                                <h2 className="text-base sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                    Informasi Listrik
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Tarif
                                        </label>
                                        <input
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.tarif : pelanggan.tarif}
                                            onChange={(e) => setData('tarif', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Daya (VA)
                                        </label>
                                        <input
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.daya : pelanggan.daya}
                                            onChange={(e) => setData('daya', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Kode Golongan
                                        </label>
                                        <input
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.kode_golongan : pelanggan.kode_golongan}
                                            onChange={(e) => setData('kode_golongan', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Bagian Lokasi (Disabled) */}
                            <section>
                                <h2 className="text-base sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                    Lokasi
                                </h2>

                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">Alamat</label>
                                <textarea
                                    disabled={!isAdmin}
                                    value={isAdmin ? data.alamat : pelanggan.alamat}
                                    onChange={(e) => setData('alamat', e.target.value)}
                                    className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Koordinat X
                                        </label>
                                        <input
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.koordinat_x : pelanggan.koordinat_x}
                                            onChange={(e) => setData('koordinat_x', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Koordinat Y
                                        </label>
                                        <input
                                            disabled={!isAdmin}
                                            value={isAdmin ? data.koordinat_y : pelanggan.koordinat_y}
                                            onChange={(e) => setData('koordinat_y', e.target.value)}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg ${!isAdmin ? 'bg-gray-100 text-gray-600' : ''}`}
                                        />
                                    </div>
                                </div>
                            </section>

                             {/* Bagian Unit (Disabled) */}
                            <section>
                                <h2 className="text-base sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                    Informasi Unit
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    {[
                                        ['Unit UPI', pelanggan.unitupi],
                                        ['Nama UPI', pelanggan.nm_unitupi],
                                        ['Unit AP', pelanggan.unitap],
                                        ['Nama AP', pelanggan.nama_ap],
                                        ['Unit UP', pelanggan.unitup],
                                        ['Nama UP', pelanggan.nama_up],
                                    ].map(([label, value]) => (
                                        <div key={label}>
                                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                {label}
                                            </label>
                                            <input
                                                disabled
                                                value={value}
                                                className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* === BAGIAN FORM INPUT === */}
                            <section>
                                <h2 className="text-base sm:text-xl font-bold text-gray-800 border-b pb-2 mb-3 sm:mb-4">
                                    Informasi Update & Keterangan
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Nama Update <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nama_update}
                                            onChange={(e) => setData('nama_update', e.target.value)}
                                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            NIK Update (16 Digit)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.nik_update}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, '');
                                                if (value.length <= 16) {
                                                    setData('nik_update', value);
                                                }
                                            }}
                                            placeholder="Masukkan 16 digit NIK"
                                            maxLength="16"
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.nik_update ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.nik_update && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.nik_update}</p>}
                                        {data.nik_update && data.nik_update.length !== 16 && data.nik_update.length > 0 && (
                                            <p className="text-orange-500 text-xs sm:text-sm mt-1">NIK harus 16 digit (saat ini: {data.nik_update.length})</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            KTP (Foto) {!pelanggan.ktp && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleKtpChange}
                                            // Wajib diisi HANYA JIKA belum ada KTP di database
                                            required={!pelanggan.ktp}
                                            className={`w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                                errors.ktp ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        />
                                        {errors.ktp && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.ktp}</p>}
                                    </div>
                                </div>

                                {(ktpPreview || pelanggan.ktp) && (
                                    <div className="mt-3 sm:mt-4">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Preview KTP
                                        </label>
                                        <img
                                            src={ktpPreview || `/storage/${pelanggan.ktp}`}
                                            alt="KTP Preview"
                                            className="h-24 sm:h-40 rounded border shadow-sm object-cover max-w-full"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-4">
                                    <div>
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Status Lapangan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.status_lapangan}
                                            onChange={(e) => setData('status_lapangan', e.target.value)}
                                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                            required
                                        >
                                            <option value="">-- Pilih Status --</option>
                                            <option value="Bisa didata">Bisa didata</option>
                                            <option value="Tidak bisa didata">Tidak bisa didata</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-3 sm:mt-4">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Alamat Update <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={data.alamat_update}
                                        onChange={(e) => setData('alamat_update', e.target.value)}
                                        rows="2"
                                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                        required
                                    />
                                </div>

                                {data.status_lapangan === 'Tidak bisa didata' && (
                                    <div className="mt-3 sm:mt-4">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Keterangan Lapangan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.ket_lapangan}
                                            onChange={(e) => {
                                                setData('ket_lapangan', e.target.value);
                                                if (e.target.value !== 'Lainnya') {
                                                    setData('ket_lapangan_lainnya', '');
                                                }
                                            }}
                                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                            required
                                        >
                                            <option value="">-- Pilih Keterangan --</option>
                                            <option value="Rumah kosong">Rumah kosong</option>
                                            <option value="Rumah tutup">Rumah tutup</option>
                                            <option value="Anjing galak">Anjing galak</option>
                                            <option value="Pagar terkunci">Pagar terkunci</option>
                                            <option value="Penghuni tidak bersedia didata">Penghuni tidak bersedia didata</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>

                                        {data.ket_lapangan === 'Lainnya' && (
                                            <div className="mt-2 sm:mt-3">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    Keterangan Lainnya <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.ket_lapangan_lainnya}
                                                    onChange={(e) => setData('ket_lapangan_lainnya', e.target.value)}
                                                    rows="2"
                                                    className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                                    placeholder="Masukkan keterangan lainnya"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {data.status_lapangan === 'Bisa didata' && (
                                    <div className="mt-3 sm:mt-4">
                                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                            Keterangan Pemadanan <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.ket_pemadanan}
                                            onChange={(e) => {
                                                setData('ket_pemadanan', e.target.value);
                                                if (e.target.value !== 'Lainnya') {
                                                    setData('ket_pemadanan_lainnya', '');
                                                }
                                            }}
                                            className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                            required
                                        >
                                            <option value="">-- Pilih Keterangan --</option>
                                            <option value="Beli dari pemilik lama">Beli dari pemilik lama</option>
                                            <option value="Keluarga dari pemilik">Keluarga dari pemilik (Istri/Anak/dll.)</option>
                                            <option value="Pengontrak/Penyewa">Pengontrak/Penyewa</option>
                                            <option value="Penjaga/Pembantu">Penjaga/Pembantu</option>
                                            <option value="Penghuni rumah dinas">Penghuni rumah dinas</option>
                                            <option value="Perbaikan data sesuai KTP">Perbaikan data sesuai KTP</option>
                                            <option value="Pemilik sudah meninggal">Pemilik sudah meninggal</option>
                                            <option value="Lainnya">Lainnya</option>
                                        </select>

                                        {data.ket_pemadanan === 'Lainnya' && (
                                            <div className="mt-2 sm:mt-3">
                                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                                    Keterangan Lainnya <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    value={data.ket_pemadanan_lainnya}
                                                    onChange={(e) => setData('ket_pemadanan_lainnya', e.target.value)}
                                                    rows="2"
                                                    className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg invalid:border-red-500"
                                                    placeholder="Masukkan keterangan lainnya"
                                                    required
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </section>

                        </div>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                            <Link
                                href={route('data-pelanggan.index', pelanggan.id)}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-gray-200 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-300 transition-colors duration-200 text-center"
                            >
                                Batal
                            </Link>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </UserLayout>
    );
}

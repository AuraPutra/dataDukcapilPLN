import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ pelanggan, namaUpList, tarifList, filters }) {
    const { auth, flash } = usePage().props;
    const isAdmin = auth?.user?.ul_up === 'UIDRKR';

    const [search, setSearch] = useState(filters.search || '');
    const [namaUp, setNamaUp] = useState(filters.nama_up || '');
    const [tarif, setTarif] = useState(filters.tarif || '');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

    React.useEffect(() => {
        if (flash.success) {
            setAlertType('success');
            setAlertMessage(flash.success);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
        if (flash.error) {
            setAlertType('error');
            setAlertMessage(flash.error);
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 5000);
        }
    }, [flash]);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('data-pelanggan.index'), {
            search,
            nama_up: namaUp,
            tarif
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleReset = () => {
        setSearch('');
        setNamaUp('');
        setTarif('');
        router.get(route('data-pelanggan.index'));
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
            router.delete(route('data-pelanggan.destroy', id));
        }
    };

    return (
        <UserLayout>
            <Head title="Data Pelanggan PLN" />

            {showAlert && (
                <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-3 ${
                    alertType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                    {alertType === 'success' ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    )}
                    <span>{alertMessage}</span>
                </div>
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Data Pelanggan PLN
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                                    Kelola data pelanggan listrik PLN UID Riau dan Kepulauan Riau
                                </p>
                            </div>
                            {isAdmin && (
                                <Link
                                    href={route('data-pelanggan.create')}
                                    className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-base whitespace-nowrap"
                                >
                                    <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Tambah
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Search & Filter */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <form onSubmit={handleSearch} className="space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                                <div className="sm:col-span-2 md:col-span-2">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Cari Pelanggan
                                    </label>
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Nama, NIK, ID..."
                                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Nama UP
                                    </label>
                                    <select
                                        value={namaUp}
                                        onChange={(e) => setNamaUp(e.target.value)}
                                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Semua</option>
                                        {namaUpList.map((unit, index) => (
                                            <option key={index} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                                        Tarif
                                    </label>
                                    <select
                                        value={tarif}
                                        onChange={(e) => setTarif(e.target.value)}
                                        className="w-full px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">Semua</option>
                                        {tarifList.map((t, index) => (
                                            <option key={index} value={t}>
                                                {t}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-3">
                                <button
                                    type="submit"
                                    className="px-3 sm:px-6 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-xs sm:text-base"
                                >
                                    Cari
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-3 sm:px-6 py-1.5 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200 text-xs sm:text-base"
                                >
                                    Reset
                                </button>
                                <a
                                    href={route('pelanggan.export.xls')}
                                    className="px-3 sm:px-6 py-1.5 sm:py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-xs sm:text-base"
                                >
                                    Export Excel
                                </a>
                            </div>
                        </form>
                    </div>

                    {/* Mobile Card View */}
                    {isMobile ? (
                        <div className="space-y-3">
                            {pelanggan.data.length > 0 ? (
                                pelanggan.data.map((item) => (
                                    <div key={item.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                                        {/* Header */}
                                        <div className="flex justify-between items-start gap-2 pb-2 border-b">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">{item.nama}</p>
                                                <p className="text-xs text-gray-500">ID: {item.idpel || '-'}</p>
                                            </div>
                                            {item.status_lapangan ? (
                                                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                    ✔ Survei
                                                </span>
                                            ) : (
                                                <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">
                                                    Belum
                                                </span>
                                            )}
                                        </div>

                                        {/* Info Grid */}
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <div className="col-span-2">
                                                <p className="text-gray-600">Alamat Update</p>
                                                <p className="font-medium text-gray-800">{item.alamat_update || 'Belum diisi'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Tarif</p>
                                                <p className="font-medium text-gray-800">{item.tarif || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Daya</p>
                                                <p className="font-medium text-gray-800">{item.daya || '-'} VA</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-gray-600">Meter</p>
                                                <p className="font-medium text-gray-800">{item.nomor_meter || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Address */}
                                        <div className="text-xs bg-gray-50 p-2 rounded">
                                            <p className="text-gray-600">Alamat</p>
                                            <p className="text-gray-800 line-clamp-2">{item.alamat || '-'}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={route('data-pelanggan.show', item.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Detail
                                            </Link>
                                            <Link
                                                href={route('data-pelanggan.edit', item.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="flex-1 text-center px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                    Tidak ada data pelanggan
                                </div>
                            )}

                            {/* Mobile Pagination */}
                            {pelanggan.links.length > 3 && (
                                <div className="bg-white rounded-lg p-4 space-y-3">
                                    <div className="text-xs text-gray-700 text-center">
                                        <p>Menampilkan <span className="font-medium">{pelanggan.from}</span> - <span className="font-medium">{pelanggan.to}</span> dari <span className="font-medium">{pelanggan.total}</span></p>
                                    </div>
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {pelanggan.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-2 py-1 text-xs rounded ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Desktop Table View */
                        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase">
                                                ID
                                            </th>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase">
                                                Nama
                                            </th>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase">
                                                Alamat Update
                                            </th>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase">
                                                Tarif
                                            </th>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase">
                                                Daya
                                            </th>
                                            <th className="px-2 sm:px-6 py-2 sm:py-3 text-center font-medium text-gray-500 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {pelanggan.data.length > 0 ? (
                                            pelanggan.data.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap font-medium text-gray-900">
                                                        {item.idpel || '-'}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-900 flex items-center gap-2">
                                                        <span className="truncate">{item.nama}</span>
                                                        {item.status_lapangan ? (
                                                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">✔</span>
                                                        ) : (
                                                            <span className="bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full whitespace-nowrap">-</span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 text-gray-500">
                                                        {item.alamat_update || 'Belum diisi'}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-500">
                                                        {item.tarif || '-'}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-500">
                                                        {item.daya || '-'}
                                                    </td>
                                                    <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-center">
                                                        <div className="flex justify-center gap-2">
                                                            <Link
                                                                href={route('data-pelanggan.show', item.id)}
                                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                                            >
                                                                Detail
                                                            </Link>
                                                            <Link
                                                                href={route('data-pelanggan.edit', item.id)}
                                                                className="text-green-600 hover:text-green-900 font-medium"
                                                            >
                                                                Edit
                                                            </Link>
                                                            {isAdmin && (
                                                                <button
                                                                    onClick={() => handleDelete(item.id)}
                                                                    className="text-red-600 hover:text-red-900 font-medium"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                    Tidak ada data pelanggan
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Desktop Pagination */}
                            {pelanggan.links.length > 3 && (
                                <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-xs sm:text-sm text-gray-700">
                                            Menampilkan <span className="font-medium">{pelanggan.from}</span> -
                                            <span className="font-medium">{pelanggan.to}</span> dari
                                            <span className="font-medium">{pelanggan.total}</span>
                                        </div>
                                        <div className="flex gap-1 flex-wrap justify-center">
                                            {pelanggan.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-2 sm:px-3 py-1 sm:py-2 text-xs rounded ${
                                                        link.active
                                                            ? 'bg-blue-600 text-white'
                                                            : link.url
                                                            ? 'bg-white text-gray-700 hover:bg-gray-50 border'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}

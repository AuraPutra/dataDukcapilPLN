import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Index({ users }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Cek ukuran layar secara realtime
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(route('users.destroy', id));
        }
    };

    return (
        <UserLayout>
            <Head title="Manajemen User" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Manajemen User
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                                    Kelola akun pengguna sistem
                                </p>
                            </div>
                            <Link
                                href={route('users.create')}
                                className="px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 shadow-lg text-xs sm:text-base whitespace-nowrap"
                            >
                                <svg className="w-4 sm:w-5 h-4 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Tambah User
                            </Link>
                        </div>
                    </div>

                    {isMobile ? (
                        // --- TAMPILAN MOBILE (KARTU) ---
                        <div className="space-y-3">
                            {users.data.length > 0 ? (
                                users.data.map((user) => (
                                    <div key={user.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                                        {/* Header Kartu */}
                                        <div className="flex justify-between items-start gap-2 pb-2 border-b border-gray-100">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>
                                            {/* Badge UL/UP di pojok kanan atas */}
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full whitespace-nowrap ${
                                                user.ul_up === 'UIDRKR'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : user.ul_up?.startsWith('UP3')
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}>
                                                {user.ul_up || '-'}
                                            </span>
                                        </div>

                                        {/* Info Body */}
                                        <div className="text-xs space-y-2">
                                            <div>
                                                <p className="text-gray-500">Jabatan</p>
                                                <p className="font-medium text-gray-800">{user.jabatan || '-'}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2 pt-2">
                                            <Link
                                                href={route('users.show', user.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Detail
                                            </Link>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="flex-1 text-center px-3 py-2 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-lg p-8 text-center text-gray-500">
                                    Tidak ada data user
                                </div>
                            )}

                            {/* Mobile Pagination */}
                            {users.links.length > 3 && (
                                <div className="bg-white rounded-lg p-4 mt-4">
                                    <div className="flex flex-wrap gap-1 justify-center">
                                        {users.links.map((link, index) => (
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
                        // --- TAMPILAN DESKTOP (TABEL) ---
                        <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nama
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Jabatan
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                UL/UP
                                            </th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.length > 0 ? (
                                            users.data.map((user) => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-500">{user.jabatan || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            user.ul_up === 'UIDRKR'
                                                                ? 'bg-purple-100 text-purple-800'
                                                                : user.ul_up?.startsWith('UP3')
                                                                ? 'bg-blue-100 text-blue-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}>
                                                            {user.ul_up || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                        <div className="flex justify-center gap-2">
                                                            <Link
                                                                href={route('users.show', user.id)}
                                                                className="text-blue-600 hover:text-blue-900 font-medium"
                                                            >
                                                                Detail
                                                            </Link>
                                                            <Link
                                                                href={route('users.edit', user.id)}
                                                                className="text-green-600 hover:text-green-900 font-medium"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="text-red-600 hover:text-red-900 font-medium"
                                                            >
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    Tidak ada data user
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Desktop Pagination */}
                            {users.links.length > 3 && (
                                <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-xs sm:text-sm text-gray-700">
                                            Menampilkan <span className="font-medium">{users.from}</span> -
                                            <span className="font-medium">{users.to}</span> dari
                                            <span className="font-medium">{users.total}</span>
                                        </div>
                                        <div className="flex gap-1 flex-wrap justify-center">
                                            {users.links.map((link, index) => (
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

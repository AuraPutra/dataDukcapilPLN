import React from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Show({ user }) {
    return (
        <UserLayout>
            <Head title="Detail User" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Detail User</h1>
                            <p className="text-sm text-gray-600 mt-2">Informasi lengkap user</p>
                        </div>

                        <div className="space-y-6">
                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Nama</h3>
                                <p className="text-lg text-gray-900">{user.name}</p>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Email</h3>
                                <p className="text-lg text-gray-900">{user.email}</p>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Jabatan</h3>
                                <p className="text-lg text-gray-900">{user.jabatan || '-'}</p>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">UL/UP</h3>
                                <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                                    user.ul_up === 'UIDRKR'
                                        ? 'bg-purple-100 text-purple-800'
                                        : user.ul_up?.startsWith('UP3')
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                }`}>
                                    {user.ul_up || '-'}
                                </span>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">UI/UP</h3>
                                <p className="text-lg text-gray-900">{user.ui_up || '-'}</p>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">Dibuat</h3>
                                <p className="text-lg text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Link
                                    href={route('users.edit', user.id)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Edit
                                </Link>
                                <Link
                                    href={route('users.index')}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Kembali
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

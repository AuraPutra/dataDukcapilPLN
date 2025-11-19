import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';

export default function Edit({ user }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        jabatan: user.jabatan || '',
        ul_up: user.ul_up || '',
        ui_up: user.ui_up || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <UserLayout>
            <Head title="Edit User" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-4 sm:py-8 px-2 sm:px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-8">
                        <div className="mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit User</h1>
                            <p className="text-sm text-gray-600 mt-2">Perbarui informasi user</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nama <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password Baru
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Kosongkan jika tidak ingin mengubah password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <p className="mt-1 text-xs text-gray-500">Kosongkan jika tidak ingin mengubah password</p>
                                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Jabatan
                                </label>
                                <input
                                    type="text"
                                    value={data.jabatan}
                                    onChange={(e) => setData('jabatan', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                {errors.jabatan && <p className="mt-1 text-sm text-red-600">{errors.jabatan}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UL/UP
                                </label>
                                <select
                                    value={data.ul_up}
                                    onChange={(e) => setData('ul_up', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Pilih UL/UP</option>
                                    <option value="UIDRKR">UIDRKR</option>
                                    <option value="ULP AIR MOLEK">ULP AIR MOLEK</option>
                                    <option value="ULP ANAMBAS">ULP ANAMBAS</option>
                                    <option value="ULP BAGAN BATU">ULP BAGAN BATU</option>
                                    <option value="ULP BAGAN SIAPI-API">ULP BAGAN SIAPI-API</option>
                                    <option value="ULP BANGKINANG">ULP BANGKINANG</option>
                                    <option value="ULP BELAKANGPADANG">ULP BELAKANGPADANG</option>
                                    <option value="ULP BENGKALIS">ULP BENGKALIS</option>
                                    <option value="ULP BINTAN CENTER">ULP BINTAN CENTER</option>
                                    <option value="ULP DABO SINGKEP">ULP DABO SINGKEP</option>
                                    <option value="ULP DUMAI KOTA">ULP DUMAI KOTA</option>
                                    <option value="ULP DURI">ULP DURI</option>
                                    <option value="ULP KAMPAR">ULP KAMPAR</option>
                                    <option value="ULP KIJANG">ULP KIJANG</option>
                                    <option value="ULP KUALA ENOK">ULP KUALA ENOK</option>
                                    <option value="ULP LIPAT KAIN">ULP LIPAT KAIN</option>
                                    <option value="ULP NATUNA">ULP NATUNA</option>
                                    <option value="ULP PANAM">ULP PANAM</option>
                                    <option value="ULP PANGKALAN KERINCI">ULP PANGKALAN KERINCI</option>
                                    <option value="ULP PASIR PANGARAIAN">ULP PASIR PANGARAIAN</option>
                                    <option value="ULP PEKANBARU KOTA BARAT">ULP PEKANBARU KOTA BARAT</option>
                                    <option value="ULP PEKANBARU KOTA TIMUR">ULP PEKANBARU KOTA TIMUR</option>
                                    <option value="ULP PERAWANG">ULP PERAWANG</option>
                                    <option value="ULP RENGAT KOTA">ULP RENGAT KOTA</option>
                                    <option value="ULP RUMBAI">ULP RUMBAI</option>
                                    <option value="ULP SELATPANJANG">ULP SELATPANJANG</option>
                                    <option value="ULP SIAK SRI INDRAPURA">ULP SIAK SRI INDRAPURA</option>
                                    <option value="ULP SIMPANG TIGA">ULP SIMPANG TIGA</option>
                                    <option value="ULP TALUK KUANTAN">ULP TALUK KUANTAN</option>
                                    <option value="ULP TANJUNG BALAI KARIMUN">ULP TANJUNG BALAI KARIMUN</option>
                                    <option value="ULP TANJUNG BATU">ULP TANJUNG BATU</option>
                                    <option value="ULP TANJUNG UBAN">ULP TANJUNG UBAN</option>
                                    <option value="ULP TANJUNGPINANG KOTA">ULP TANJUNGPINANG KOTA</option>
                                    <option value="ULP TEMBILAHAN">ULP TEMBILAHAN</option>
                                    <option value="ULP UJUNG BATU">ULP UJUNG BATU</option>
                                    <option value="UP3 BANGKINANG">UP3 BANGKINANG</option>
                                    <option value="UP3 DUMAI">UP3 DUMAI</option>
                                    <option value="UP3 PEKANBARU">UP3 PEKANBARU</option>
                                    <option value="UP3 RENGAT">UP3 RENGAT</option>
                                    <option value="UP3 TANJUNGPINANG">UP3 TANJUNGPINANG</option>
                                </select>
                                {errors.ul_up && <p className="mt-1 text-sm text-red-600">{errors.ul_up}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    UI/UP
                                </label>
                                <select
                                    value={data.ui_up}
                                    onChange={(e) => setData('ui_up', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Pilih UI/UP</option>
                                    <option value="UIDRKR">UIDRKR</option>
                                    <option value="UP3 Bangkinang">UP3 Bangkinang</option>
                                    <option value="UP3 Dumai">UP3 Dumai</option>
                                    <option value="UP3 Pekanbaru">UP3 Pekanbaru</option>
                                    <option value="UP3 Rengat">UP3 Rengat</option>
                                    <option value="UP3 Tanjung Pinang">UP3 Tanjung Pinang</option>
                                </select>
                                {errors.ui_up && <p className="mt-1 text-sm text-red-600">{errors.ui_up}</p>}
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400"
                                >
                                    Update
                                </button>
                                <Link
                                    href={route('users.index')}
                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                                >
                                    Batal
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

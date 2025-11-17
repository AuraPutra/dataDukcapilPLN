import { Head } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";

const Dasboard = () => {
    const [dataSekolah, setDataSekolah] = useState([]);

    // Fetch data sekolah (limit 5) dari API
    useEffect(() => {
        fetch('/api/schools-list')
            .then(response => response.json())
            .then(data => {
                // Ambil maksimal 5 data
                setDataSekolah(data.slice(0, 5));
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);


    // Kolom DataTable
    const columns = [
        {
            name: "No",
            selector: (row, index) => index + 1,
            width: "5rem",
        },
        {
            name: "Nama Sekolah",
            selector: (row) => row.nama,
            cell: (row) => (
                <a
                    href={`/sekolah/${row.id}`}
                    className="underline hover:text-blue-700"
                >
                    {row.nama}
                </a>
            ),
        },
        {
            name: "Alamat",
            selector: (row) => row.alamat,
        },
    ];

    return (
        <UserLayout>
            <section
                className="relative w-full bg-cover bg-center py-32 md:py-40 text-center font-mono"
            >
                {/* Overlay image */}
                <div className="absolute inset-0 bg-white"></div>

                {/* Konten teks */}
                <div className="relative z-10 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        {/* Card Peta */}
                        <Link
                            href="/peta"
                            className="flex flex-col items-center justify-center bg-blue-100 rounded-lg shadow-md py-[7rem] px-6 hover:shadow-lg transform hover:scale-105 transition duration-300"
                        >
                            <img
                                src="/iconPeta.svg"
                                alt="Peta"
                                className="w-36 h-36 mb-4"
                            />
                            <h3 className="text-lg font-semibold text-blue-600">Peta</h3>
                        </Link>

                        {/* Card Sekolah */}
                        <Link
                            href="/list-sekolah"
                            className="flex flex-col items-center justify-center bg-blue-100 rounded-lg shadow-md py-12 px-6 hover:shadow-lg transform hover:scale-105 transition duration-300"
                        >
                            <img
                                src="/iconSekolah.svg"
                                alt="Sekolah"
                                className="w-36 h-36 mb-4"
                            />
                            <h3 className="text-lg font-semibold text-blue-600">
                                Sekolah
                            </h3>
                        </Link>
                    </div>

                    {/* Tabel Preview Sekolah */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <h2 className="text-xl font-bold mb-4 text-left">List Sekolah</h2>
                            <Link href="/list-sekolah" className="text-xl font-bold mb-4 text-right text-blue-600">More</Link>
                        </div>
                        <DataTable
                            columns={columns}
                            data={dataSekolah}
                            highlightOnHover
                            striped
                            pagination={false} // Tidak ada pagination
                        />
                    </div>
                </div>
            </section>
        </UserLayout>
    );
};

export default Dasboard;

import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix icon bawaan Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Show({ pelanggan }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const lat = parseFloat(pelanggan.koordinat_x);
    const lng = parseFloat(pelanggan.koordinat_y);

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        if (!lat || !lng || isNaN(lat) || isNaN(lng)) return;

        const map = L.map(mapRef.current).setView([lat, lng], 17);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${pelanggan.nama}</b><br>IDPEL: ${pelanggan.idpel}`)
            .openPopup();

        mapInstanceRef.current = map;

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [lat, lng, pelanggan]);

    return (
        <UserLayout>
            <Head title={`Detail Pelanggan - ${pelanggan.nama}`} />

            <div className="py-4 sm:py-10 px-2 sm:px-4">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 mb-4 sm:mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Detail Pelanggan
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                                    Informasi lengkap pelanggan PLN
                                </p>
                            </div>

                            <Link
                                href={route('data-pelanggan.index')}
                                className="px-4 sm:px-5 py-2 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 text-xs sm:text-base whitespace-nowrap"
                            >
                                ← Kembali
                            </Link>
                        </div>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-lg sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

                                {/* Identitas */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Identitas
                                    </h2>

                                    <DetailItem label="Nama" value={pelanggan.nama} />
                                    <DetailItem label="NIK" value={pelanggan.nik} />
                                    <DetailItem label="KTP" value={pelanggan.ktp} isImage={true} />
                                    <DetailItem label="ID Pelanggan" value={pelanggan.idpel} />
                                    <DetailItem label="Nomor Meter" value={pelanggan.nomor_meter} />
                                </div>

                                {/* Listrik */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Listrik
                                    </h2>

                                    <DetailItem label="Tarif" value={pelanggan.tarif} />
                                    <DetailItem label="Daya" value={pelanggan.daya ? `${pelanggan.daya} VA` : '-'} />
                                    <DetailItem label="Kode Golongan" value={pelanggan.kode_golongan} />
                                </div>

                                {/* Lokasi */}
                                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">Lokasi</h2>

                                    <DetailItem label="Alamat" value={pelanggan.alamat} />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                        <DetailItem label="Koordinat X" value={pelanggan.koordinat_x} />
                                        <DetailItem label="Koordinat Y" value={pelanggan.koordinat_y} />
                                    </div>

                                    {/* MAP SECTION */}
                                    <div className="mt-3 sm:mt-4">
                                        <h3 className="text-base sm:text-lg font-semibold mb-2">Peta Lokasi</h3>

                                        {lat && lng ? (
                                            <div
                                                ref={mapRef}
                                                style={{ height: isMobile ? "250px" : "400px", width: "100%" }}
                                                className="rounded-lg sm:rounded-xl shadow-md border"
                                            ></div>
                                        ) : (
                                            <p className="text-red-500 text-xs sm:text-base">
                                                ❌ Koordinat tidak tersedia
                                            </p>
                                        )}
                                    </div>
                                    {/* Tombol Buka di Google Maps */}
                                    <div className="mt-3 sm:mt-4">
                                        <a
                                            href={`https://www.google.com/maps?q=${pelanggan.koordinat_x?.trim()},${pelanggan.koordinat_y?.trim()}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 text-xs sm:text-base"
                                        >
                                            🗺️ Buka di Google Maps
                                        </a>
                                    </div>
                                </div>

                                {/* Unit PLN */}
                                <div className="md:col-span-2 space-y-3 sm:space-y-4">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">
                                        Informasi Unit
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                                        <DetailItem label="Unit UPI" value={pelanggan.unitupi} />
                                        <DetailItem label="Nama UPI" value={pelanggan.nm_unitupi} />
                                        <DetailItem label="Unit AP" value={pelanggan.unitap} />
                                        <DetailItem label="Nama AP" value={pelanggan.nama_ap} />
                                        <DetailItem label="Unit UP" value={pelanggan.unitup} />
                                        <DetailItem label="Nama UP" value={pelanggan.nama_up} />
                                    </div>
                                </div>

                                {/* Update Data */}
                                {(pelanggan.nama_update || pelanggan.alamat_update) && (
                                    <div className="md:col-span-2 space-y-3 sm:space-y-4">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">
                                            Informasi Update
                                        </h2>

                                        {pelanggan.nama_update && (
                                            <DetailItem label="Nama Update" value={pelanggan.nama_update} />
                                        )}
                                        {pelanggan.email && (
                                            <DetailItem label="Email" value={pelanggan.email} />
                                        )}
                                        {pelanggan.alamat_update && (
                                            <DetailItem label="Alamat Update" value={pelanggan.alamat_update} />
                                        )}
                                    </div>
                                )}

                                {/* Informasi Lapangan */}
                                {(pelanggan.status_lapangan || pelanggan.ket_lapangan || pelanggan.ket_pemadanan) && (
                                    <div className="md:col-span-2 space-y-3 sm:space-y-4">
                                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 border-b pb-2">
                                            Keterangan Lapangan
                                        </h2>

                                        {pelanggan.status_lapangan && (
                                            <DetailItem label="Status Lapangan" value={pelanggan.status_lapangan} />
                                        )}
                                        {pelanggan.ket_lapangan && (
                                            <DetailItem label="Keterangan Lapangan" value={pelanggan.ket_lapangan} />
                                        )}
                                        {pelanggan.ket_pemadanan && (
                                            <DetailItem label="Keterangan Pemadanan" value={pelanggan.ket_pemadanan} />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t flex justify-end">
                            <Link
                                href={route('data-pelanggan.edit', pelanggan.id)}
                                className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-xs sm:text-base"
                            >
                                ✏️ Edit Data
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}

/* Komponen kecil untuk menghindari duplikasi */
/* Ganti bagian const DetailItem yang lama dengan yang baru ini */
const DetailItem = ({ label, value, isImage = false }) => {
    
    // Helper function untuk memastikan URL benar
    const getImageUrl = (path) => {
        if (!path) return '';
        // Jika path sudah lengkap (http...) kembalikan apa adanya
        if (path.startsWith('http')) return path;
        // Jika path dimulai dengan 'public/', hapus 'public/' karena kita pakai prefix '/storage/'
        const cleanPath = path.replace(/^public\//, '');
        return `/storage/${cleanPath}`;
    };

    return (
        <div>
            <label className="text-xs sm:text-sm font-semibold text-gray-600">{label}</label>
            {isImage ? (
                value ? (
                    <div className="mt-1 sm:mt-2">
                        {/* Debugging: Lihat di Console browser (F12) path apa yang keluar */}
                        {console.log(`Gambar ${label}:`, value)} 
                        
                        <img 
                            src={getImageUrl(value)} 
                            alt={label} 
                            className="h-24 sm:h-40 rounded border shadow-sm object-cover"
                            onError={(e) => {
                                // Jika gambar error/tidak ketemu, sembunyikan gambar dan tampilkan teks error
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                            }}
                        />
                        {/* Teks Error Backup */}
                        <p className="text-red-500 text-xs hidden">
                            ⚠️ Gagal memuat gambar. Cek `php artisan storage:link`
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-1 text-xs sm:text-base italic text-gray-400">
                        (Tidak ada foto)
                    </p>
                )
            ) : (
                <p className="text-gray-900 mt-1 text-xs sm:text-base">{value || '-'}</p>
            )}
        </div>
    );
};

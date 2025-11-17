import React, { useEffect, useRef, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function Map({ pelanggan }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        // Initialize map
        const map = L.map(mapRef.current).setView([0.5074, 101.4478], 12);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add markers
        pelanggan.forEach((item) => {
            const lat = parseFloat(item.koordinat_x);
            const lng = parseFloat(item.koordinat_y);

            if (!isNaN(lat) && !isNaN(lng)) {
                const marker = L.marker([lat, lng]).addTo(map);

                const popupContent = `
                    <div class="p-2">
                        <h3 class="font-bold text-lg mb-2">${item.nama || 'Tidak ada nama'}</h3>
                        <div class="space-y-1 text-sm">
                            <p><strong>ID Pel:</strong> ${item.idpel || '-'}</p>
                            <p><strong>NIK:</strong> ${item.nik || '-'}</p>
                            <p><strong>Alamat:</strong> ${item.alamat || '-'}</p>
                            <p><strong>Tarif:</strong> ${item.tarif || '-'}</p>
                            <p><strong>Daya:</strong> ${item.daya || '-'} VA</p>
                        </div>
                    </div>
                `;

                marker.bindPopup(popupContent);

                marker.on('click', () => {
                    setSelectedPelanggan(item);
                });
            }
        });

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [pelanggan]);

    return (
        <>
            <Head title="Peta Pelanggan PLN" />

            <div className="h-screen flex flex-col">
                {/* Header */}
                <div className="bg-white shadow-md p-4 z-10">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Peta Pelanggan PLN
                            </h1>
                            <p className="text-gray-600 text-sm">
                                Total: {pelanggan.length} pelanggan dengan koordinat
                            </p>
                        </div>
                        <Link
                            href={route('data-pelanggan.index')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            Kembali ke Tabel
                        </Link>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    <div ref={mapRef} className="absolute inset-0" />

                    {/* Info Panel */}
                    {selectedPelanggan && (
                        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-2xl p-6 max-w-md z-[1000]">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-800">
                                    Detail Pelanggan
                                </h3>
                                <button
                                    onClick={() => setSelectedPelanggan(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Nama</label>
                                    <p className="text-gray-900">{selectedPelanggan.nama || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">ID Pelanggan</label>
                                    <p className="text-gray-900">{selectedPelanggan.idpel || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">NIK</label>
                                    <p className="text-gray-900">{selectedPelanggan.nik || '-'}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">Alamat</label>
                                    <p className="text-gray-900">{selectedPelanggan.alamat || '-'}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Tarif</label>
                                        <p className="text-gray-900">{selectedPelanggan.tarif || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Daya</label>
                                        <p className="text-gray-900">{selectedPelanggan.daya || '-'} VA</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Unit UP</label>
                                        <p className="text-gray-900 text-sm">{selectedPelanggan.nama_up || '-'}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600">Nomor Meter</label>
                                        <p className="text-gray-900">{selectedPelanggan.nomor_meter || '-'}</p>
                                    </div>
                                </div>
                                <div className="pt-3 border-t">
                                    <Link
                                        href={route('data-pelanggan.show', selectedPelanggan.id)}
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Lihat Detail Lengkap
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

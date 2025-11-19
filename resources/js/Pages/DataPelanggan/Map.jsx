import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- IMPORT PENTING UNTUK CLUSTERING ---
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';

// Fix icon default leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Fungsi membuat icon warna warni
const createMarkerIcon = (color) => {
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.4);"></div>`,
        className: 'custom-marker-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
    });
};

const GREEN_ICON = createMarkerIcon('#22c55e'); // Hijau - Sudah
const RED_ICON = createMarkerIcon('#ef4444');   // Merah - Belum

export default function Map({ pelanggan }) {
    const { auth } = usePage().props;
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const clusterGroupRef = useRef(null);

    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 1. Filter Data
    const filteredPelanggan = useMemo(() => {
        if (filterStatus === 'surveyed') {
            return pelanggan.filter(item => item.status_lapangan);
        } else if (filterStatus === 'unsurveyed') {
            return pelanggan.filter(item => !item.status_lapangan);
        }
        return pelanggan;
    }, [pelanggan, filterStatus]);

    // 2. Hitung Statistik
    const statusCount = useMemo(() => {
        return {
            total: pelanggan.length,
            surveyed: pelanggan.filter(item => item.status_lapangan).length,
            unsurveyed: pelanggan.filter(item => !item.status_lapangan).length,
        };
    }, [pelanggan]);

    // 3. Hitung center berdasarkan data density (centroid of markers)
    const mapCenter = useMemo(() => {
        // Default center: Pekanbaru
        const defaultCenter = [0.5074, 101.4478];

        // Jika user adalah UIDRKR (admin), gunakan default Pekanbaru
        if (auth?.user?.ul_up === 'UIDRKR') {
            return defaultCenter;
        }

        // Filter pelanggan yang memiliki koordinat valid
        const validCoords = pelanggan.filter(item => {
            const lat = parseFloat(item.koordinat_x);
            const lng = parseFloat(item.koordinat_y);
            return !isNaN(lat) && !isNaN(lng);
        });

        // Jika tidak ada data valid, gunakan default
        if (validCoords.length === 0) {
            return defaultCenter;
        }

        // Hitung centroid (rata-rata koordinat)
        const sumLat = validCoords.reduce((sum, item) => sum + parseFloat(item.koordinat_x), 0);
        const sumLng = validCoords.reduce((sum, item) => sum + parseFloat(item.koordinat_y), 0);

        const centroidLat = sumLat / validCoords.length;
        const centroidLng = sumLng / validCoords.length;

        return [centroidLat, centroidLng];
    }, [pelanggan, auth]);

    // 3. Inisialisasi Peta
    useEffect(() => {
        if (!mapRef.current) return;

        const map = L.map(mapRef.current, {
            zoomControl: false // Matikan zoom control default (kita pindahkan nanti jika perlu)
        }).setView(mapCenter, 12);

        // Add Zoom Control di posisi yang aman
        L.control.zoom({
            position: 'topleft'
        }).addTo(map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
        }).addTo(map);

        const clusterGroup = L.markerClusterGroup({
            chunkedLoading: true,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: false,
            zoomToBoundsOnClick: true,
            maxClusterRadius: 50 // Cluster lebih rapat di mobile
        });

        map.addLayer(clusterGroup);

        mapInstanceRef.current = map;
        clusterGroupRef.current = clusterGroup;

        return () => {
            map.remove();
        };
    }, [mapCenter]);

    // 4. Update Marker
    useEffect(() => {
        if (!clusterGroupRef.current) return;
        clusterGroupRef.current.clearLayers();
        const markersArray = [];

        filteredPelanggan.forEach(item => {
            const lat = parseFloat(item.koordinat_x);
            const lng = parseFloat(item.koordinat_y);

            if (!isNaN(lat) && !isNaN(lng)) {
                const isSurveyed = item.status_lapangan;
                const icon = isSurveyed ? GREEN_ICON : RED_ICON;
                const statusText = isSurveyed
                    ? '<span style="color:green; font-weight:bold;">✔ Sudah Survei</span>'
                    : '<span style="color:red; font-weight:bold;">⚠ Belum Survei</span>';

                const marker = L.marker([lat, lng], { icon: icon });

                const popupContent = `
                    <div style="min-width: 180px; font-family: sans-serif;">
                        <h3 style="font-weight: bold; margin: 0 0 5px 0; font-size: 14px;">${item.nama || 'Tanpa Nama'}</h3>
                        <div style="margin-bottom: 8px; font-size: 12px;">${statusText}</div>
                        <button id="btn-detail-${item.id}" style="width: 100%; background-color: #2563eb; color: white; border: none; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 12px;">Lihat Detail</button>
                    </div>
                `;

                marker.bindPopup(popupContent);

                // Handle click marker untuk state React
                marker.on('click', () => {
                    setSelectedPelanggan(item);
                });

                // Handle tombol di dalam popup Leaflet (opsional, karena kita pakai overlay panel)
                marker.on('popupopen', () => {
                    const btn = document.getElementById(`btn-detail-${item.id}`);
                    if(btn) {
                        btn.onclick = () => setSelectedPelanggan(item);
                    }
                });

                markersArray.push(marker);
            }
        });

        clusterGroupRef.current.addLayers(markersArray);
    }, [filteredPelanggan]);

    return (
        <UserLayout>
            <Head title="Peta Pelanggan PLN" />

            {/* Gunakan 100dvh untuk mobile agar tidak tertutup address bar */}
            <div className="flex flex-col bg-gray-100 w-full h-screen supports-[height:100dvh]:h-[100dvh] overflow-hidden">

                {/* Header Compact */}
                <div className="bg-white shadow-md z-20 relative flex-shrink-0">
                    <div className="px-3 py-2 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between items-center">
                                <h1 className="text-base sm:text-2xl font-bold text-gray-800">
                                    Peta Sebaran
                                </h1>
                                <Link
                                    href={route('data-pelanggan.index')}
                                    className="sm:hidden text-xs bg-blue-600 text-white px-3 py-1.5 rounded-md"
                                >
                                    Kembali
                                </Link>
                            </div>

                            {/* Stats Row */}
                            <div className="flex gap-3 mt-1 text-[10px] sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap no-scrollbar">
                                <span className="bg-gray-100 px-2 py-0.5 rounded border">Total: <b>{statusCount.total}</b></span>
                                <span className="bg-green-50 px-2 py-0.5 rounded border border-green-200 text-green-700">Sudah: <b>{statusCount.surveyed}</b></span>
                                <span className="bg-red-50 px-2 py-0.5 rounded border border-red-200 text-red-700">Belum: <b>{statusCount.unsurveyed}</b></span>
                            </div>
                        </div>

                        <Link
                            href={route('data-pelanggan.index')}
                            className="hidden sm:block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow"
                        >
                            Kembali ke Tabel
                        </Link>
                    </div>

                    {/* Filter Controls - Horizontal Scroll */}
                    <div className="border-t px-3 py-2 overflow-x-auto no-scrollbar">
                        <div className="flex gap-2 min-w-max">
                            {[
                                { id: 'all', label: 'Semua' },
                                { id: 'surveyed', label: 'Sudah Survei', activeClass: 'bg-green-600 border-green-600 hover:bg-green-50', activeText: 'text-white' },
                                { id: 'unsurveyed', label: 'Belum Survei', activeClass: 'bg-red-600 border-red-600 hover:bg-red-50', activeText: 'text-white' }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setFilterStatus(filter.id)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                        filterStatus === filter.id
                                            ? (filter.activeText || 'text-white') + ' ' + (filter.activeClass || 'bg-blue-600 border-blue-600')
                                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                    }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative w-full h-full bg-gray-200 overflow-hidden">
                    <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

                    {/* Legenda - Sembunyikan di mobile jika panel detail terbuka */}
                    {(!isMobile || !selectedPelanggan) && (
                        <div className="absolute bottom-6 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[500] border border-gray-200 max-w-[150px]">
                            <h4 className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">Legenda</h4>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500 ring-2 ring-white shadow flex-shrink-0"></div>
                                    <span className="text-xs font-medium text-gray-700 leading-tight">Sudah Survei</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-white shadow flex-shrink-0"></div>
                                    <span className="text-xs font-medium text-gray-700 leading-tight">Belum Survei</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Panel / Bottom Sheet */}
                    {selectedPelanggan && (
                        <>
                             {/* Overlay Background untuk mobile */}
                             {isMobile && (
                                <div
                                    className="absolute inset-0 bg-black/20 z-[1000]"
                                    onClick={() => setSelectedPelanggan(null)}
                                />
                            )}

                            <div className={`
                                absolute bg-white shadow-2xl p-4 z-[1100] border border-gray-100
                                transition-transform duration-300 ease-in-out
                                ${isMobile
                                    ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[60vh] overflow-y-auto animate-slide-up'
                                    : 'top-4 right-4 rounded-xl w-80 animate-fade-in'
                                }
                            `}>
                                {/* Drag Handle Indicator for Mobile */}
                                {isMobile && (
                                    <div className="w-full flex justify-center mb-2">
                                        <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-4 border-b pb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-1">
                                            {selectedPelanggan.nama || 'Tanpa Nama'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">ID: {selectedPelanggan.idpel}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedPelanggan(null)}
                                        className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors flex-shrink-0"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                                    </button>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Status Lapangan</span>
                                        {selectedPelanggan.status_lapangan ? (
                                            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Sudah Disurvei
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div> Belum Disurvei
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] uppercase text-gray-500 block">Tarif</label>
                                            <div className="font-medium text-gray-900">{selectedPelanggan.tarif || '-'}</div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] uppercase text-gray-500 block">Daya</label>
                                            <div className="font-medium text-gray-900">{selectedPelanggan.daya || '-'} VA</div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase text-gray-500 block">Alamat</label>
                                        <div className="text-gray-900 text-xs sm:text-sm leading-snug bg-white">
                                            {selectedPelanggan.alamat}
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link
                                            href={route('data-pelanggan.show', selectedPelanggan.id)}
                                            className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.98]"
                                        >
                                            Lihat Detail Lengkap
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* CSS inline untuk animasi sederhana */}
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </UserLayout>
    );
}

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Circle, Tooltip } from "react-leaflet";
import L from "leaflet"; // Import Leaflet untuk custom icon
import UserLayout from "@/Layouts/UserLayout";
import "leaflet/dist/leaflet.css";

const Home = () => {
    const [geojsonData, setGeojsonData] = useState(null);
    const [filter, setFilter] = useState("All");

    // Fetch GeoJSON dari API Laravel
    useEffect(() => {
        fetch(`/api/schools?filter=${filter}`)
            .then((response) => response.json())
            .then((data) => setGeojsonData(data))
            .catch((error) => console.error("Error fetching GeoJSON:", error));
    }, [filter]); // Tambahkan filter sebagai dependency


    // Custom Icons
    const schoolIcons = {
        SMA: L.icon({
            iconUrl: "/markSMA.svg", // Path ke public/markSMA.svg
            iconSize: [32, 32], // Ukuran ikon
            iconAnchor: [16, 32], // Anchor ikon
        }),
        SMP: L.icon({
            iconUrl: "/markSMP.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        }),
        SDN: L.icon({
            iconUrl: "/markSD.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        }),
        default: L.icon({
            iconUrl: "/markDefault.svg", // Tambahkan ikon default jika diperlukan
            iconSize: [32, 32],
            iconAnchor: [16, 32],
        }),
    };

    // Style untuk fitur GeoJSON berdasarkan Nama_Sekol
    const styleFeature = (feature) => {
        const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();

        if (schoolType === "SMA") {
            return { fillColor: "red", color: "red", weight: 2, fillOpacity: 0.8 };
        } else if (schoolType === "SMP") {
            return { fillColor: "blue", color: "blue", weight: 2, fillOpacity: 0.8 };
        } else if (schoolType === "SDN") {
            return { fillColor: "green", color: "green", weight: 2, fillOpacity: 0.8 };
        } else {
            return { fillColor: "gray", color: "gray", weight: 2, fillOpacity: 0.8 };
        }
    };

    // Render lingkaran berdasarkan GeoJSON dan filter
    const renderCircles = (filteredFeatures) => {
        if (filter === "NoCircle") return null; // Jangan render circle jika filter NoCircle dipilih

        return filteredFeatures.map((feature, index) => {
            const [lng, lat] = feature.geometry.coordinates;
            const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();

            const color =
                schoolType === "SMA"
                    ? "gray"
                    : schoolType === "SMP"
                        ? "blue"
                        : schoolType === "SDN"
                            ? "red"
                            : "gray";

            return (
                <Circle
                    key={index}
                    center={[lat, lng]}
                    radius={500} // area
                    pathOptions={{
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.3,
                    }}
                >
                    <Tooltip direction="top" offset={[0, 20]} opacity={1} permanent={false}>
                        <div>
                            <strong>Radius Zonasi: </strong> 500m
                            <br />
                            <strong>{feature.properties.Nama_Sekol}</strong>
                            <br />
                            {feature.properties.Alamat}
                        </div>
                    </Tooltip>
                </Circle>
            );
        });
    };

    const FilterComponent = ({ filter, setFilter }) => (
        <div
            className="absolute z-[1000] bg-blue-500 text-white font-mono shadow-lg rounded p-4"
            style={{ top: "4rem", right: "1rem" }}
        >
            <label htmlFor="filter" className="block text-sm font-medium mb-2">
                Filter
            </label>
            <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full p-2 border bg-blue-500 text-white border-gray-300 rounded"
            >
                <option value="All">No Filter</option>
                <option value="SMA">SMA</option>
                <option value="SMP">SMP</option>
                <option value="SDN">SDN</option>
                <option value="NoCircle">No Circle</option>
            </select>
        </div>
    );

    // Filter fitur GeoJSON berdasarkan pilihan
    const filteredFeatures =
        geojsonData?.features.filter((feature) => {
            const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();
            return filter === "All" || filter === "NoCircle" || schoolType === filter;
        }) || [];

    return (
        <UserLayout>
            <FilterComponent filter={filter} setFilter={setFilter} />
            <div className="w-full h-screen">
                <MapContainer
                    center={[0.526022, 101.454311]}
                    zoom={13}
                    className="h-full w-full"
                    zoomControl={false}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />
                    {geojsonData && (
                        <>
                            <GeoJSON
                                data={{
                                    type: "FeatureCollection",
                                    features: filteredFeatures,
                                }}
                                style={styleFeature}
                                pointToLayer={(feature, latlng) => {
                                    // Tentukan ikon berdasarkan tipe sekolah
                                    const schoolType = feature.properties.Nama_Sekol.slice(0, 3).toUpperCase();
                                    const icon = schoolIcons[schoolType] || schoolIcons.default;

                                    // Gunakan ikon khusus sebagai marker
                                    return L.marker(latlng, { icon });
                                }}
                                onEachFeature={(feature, layer) => {
                                    layer.bindTooltip(
                                        `<strong>${feature.properties.Nama_Sekol}</strong><br>${feature.properties.Alamat}`,
                                        { permanent: false, direction: "top" }
                                    );
                                }}
                            />
                            {renderCircles(filteredFeatures)}
                        </>
                    )}
                </MapContainer>
            </div>
        </UserLayout>
    );
};

export default Home;

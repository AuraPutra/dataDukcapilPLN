import React from "react";
import Navbar from "@/Components/Navbar";

export default function UserLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <Navbar />

            {/* Beri jarak agar konten tidak tertutup navbar */}
            <main className="pt-20 px-4">
                {children}
            </main>
        </div>
    );
}

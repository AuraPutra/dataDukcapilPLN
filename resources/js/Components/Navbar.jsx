import React, { useEffect, useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";

const Navbar = () => {
    const page = usePage();
    const url = page.url;
    const auth = page.props.auth;
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if user is UIDRKR (admin)
    const isAdmin = auth?.user?.ul_up === 'UIDRKR';

    const isActive = (path) => {
        if (path === "/") {
            return url === "/";
        }
        return url.startsWith(path);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const getNavLinkClass = (path) => {
        return `${
            isActive(path)
                ? "bg-blue-500 text-white"
                : "text-black hover:bg-zinc-300 hover:text-white"
        } font-mono rounded-lg py-2 px-3 sm:px-4 transition-all duration-300 text-xs sm:text-base whitespace-nowrap`;
    };

    return (
        <nav className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
            <div className="mx-auto px-2 sm:px-4 py-2 sm:py-3">
                {/* Tambahkan 'relative' di container parent agar absolute positioning bekerja */}
                <div className="relative flex justify-between items-center">

                    {/* 1. Logo (Tetap di Kiri) */}
                    <div className="flex items-center gap-2 sm:gap-4 z-10">
                        <img
                            src="/images/danantara.png"
                            alt="Danantara"
                            className="h-6 sm:h-9 object-contain"
                        />
                        <img
                            src="/images/pln.png"
                            alt="PLN"
                            className="h-10 sm:h-14 object-contain"
                        />
                    </div>

                    {/* 2. Desktop Menu (Ditaruh di Tengah Menggunakan Absolute Position) */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center gap-2 lg:gap-4">
                        <Link href="/" className={getNavLinkClass("/")}>
                            Dashboard
                        </Link>
                        <Link
                            href="/peta-pelanggan"
                            className={getNavLinkClass("/peta-pelanggan")}
                        >
                            Peta
                        </Link>
                        <Link
                            href="/data-pelanggan"
                            className={getNavLinkClass("/data-pelanggan")}
                        >
                            Data Pelanggan
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/users"
                                className={getNavLinkClass("/users")}
                            >
                                Manajemen User
                            </Link>
                        )}
                    </div>

                    {/* Logout Button (Desktop) */}
                    <div className="hidden md:flex items-center gap-3 z-10">
                        <div className="text-right">
                            <div className="text-sm font-semibold text-gray-800">
                                {auth?.user?.name || 'User'}
                            </div>
                            <div className="text-xs text-gray-600">
                                {auth?.user?.ul_up || '-'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-mono rounded-lg py-2 px-4 transition-all duration-300 text-base"
                        >
                            Logout
                        </button>
                    </div>

                    {/* 3. Mobile Menu Button (Tetap di Kanan pada tampilan HP) */}
                    <button
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg z-10"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                    isMobileMenuOpen
                                        ? "M6 18L18 6M6 6l12 12"
                                        : "M4 6h16M4 12h16M4 18h16"
                                }
                            />
                        </svg>
                    </button>

                    {/* Placeholder kosong untuk menyeimbangkan flexbox jika diperlukan di kanan (Opsional) */}
                    {/* <div className="hidden md:flex w-[100px]"></div> */}
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden mt-3 pb-3 space-y-2 border-t pt-3">
                        <Link
                            href="/"
                            className={`block ${getNavLinkClass("/")} w-full text-left`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/peta-pelanggan"
                            className={`block ${getNavLinkClass("/peta-pelanggan")} w-full text-left`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Peta
                        </Link>
                        <Link
                            href="/data-pelanggan"
                            className={`block ${getNavLinkClass("/data-pelanggan")} w-full text-left`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Data Pelanggan
                        </Link>
                        {isAdmin && (
                            <Link
                                href="/users"
                                className={`block ${getNavLinkClass("/users")} w-full text-left`}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Manajemen User
                            </Link>
                        )}
                        <div className="pt-2 border-t">
                            <div className="text-sm font-semibold text-gray-800 mb-1">
                                {auth?.user?.name || 'User'}
                            </div>
                            <div className="text-xs text-gray-600 mb-2">
                                {auth?.user?.ul_up || '-'}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="block bg-red-500 hover:bg-red-600 text-white font-mono rounded-lg py-2 px-3 w-full text-left transition-all duration-300 text-xs"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

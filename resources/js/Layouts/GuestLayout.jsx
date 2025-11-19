import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-cyan-600 pt-6 sm:pt-0">
            {/* Logo Container */}
            <div className="mb-6 flex flex-col items-center">
                <Link href="/">
                    <div className="rounded-full bg-white p-3 shadow-lg transition hover:scale-105">
                        <img
                            src="/images/pln.png"
                            alt="PLN"
                            className="h-20 w-20 object-contain"
                        />
                    </div>
                </Link>
                <h2 className="mt-4 text-2xl font-bold text-white tracking-wide drop-shadow-md">
                    UIDRKR
                </h2>
            </div>

            {/* Main Card */}
            <div className="w-full overflow-hidden bg-white px-8 py-8 shadow-2xl sm:max-w-md sm:rounded-xl border-t-4 border-yellow-400">
                {children}
            </div>

            {/* Footer Message */}
            <div className="mt-6 px-4 text-center">
                <p className="text-sm text-blue-100 opacity-90">
                    Kendala akses akun? <br className="sm:hidden"/>
                    Silakan hubungi admin <span className="font-semibold text-yellow-300">UIDRKR</span>.
                </p>
            </div>
        </div>
    );
}

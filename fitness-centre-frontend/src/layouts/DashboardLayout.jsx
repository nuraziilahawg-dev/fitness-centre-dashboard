import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';
import Button from '../components/Elements/Button/Button';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem('user_name') || 'User');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUserName(userData.name);
                localStorage.setItem('user_name', userData.name);
            } catch (err) {
                if (err.response?.status === 401) {
                    handleLogoutCleanup();
                }
            }
        };

        fetchUser();
    }, []);

    const handleLogoutCleanup = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        navigate('/login', { replace: true });
    };

    const confirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            handleLogoutCleanup();
        }
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">

            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen">
                <div className="p-6 flex flex-col h-full">
                    <div className="mb-10 px-4">
                        <h1 className="text-2xl font-bold text-blue-500 tracking-tight">GymFlow</h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        <NavLink to="/" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}>
                            <span>📊</span> Dashboard
                        </NavLink>
                        <NavLink to="/members" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl ${isActive ? 'bg-blue-600' : 'text-slate-400 hover:bg-slate-800'}`}>
                            <span>👥</span> Members
                        </NavLink>
                    </nav>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="mt-auto flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full group cursor-pointer"
                    >
                        <span className="group-hover:scale-110 transition-transform">🚪</span>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center px-10 justify-between">
                    <h2 className="font-semibold text-slate-800">GymFlow Fitness Centre Management System</h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-slate-900 leading-none">{userName}</p>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                            {userName.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50">
                    <Outlet />
                </main>
            </div>

            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
                    <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🚪
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">End Session?</h3>
                            <p className="text-slate-500 mt-2">Are you sure you want to log out of your account?</p>

                            <div className="flex gap-3 mt-8">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => setShowLogoutModal(false)}
                                    disabled={isLoggingOut}
                                >
                                    Stay
                                </Button>
                                <Button
                                    variant="danger"
                                    className="flex-1"
                                    onClick={confirmLogout}
                                    loading={isLoggingOut}
                                >
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/auth.service';
import Button from './Elements/Button/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setLoading(true);

        try {
            const data = await authService.login({ email, password });

            if (data.token) {
                localStorage.setItem('token', data.token);
                toast.success('Welcome back!');
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else if (err.response && err.response.status === 401) {
                setGeneralError(err.data.error);
            } else {
                setGeneralError("Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const getInputClass = (fieldName) => `
        w-full px-4 py-3 rounded-xl border outline-none transition-all
        ${errors[fieldName] ? 'border-red-400 focus:ring-2 focus:ring-red-100' : 'border-slate-200 focus:ring-2 focus:ring-blue-500'}
    `;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">GymFlow</h2>
                    <p className="text-slate-400 mt-2 font-medium uppercase tracking-widest text-xs">Management System</p>
                </div>

                {generalError && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg animate-in fade-in slide-in-from-top-2">
                        {generalError}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            className={getInputClass('email')}
                            placeholder="admin@fitness.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1.5 ml-1 italic font-medium">{errors.email[0]}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            className={getInputClass('password')}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1.5 ml-1 italic font-medium">{errors.password[0]}</p>
                        )}
                    </div>

                    <Button type="submit" loading={loading} className="w-full py-3.5 text-base shadow-lg shadow-blue-100">
                        Sign In
                    </Button>
                </form>

                {/* Registration Link */}
                <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
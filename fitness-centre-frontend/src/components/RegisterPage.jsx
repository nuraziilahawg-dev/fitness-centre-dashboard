import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from './Elements/Button/Button';
import authService from '../services/auth.service';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            const data = await authService.register(formData);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_name', data.user.name);
                toast.success('Account created! Welcome to GymFlow.');
                navigate('/');
            }
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);
            } else {
                toast.error("Please try again.");
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
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
                    <p className="text-slate-400 mt-2 font-medium uppercase tracking-widest text-xs">Management System</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            className={getInputClass('name')}
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 italic font-medium">{errors.name[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1 ml-1">Email Address</label>
                        <input
                            type="email"
                            className={getInputClass('email')}
                            placeholder="admin@fitness.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 italic font-medium">{errors.email[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            className={getInputClass('password')}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 italic font-medium">{errors.password[0]}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1 ml-1">Confirm Password</label>
                        <input
                            type="password"
                            className={getInputClass('password_confirmation')}
                            placeholder="••••••••"
                            value={formData.password_confirmation}
                            onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-xs mt-1 ml-1 italic font-medium">{errors.password_confirmation[0]}</p>}
                    </div>

                    <Button type="submit" loading={loading} className="w-full py-3.5 text-base mt-2 shadow-lg shadow-blue-100">
                        Create Account
                    </Button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 font-bold hover:text-blue-700 hover:underline transition-all">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
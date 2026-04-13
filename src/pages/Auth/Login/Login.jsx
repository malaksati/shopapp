import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../../../api/authApi';
import useAuthStore from '../../../store/authStore';
import { useEffect } from 'react';

const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

const Login = () => {
    const navigate = useNavigate();
    const { setAuth, token } = useAuthStore();

    useEffect(() => {
        if (token) navigate('/');
    }, [token]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async (data) => {
        try {
            const res = await login(data);
            setAuth(res.data.user, res.data.token);
            toast.success('Welcome back!');

            // redirect admin to dashboard
            if (res.data.user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err) {
            const message = err.response?.data?.message;

            // show server error under the right field
            if (message === 'Invalid email or password') {
                setError('email', { message: ' ' });
                setError('password', { message: 'Invalid email or password' });
            } else {
                toast.error(message || 'Login failed');
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-2">
                        <Store size={28} />
                        ShopApp
                    </Link>
                    <p className="text-gray-500 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="you@example.com"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition
                                ${errors.email ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.email?.message?.trim() && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            {...register('password')}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition
                                ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-indigo-600 font-medium hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import toast from 'react-hot-toast';
import { register as registerApi } from '../../../api/authApi';
import useAuthStore from '../../../store/authStore';
import { useEffect } from 'react';


const schema = z.object({
    name:                  z.string().min(2, 'Name must be at least 2 characters'),
    email:                 z.string().email('Invalid email address'),
    phone:                 z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
    password:              z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
}).refine(
    (data) => data.password === data.password_confirmation,
    { message: 'Passwords do not match', path: ['password_confirmation'] }
);

const Register = () => {
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
            const res = await registerApi(data);
            setAuth(res.data.user, res.data.token);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (err) {
            const errors = err.response?.data?.errors;

            // map laravel validation errors to fields
            if (errors) {
                Object.entries(errors).forEach(([field, messages]) => {
                    setError(field, { message: messages[0] });
                });
            } else {
                toast.error(err.response?.data?.message || 'Registration failed');
            }
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-8">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-2xl mb-2">
                        <Store size={28} />
                        ShopApp
                    </Link>
                    <p className="text-gray-500 text-sm">Create your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder="John Doe"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition
                                ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                        )}
                    </div>

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
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            {...register('phone')}
                            type="tel"
                            placeholder="01012345678"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition
                                ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
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

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password
                        </label>
                        <input
                            {...register('password_confirmation')}
                            type="password"
                            placeholder="••••••••"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition
                                ${errors.password_confirmation ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors.password_confirmation && (
                            <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Creating account...' : 'Create Account'}
                    </button>

                </form>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
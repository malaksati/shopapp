// src/pages/Profile/Profile.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "../../api/profileApi";
import useAuthStore from "../../store/authStore";
import toast from "react-hot-toast";
import { User, Lock, ShoppingBag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const profileSchema = z.object({
    name:  z.string().min(2, 'Name must be at least 2 characters'),
    phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
});

const passwordSchema = z.object({
    current_password:      z.string().min(1, 'Current password is required'),
    password:              z.string().min(8, 'Password must be at least 8 characters'),
    password_confirmation: z.string(),
}).refine(
    (data) => data.password === data.password_confirmation,
    { message: 'Passwords do not match', path: ['password_confirmation'] }
);

export default function Profile() {
    const { user, setAuth, token } = useAuthStore();
    const [activeTab, setActiveTab] = useState('info');

    // ---- Info Form ----
    const {
        register: registerInfo,
        handleSubmit: handleInfo,
        formState: { errors: infoErrors, isSubmitting: infoSubmitting },
    } = useForm({
        resolver: zodResolver(profileSchema),
        defaultValues: { name: user?.name, phone: user?.phone || '' }
    });

    // ---- Password Form ----
    const {
        register: registerPassword,
        handleSubmit: handlePassword,
        reset: resetPassword,
        setError: setPasswordError,
        formState: { errors: passwordErrors, isSubmitting: passwordSubmitting },
    } = useForm({ resolver: zodResolver(passwordSchema) });

    const onUpdateInfo = async (data) => {
        try {
            const res = await updateProfile(data);
            setAuth(res.data.user, token);
            toast.success('Profile updated!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const onUpdatePassword = async (data) => {
        try {
            await updateProfile(data);
            toast.success('Password changed successfully!');
            resetPassword();
        } catch (err) {
            const message = err.response?.data?.message;
            if (message === 'Current password is incorrect') {
                setPasswordError('current_password', { message });
            } else {
                toast.error(message || 'Failed to update password');
            }
        }
    };

    const tabs = [
        { id: 'info',     label: 'Personal Info', icon: <User size={16} /> },
        { id: 'password', label: 'Password',       icon: <Lock size={16} /> },
    ];

    return (
        <div className="container mx-auto p-4 max-w-2xl">

            {/* Profile Header */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm mb-6 flex items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-2xl">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">{user?.name}</h1>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block
                        ${user?.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                        {user?.role}
                    </span>
                </div>

                {/* Quick link to orders */}
                <Link
                    to="/orders"
                    className="ml-auto flex items-center gap-2 text-sm text-indigo-600 hover:underline"
                >
                    <ShoppingBag size={16} />
                    My Orders
                    <ChevronRight size={14} />
                </Link>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                            ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white border text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Personal Info Tab */}
            {activeTab === 'info' && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg mb-5">Personal Information</h2>

                    <form onSubmit={handleInfo(onUpdateInfo)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                {...registerInfo('name')}
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                                    ${infoErrors.name ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {infoErrors.name && <p className="text-red-500 text-xs mt-1">{infoErrors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                value={user?.email}
                                disabled
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                {...registerInfo('phone')}
                                placeholder="01012345678"
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                                    ${infoErrors.phone ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {infoErrors.phone && <p className="text-red-500 text-xs mt-1">{infoErrors.phone.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={infoSubmitting}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {infoSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <h2 className="font-bold text-lg mb-5">Change Password</h2>

                    <form onSubmit={handlePassword(onUpdatePassword)} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                {...registerPassword('current_password')}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                                    ${passwordErrors.current_password ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {passwordErrors.current_password && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.current_password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                {...registerPassword('password')}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                                    ${passwordErrors.password ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {passwordErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.password.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                {...registerPassword('password_confirmation')}
                                type="password"
                                placeholder="••••••••"
                                className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500
                                    ${passwordErrors.password_confirmation ? 'border-red-400' : 'border-gray-300'}`}
                            />
                            {passwordErrors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{passwordErrors.password_confirmation.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={passwordSubmitting}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {passwordSubmitting ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
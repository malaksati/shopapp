import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Store } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import { logout } from '../../api/authApi';
import toast from 'react-hot-toast';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user, token, logout: clearAuth } = useAuthStore();
    const { getItemCount } = useCartStore();
    const navigate = useNavigate();
    const itemCount = getItemCount();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (e) {
            // even if API fails, clear local auth
        } finally {
            clearAuth();
            toast.success('Logged out successfully');
            navigate('/login');
        }
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600">
                        <Store size={24} />
                        ShopApp
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">Home</Link>
                        <Link to="/products" className="text-gray-600 hover:text-indigo-600 transition">Products</Link>
                        {token && (
                            <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition">My Orders</Link>
                        )}
                        {user?.role === 'admin' && (
                            <Link to="/admin" className="text-gray-600 hover:text-indigo-600 transition">Dashboard</Link>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* Cart */}
                        {token && (
                            <Link to="/cart" className="relative text-gray-600 hover:text-indigo-600 transition">
                                <ShoppingCart size={22} />
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* Auth */}
                        {token ? (
                            <div className="flex items-center gap-3">
                                <Link to="/profile" className="flex items-center gap-1 text-gray-600 hover:text-indigo-600 transition">
                                    <User size={18} />
                                    <span className="text-sm">{user?.name}</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login"
                                    className="text-sm text-indigo-600 border border-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-50 transition">
                                    Login
                                </Link>
                                <Link to="/register"
                                    className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden border-t py-4 flex flex-col gap-4">
                        <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">Home</Link>
                        <Link to="/products" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">Products</Link>
                        {token && (
                            <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">My Orders</Link>
                        )}
                        {token ? (
                            <>
                                <Link to="/cart" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">
                                    Cart {itemCount > 0 && `(${itemCount})`}
                                </Link>
                                <Link to="/orders" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">My Orders</Link>
                                {user?.role === 'admin' && (
                                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="text-left text-red-500">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">Login</Link>
                                <Link to="/register" onClick={() => setMenuOpen(false)} className="text-gray-600 hover:text-indigo-600">Register</Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
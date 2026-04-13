import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t mt-auto">
            <div className="container mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-3">
                            <Store size={22} />
                            ShopApp
                        </Link>
                        <p className="text-gray-500 text-sm">
                            Your one-stop shop for everything you need, delivered fast.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/"         className="hover:text-indigo-600 transition">Home</Link></li>
                            <li><Link to="/products" className="hover:text-indigo-600 transition">Products</Link></li>
                            <li><Link to="/cart"     className="hover:text-indigo-600 transition">Cart</Link></li>
                            <li><Link to="/orders"   className="hover:text-indigo-600 transition">My Orders</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Contact</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li className="flex items-center gap-2">
                                <Mail size={14} />
                                support@shopapp.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone size={14} />
                                +20 101 234 5678
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin size={14} />
                                Cairo, Egypt
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t mt-8 pt-6 text-center text-sm text-gray-400">
                    © {new Date().getFullYear()} ShopApp. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
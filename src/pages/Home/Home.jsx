// src/pages/Home/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductsGrouped } from "../../api/productApi";
import ProductCard from "../../components/ui/products/ProductCard";
import { ArrowRight, ShieldCheck, Truck, RotateCcw, Headphones } from "lucide-react";
import Spinner from "../../components/ui/Spinner";

const features = [
    { icon: <Truck size={28} />,        title: 'Free Shipping',    desc: 'On orders over $1000' },
    { icon: <RotateCcw size={28} />,    title: 'Easy Returns',     desc: '30-day return policy' },
    { icon: <ShieldCheck size={28} />,  title: 'Secure Payment',   desc: '100% secure checkout' },
    { icon: <Headphones size={28} />,   title: '24/7 Support',     desc: 'We are always here' },
];

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProductsGrouped();
                setCategories(res.data.slice(0, 3)); // show first 3 categories
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-3xl p-10 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                        Shop the Latest <br />
                        <span className="text-indigo-200">Trends & Deals</span>
                    </h1>
                    <p className="text-indigo-100 mb-8 text-lg">
                        Discover thousands of products with fast delivery and easy returns.
                    </p>
                    <div className="flex gap-3">
                        <Link
                            to="/products"
                            className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition flex items-center gap-2"
                        >
                            Shop Now <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/register"
                            className="border border-white/40 text-white px-6 py-3 rounded-xl hover:bg-white/10 transition"
                        >
                            Join Free
                        </Link>
                    </div>
                </div>

                {/* Hero illustration */}
                <div className="hidden md:flex w-64 h-64 bg-white/10 rounded-3xl items-center justify-center text-8xl">
                    🛍️
                </div>
            </section>

            {/* Features */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {features.map((f) => (
                    <div key={f.title} className="bg-white border rounded-2xl p-5 flex flex-col items-center text-center gap-2 shadow-sm hover:shadow-md transition">
                        <span className="text-indigo-600">{f.icon}</span>
                        <h3 className="font-semibold text-gray-800 text-sm">{f.title}</h3>
                        <p className="text-gray-400 text-xs">{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* Featured Products by Category */}
            {loading ? <Spinner /> : (
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
                        <Link
                            to="/products"
                            className="text-indigo-600 text-sm hover:underline flex items-center gap-1"
                        >
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    {categories.map((category) => (
                        <div key={category.id} className="mb-10">
                            {/* Category title */}
                            <div className="flex items-center gap-3 mb-4">
                                <h3 className="text-lg font-bold text-gray-700">{category.name}</h3>
                                <div className="flex-1 border-t border-gray-200" />
                            </div>

                            {/* Show max 4 products per category */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {category.products.slice(0, 4).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            )}

            {/* CTA Banner */}
            <section className="bg-indigo-50 border border-indigo-100 rounded-3xl p-10 text-center mt-12">
                <h2 className="text-2xl font-bold text-indigo-800 mb-2">Ready to start shopping?</h2>
                <p className="text-indigo-500 mb-6">Join thousands of happy customers today.</p>
                <Link
                    to="/products"
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-indigo-700 transition inline-flex items-center gap-2"
                >
                    Browse Products <ArrowRight size={18} />
                </Link>
            </section>
        </div>
    );
}
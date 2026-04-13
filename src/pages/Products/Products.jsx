import { useEffect, useState } from "react";
import { getProductsGrouped } from "../../api/productApi";
import ProductCard from "../../components/ui/products/ProductCard";
import Spinner from "../../components/ui/Spinner";

export default function Products() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [search, setSearch]         = useState('');

    useEffect(() => {
        const fetchGrouped = async () => {
            setLoading(true);
            try {
                const res = await getProductsGrouped();
                setCategories(res.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchGrouped();
    }, []);

    // filter products inside each category by search
    const filtered = categories.map(cat => ({
        ...cat,
        products: cat.products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        )
    })).filter(cat => cat.products.length > 0);

    if (loading) return <Spinner />;
    if (error)   return <p className="text-red-500 text-center py-10">{error}</p>;

    return (
        <div className="container mx-auto p-4">

            {/* Search Bar */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>

            {/* No results */}
            {filtered.length === 0 && (
                <p className="text-center text-gray-500 py-10">No products found</p>
            )}

            {/* Category Sections */}
            {filtered.map((category) => (
                <section key={category.id} className="mb-12">

                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
                        <span className="text-sm text-gray-400">
                            ({category.products.length} products)
                        </span>
                        <div className="flex-1 border-t border-gray-200 ml-2" />
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {category.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}
import { useEffect, useState } from "react";
import { getProducts, getCategories } from "../../api/productApi";
import ProductCard from "../../components/ui/products/ProductCard";
import Spinner from "../../components/ui/Spinner";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // filter states
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [appliedMin, setAppliedMin] = useState('');
    const [appliedMax, setAppliedMax] = useState('');
    const [inStock, setInStock] = useState(false);
    const [sortBy, setSortBy] = useState('');
    const [sortDir, setSortDir] = useState('asc');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                const all = res.data.data || res.data;
                setCategories(all.filter(cat => !cat.parent_id));
            } catch (err) {
                console.error('Failed to load categories', err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, selectedCategory, appliedMin, appliedMax, inStock, sortBy, sortDir]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (selectedCategory) params.category_id = selectedCategory;
            if (appliedMin) params.min_price = appliedMin;
            if (appliedMax) params.max_price = appliedMax;
            if (inStock) params.in_stock = 1;
            if (sortBy) params.sort_by = sortBy;
            if (sortBy) params.sort_dir = sortDir;

            const res = await getProducts(params);
            setProducts(res.data.data || res.data);
        } catch (err) {
            setError('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch('');
        setSelectedCategory(null);
        setMinPrice('');
        setMaxPrice('');
        setAppliedMin('');
        setAppliedMax('');
        setInStock(false);
        setSortBy('');
        setSortDir('asc');
    };

    const hasFilters = search || selectedCategory || appliedMin || appliedMax || inStock || sortBy;

    if (error) return <p className="text-red-500 text-center py-10">{error}</p>;

    return (
        <div className="container mx-auto p-4">

            {/* Filters Row */}
            <div className="flex flex-wrap gap-1 mb-2 items-center">

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-80 max-w-md border border-gray-300 rounded-xl px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Min Price */}
                <input
                    type="number"
                    placeholder="Min price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    onBlur={() => setAppliedMin(minPrice)}
                    className="w-25 border border-gray-300 rounded-xl px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Max Price */}
                <input
                    type="number"
                    placeholder="Max price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    onBlur={() => setAppliedMax(maxPrice)}
                    className="w-25 border border-gray-300 rounded-xl px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Sort */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-xl px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Sort by</option>
                    <option value="price">Price</option>
                    <option value="name">Name</option>
                    <option value="created_at">Newest</option>
                    <option value="stock">Stock</option>
                </select>

                {/* Sort Direction */}
                {sortBy && (
                    <select
                        value={sortDir}
                        onChange={(e) => setSortDir(e.target.value)}
                        className="border border-gray-300 rounded-xl px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                )}

                {/* In Stock Toggle */}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="w-4 h-4 accent-indigo-600 border border-gray-300"
                    />
                    In stock only
                </label>

                {/* Clear */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="px-2 py-1 rounded-xl text-sm text-red-500 border border-red-300 hover:bg-red-50 transition"
                    >
                        Clear filters
                    </button>
                )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex gap-2 flex-wrap mb-6">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${selectedCategory === null
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                        }`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition border ${selectedCategory === cat.id
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:border-indigo-400'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-sm text-gray-400 mb-4">{products.length} products found</p>
            )}

            {/* No results */}
            {!loading && products.length === 0 && (
                <p className="text-center text-gray-500 py-10">No products found</p>
            )}

            {/* Loading */}
            {loading && <Spinner />}

            {/* Products Grid */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
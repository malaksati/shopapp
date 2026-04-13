import { useNavigate } from "react-router-dom";
import { addToCart } from '../../../api/cartApi';
import useCartStore from '../../../store/cartStore';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    const imageUrl = primaryImage
        ? `${import.meta.env.VITE_STORAGE_URL}/${primaryImage.image_url}`
        : '/placeholder.png';
    const [adding, setAdding] = useState(false);
    const { setCart } = useCartStore();

    const handleAddToCart = async (e) => {
        e.stopPropagation(); // prevent navigation

        setAdding(true);
        try {
            const res = await addToCart({ product_id: product.id, quantity: 1 });
            toast.success('Added to cart!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add to cart');
        } finally {
            setAdding(false);
        }
    };
    return (
        <div
            onClick={() => navigate(`/products/${product.slug}`)}
            className="group border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 bg-white">

            {/* Image */}
            <div className="relative overflow-hidden">
                <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-300"
                />

                {/* Sale badge */}
                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        SALE
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {product.name}
                </h2>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-blue-600 font-bold text-lg">
                        ${product.current_price}
                    </span>

                    {product.is_on_sale && (
                        <span className="text-gray-400 line-through text-sm">
                            ${product.price}
                        </span>
                    )}
                </div>

                {/* Stock */}
                <p className="text-xs text-gray-500 mt-1">
                    {product.stock > 0 ? "In stock" : "Out of stock"}
                </p>

                {/* Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50"
                >
                    {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
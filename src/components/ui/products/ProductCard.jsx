import { useNavigate } from "react-router-dom";
import { addToCart } from '../../../api/cartApi';
import useCartStore from '../../../store/cartStore';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    const imageUrl = primaryImage
        ? `${import.meta.env.VITE_STORAGE_URL}/${primaryImage.image_url}`
        : '/placeholder.png';
    const [adding, setAdding] = useState(false);
    const { setCart } = useCartStore();
    const [activeImage, setActiveImage] = useState(0);
    const [fade, setFade] = useState(true);
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

    useEffect(() => {
        if (!product.images || product.images.length <= 1) return;

        const interval = setInterval(() => {
            setFade(false); // start fade out

            setTimeout(() => {
                setActiveImage(i => (i + 1) % product.images.length);
                setFade(true); // fade back in
            }, 300); // wait for fade out to finish

        }, 2000);

        return () => clearInterval(interval);
    }, [product.images]);

    return (
        <div
            onClick={() => navigate(`/products/${product.slug}`)}
            className="group border border-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 bg-white cursor-pointer">

            {/* Image */}
            <div className="relative overflow-hidden h-52 flex justify-center items-center p-4">
                <img
                    src={
                        product.images?.[activeImage]
                            ? `${import.meta.env.VITE_STORAGE_URL}/${product.images[activeImage].image_url}`
                            : '/placeholder.png'
                    }
                    alt={product.name}
                    style={{ transition: 'opacity 0.3s ease-in-out', opacity: fade ? 1 : 0 }}
                    className="h-full w-full object-contain group-hover:scale-105 transition duration-300"
                />
                {/* Sale badge */}
                {product.is_on_sale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        SALE
                    </span>
                )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100" />

            {/* Content */}
            <div className="p-5 bg-gray-50">
                <h2 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">
                    {product.name}
                </h2>

                {/* Price */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-indigo-600 font-bold text-lg">
                        ${product.price}
                    </span>
                    {product.is_on_sale && (
                        <span className="text-gray-400 line-through text-sm">
                            ${product.sale_price}
                        </span>
                    )}
                </div>

                {/* Stock */}
                <p className={`text-xs mt-1 font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-400'}`}>
                    {product.stock > 0 ? `In stock (${product.stock})` : 'Out of stock'}
                </p>

                {/* Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="mt-4 w-full bg-indigo-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {adding ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
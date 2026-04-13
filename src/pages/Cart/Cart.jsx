// src/pages/Cart/Cart.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCart, removeItem, clearCart } from "../../api/cartApi";
import Spinner from "../../components/ui/Spinner";
import { Trash2, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";
import useCartStore from "../../store/cartStore";

export default function Cart() {
    const [items, setItems]   = useState([]);
    const [total, setTotal]   = useState(0);
    const [loading, setLoading] = useState(true);
    const { setCart, clearCart: clearCartStore } = useCartStore();
    const navigate = useNavigate();

    const fetchCart = async () => {
        setLoading(true);
        try {
            const res = await getCart();
            setItems(res.data.items);
            setTotal(res.data.total);
            setCart(res.data.items, res.data.total);
        } catch (err) {
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const handleUpdate = async (id, quantity) => {
        try {
            await updateCart(id, { quantity });
            fetchCart(); // refresh cart
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        }
    };

    const handleRemove = async (id) => {
        try {
            await removeItem(id);
            toast.success('Item removed');
            fetchCart();
        } catch (err) {
            toast.error('Failed to remove item');
        }
    };

    const handleClear = async () => {
        try {
            await clearCart();
            setItems([]);
            setTotal(0);
            clearCartStore();
            toast.success('Cart cleared');
        } catch (err) {
            toast.error('Failed to clear cart');
        }
    };

    if (loading) return <Spinner />;

    // Empty cart
    if (items.length === 0) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingBag size={64} className="text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-500">Your cart is empty</h2>
            <Link to="/products"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Browse Products
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Shopping Cart</h1>
                <button
                    onClick={handleClear}
                    className="text-sm text-red-500 hover:underline flex items-center gap-1"
                >
                    <Trash2 size={14} /> Clear Cart
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">

                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => {
                        const image = item.product?.images?.find(i => i.is_primary) || item.product?.images?.[0];
                        const imageUrl = image
                            ? `${import.meta.env.VITE_STORAGE_URL}/${image.image_url}`
                            : '/placeholder.png';

                        return (
                            <div key={item.id} className="bg-white border rounded-xl p-4 flex gap-4 items-center shadow-sm">

                                {/* Image */}
                                <img
                                    src={imageUrl}
                                    alt={item.product?.name}
                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                                    onClick={() => navigate(`/products/${item.product?.slug}`)}
                                />

                                {/* Details */}
                                <div className="flex-1">
                                    <h3
                                        onClick={() => navigate(`/products/${item.product?.slug}`)}
                                        className="font-semibold text-gray-800 cursor-pointer hover:text-indigo-600 transition"
                                    >
                                        {item.product?.name}
                                    </h3>
                                    <p className="text-indigo-600 font-bold mt-1">
                                        ${item.product?.current_price}
                                    </p>
                                </div>

                                {/* Quantity */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition text-lg font-medium"
                                    >
                                        −
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button
                                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-100 transition text-lg font-medium"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <p className="font-bold text-gray-800 w-20 text-right">
                                    ${item.subtotal}
                                </p>

                                {/* Remove */}
                                <button
                                    onClick={() => handleRemove(item.id)}
                                    className="text-red-400 hover:text-red-600 transition ml-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Order Summary */}
                <div className="bg-white border rounded-xl p-6 shadow-sm h-fit sticky top-24">
                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>${total}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span className={total > 1000 ? 'text-green-600' : ''}>
                                {total > 1000 ? 'Free' : '$50.00'}
                            </span>
                        </div>
                        <div className="border-t pt-3 flex justify-between font-bold text-gray-800 text-base">
                            <span>Total</span>
                            <span>${total > 1000 ? total : (parseFloat(total) + 50).toFixed(2)}</span>
                        </div>
                    </div>

                    {total > 1000 && (
                        <p className="text-green-600 text-xs mt-2">
                            🎉 You qualify for free shipping!
                        </p>
                    )}

                    <button
                        onClick={() => navigate('/checkout')}
                        className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
                    >
                        Proceed to Checkout
                    </button>

                    <Link to="/products"
                        className="block text-center text-sm text-indigo-600 mt-3 hover:underline">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
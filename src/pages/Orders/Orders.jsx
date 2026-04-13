// src/pages/Orders/Orders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders } from "../../api/orderApi";
import Spinner from "../../components/ui/Spinner";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const statusColors = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
    refunded:   'bg-gray-100 text-gray-600',
};

const paymentColors = {
    unpaid:   'text-red-500',
    paid:     'text-green-600',
    refunded: 'text-gray-500',
};

export default function Orders() {
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await getOrders();
                setOrders(res.data.data || res.data);
            } catch (err) {
                setError('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <Spinner />;
    if (error)   return <p className="text-red-500 text-center py-10">{error}</p>;

    // Empty state
    if (orders.length === 0) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <ShoppingBag size={64} className="text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-500">No orders yet</h2>
            <Link to="/products"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
                Start Shopping
            </Link>
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        <div className="flex items-start justify-between gap-4">

                            {/* Left */}
                            <div className="flex-1">
                                {/* Order ID + Date */}
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-bold text-gray-800">
                                        Order #{order.id}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(order.created_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>

                                {/* Status badges */}
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {order.status}
                                    </span>
                                    <span className={`text-xs font-medium capitalize ${paymentColors[order.payment_status] || 'text-gray-500'}`}>
                                        {order.payment_status}
                                    </span>
                                </div>

                                {/* Items preview */}
                                {order.items?.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-2 line-clamp-1">
                                        {order.items.map(i => i.product_name).join(', ')}
                                    </p>
                                )}
                            </div>

                            {/* Right */}
                            <div className="flex flex-col items-end gap-2">
                                <span className="font-bold text-indigo-600 text-lg">
                                    ${order.total}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {order.items?.length} {order.items?.length === 1 ? 'item' : 'items'}
                                </span>
                                <ChevronRight size={18} className="text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
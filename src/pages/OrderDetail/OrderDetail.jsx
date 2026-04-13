// src/pages/Orders/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrder } from "../../api/orderApi";
import Spinner from "../../components/ui/Spinner";
import { CheckCircle, Package, Truck, MapPin } from "lucide-react";

const statusSteps = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const statusColors = {
    pending:    'bg-yellow-100 text-yellow-700',
    confirmed:  'bg-blue-100 text-blue-700',
    processing: 'bg-purple-100 text-purple-700',
    shipped:    'bg-indigo-100 text-indigo-700',
    delivered:  'bg-green-100 text-green-700',
    cancelled:  'bg-red-100 text-red-700',
    refunded:   'bg-gray-100 text-gray-600',
};

export default function OrderDetail() {
    const { id } = useParams();
    const [order, setOrder]   = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await getOrder(id);
                setOrder(res.data.data || res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <Spinner />;
    if (!order)  return <p className="text-center text-gray-500 py-10">Order not found</p>;

    const currentStep = statusSteps.indexOf(order.status);

    return (
        <div className="container mx-auto p-4 max-w-3xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
                <span className={`text-sm px-3 py-1.5 rounded-full font-medium capitalize ${statusColors[order.status]}`}>
                    {order.status}
                </span>
            </div>

            {/* Progress Tracker — hide if cancelled/refunded */}
            {!['cancelled', 'refunded'].includes(order.status) && (
                <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
                    <div className="flex items-center justify-between relative">
                        {/* Progress line */}
                        <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0" />
                        <div
                            className="absolute left-0 top-4 h-0.5 bg-indigo-500 z-0 transition-all duration-500"
                            style={{ width: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
                        />

                        {statusSteps.map((step, i) => (
                            <div key={step} className="flex flex-col items-center z-10 gap-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition
                                    ${i <= currentStep
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gray-200 text-gray-400'
                                    }`}
                                >
                                    {i < currentStep ? <CheckCircle size={16} /> : i + 1}
                                </div>
                                <span className={`text-xs capitalize hidden md:block ${i <= currentStep ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Order Items */}
            <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Package size={20} className="text-indigo-600" />
                    Items
                </h2>
                <div className="space-y-4">
                    {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                                <p className="font-medium text-gray-800">{item.product_name}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    ${item.unit_price} × {item.quantity}
                                </p>
                            </div>
                            <p className="font-bold text-gray-800">${item.subtotal}</p>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${order.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{order.shipping_cost == 0 ? 'Free' : `$${order.shipping_cost}`}</span>
                    </div>
                    {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Discount</span>
                            <span>-${order.discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between font-bold text-gray-800 text-base border-t pt-2">
                        <span>Total</span>
                        <span>${order.total}</span>
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <MapPin size={20} className="text-indigo-600" />
                    Shipping Address
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                    <p className="font-medium text-gray-800">{order.shipping_address?.full_name}</p>
                    <p>{order.shipping_address?.phone}</p>
                    <p>{order.shipping_address?.street}</p>
                    <p>{order.shipping_address?.city}, {order.shipping_address?.country}</p>
                    {order.shipping_address?.postal_code && (
                        <p>{order.shipping_address.postal_code}</p>
                    )}
                </div>
            </div>

            {/* Payment */}
            <div className="bg-white border rounded-xl p-6 shadow-sm mb-6">
                <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Truck size={20} className="text-indigo-600" />
                    Payment
                </h2>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">
                        {order.payment_method?.replace('_', ' ')}
                    </span>
                    <span className={`font-medium capitalize ${
                        order.payment_status === 'paid'     ? 'text-green-600' :
                        order.payment_status === 'refunded' ? 'text-gray-500'  : 'text-red-500'
                    }`}>
                        {order.payment_status}
                    </span>
                </div>
            </div>

            <Link to="/orders"
                className="block text-center text-indigo-600 hover:underline text-sm">
                ← Back to Orders
            </Link>
        </div>
    );
}
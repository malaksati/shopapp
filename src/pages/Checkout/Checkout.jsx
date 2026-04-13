// src/pages/Checkout/Checkout.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkout } from "../../api/orderApi";
import useCartStore from "../../store/cartStore";
import toast from "react-hot-toast";
import { MapPin, CreditCard, Truck } from "lucide-react";

const schema = z.object({
    full_name:      z.string().min(2, 'Full name is required'),
    phone:          z.string().min(10, 'Valid phone number is required'),
    street:         z.string().min(3, 'Street address is required'),
    city:           z.string().min(2, 'City is required'),
    country:        z.string().min(2, 'Country is required'),
    postal_code:    z.string().optional(),
    payment_method: z.enum(['cash_on_delivery', 'credit_card', 'paypal']),
    notes:          z.string().optional(),
});

export default function Checkout() {
    const navigate = useNavigate();
    const { clearCart, total, items } = useCartStore();
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            country:        'Egypt',
            payment_method: 'cash_on_delivery',
        }
    });

    const onSubmit = async (data) => {
        try {
            const res = await checkout(data);
            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/orders/${res.data.order.id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Checkout failed');
        }
    };

    const paymentOptions = [
        { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: <Truck size={20} /> },
        { value: 'credit_card',      label: 'Credit Card',      icon: <CreditCard size={20} /> },
        { value: 'paypal',           label: 'PayPal',           icon: <CreditCard size={20} /> },
    ];

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-6">Checkout</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left — Shipping + Payment */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Shipping Info */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <MapPin size={20} className="text-indigo-600" />
                                Shipping Information
                            </h2>

                            <div className="grid grid-cols-2 gap-4">

                                {/* Full Name */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        {...register('full_name')}
                                        placeholder="John Doe"
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.full_name ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
                                </div>

                                {/* Phone */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        {...register('phone')}
                                        placeholder="01012345678"
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                </div>

                                {/* Street */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input
                                        {...register('street')}
                                        placeholder="123 Tahrir Square"
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.street ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street.message}</p>}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input
                                        {...register('city')}
                                        placeholder="Cairo"
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.city ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                                </div>

                                {/* Postal Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Postal Code <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <input
                                        {...register('postal_code')}
                                        placeholder="11511"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Country */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                    <input
                                        {...register('country')}
                                        placeholder="Egypt"
                                        className={`w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.country ? 'border-red-400' : 'border-gray-300'}`}
                                    />
                                    {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>}
                                </div>

                                {/* Notes */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Order Notes <span className="text-gray-400">(optional)</span>
                                    </label>
                                    <textarea
                                        {...register('notes')}
                                        placeholder="Any special instructions..."
                                        rows={3}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border rounded-xl p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <CreditCard size={20} className="text-indigo-600" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                {paymentOptions.map((option) => (
                                    <label
                                        key={option.value}
                                        className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition
                                            ${paymentMethod === option.value
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            {...register('payment_method')}
                                            type="radio"
                                            value={option.value}
                                            onChange={() => setPaymentMethod(option.value)}
                                            className="accent-indigo-600"
                                        />
                                        <span className="text-indigo-600">{option.icon}</span>
                                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="bg-white border rounded-xl p-6 shadow-sm h-fit sticky top-24">
                        <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                        {/* Items */}
                        <div className="space-y-2 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                                    <span className="line-clamp-1 flex-1">{item.product?.name}</span>
                                    <span className="ml-2 font-medium">x{item.quantity}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2 text-sm">
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
                            <div className="border-t pt-2 flex justify-between font-bold text-gray-800">
                                <span>Total</span>
                                <span>${total > 1000 ? total : (parseFloat(total) + 50).toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {isSubmitting ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
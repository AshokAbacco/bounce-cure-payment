import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { FiX, FiCreditCard, FiCalendar, FiDollarSign, FiTag, FiUser, FiMail, FiMapPin } from "react-icons/fi";
import { generateTransactionId, generateInvoiceId } from "../utils/generateIds";

export default function AddPaymentModal({ user, close, onSuccess }) {
    const [form, setForm] = useState({
        userId: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        planName: "",
        planType: "Monthly",
        provider: "Stripe",
        currency: "USD",
        amount: "",
        planPrice: "",
        discount: 0,
        paymentMethod: "",
        cardLast4: "",
        billingAddress: "",
        paymentDate: "",
        nextPaymentDate: "",
        status: "success",
        notified: false,
        emailSendCredits: 0,
        emailVerificationCredits: 0,
        smsCredits: 0,
        whatsappCredits: 0,
        transactionId: generateTransactionId(),
        customInvoiceId: generateInvoiceId()
    });

    // Auto-calc next payment date = +1 month
    useEffect(() => {
        if (form.paymentDate) {
            const date = new Date(form.paymentDate);
            date.setMonth(date.getMonth() + 1);

            setForm((prev) => ({
                ...prev,
                nextPaymentDate: date.toISOString().split("T")[0]
            }));
        }
    }, [form.paymentDate]);

    function updateField(key, value) {
        setForm({ ...form, [key]: value });
    }

    async function submit() {
        try {
            await API.post("/api/payments", form);
            onSuccess();
            close();
        } catch (err) {
            console.log(err);
            alert("Error creating payment");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto border border-gray-100">

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <FiCreditCard className="text-indigo-600 text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Add Payment</h2>
                            <p className="text-gray-500 text-sm">For {user.firstName} {user.lastName}</p>
                        </div>
                    </div>
                    <button
                        onClick={close}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                    >
                        <FiX className="text-gray-500 text-xl" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* User Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiUser className="mr-2 text-indigo-500" />
                            User Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">User ID</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                                    {form.userId}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Email</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 flex items-center">
                                    <FiMail className="mr-2 text-gray-400" />
                                    {form.email}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Name</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                                    {form.name}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Currency</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                                    USD
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiTag className="mr-2 text-indigo-500" />
                            Plan Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Plan Name</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    value={form.planName}
                                    onChange={(e) => updateField("planName", e.target.value)}
                                >
                                    <option value="">Select Plan</option>
                                    <option value="Free">Free</option>
                                    <option value="Essential">Essential</option>
                                    <option value="Basic">Basic</option>
                                    <option value="Premium">Premium</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Plan Type</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                                    Monthly
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Amount</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={(e) => updateField("amount", e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Plan Price</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiDollarSign className="text-gray-400" />
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={(e) => updateField("planPrice", e.target.value)}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Discount</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-400">%</span>
                                    </div>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={(e) => updateField("discount", e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Provider</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700">
                                    Stripe
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Credits */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiCreditCard className="mr-2 text-indigo-500" />
                            Credits
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Email Send Credits</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("emailSendCredits", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Email Verification Credits</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("emailVerificationCredits", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">SMS Credits</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("smsCredits", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">WhatsApp Credits</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("whatsappCredits", e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiCreditCard className="mr-2 text-indigo-500" />
                            Payment Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Payment Method</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("paymentMethod", e.target.value)}
                                    placeholder="e.g. Visa, Mastercard"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Card Last 4</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                    onChange={(e) => updateField("cardLast4", e.target.value)}
                                    placeholder="1234"
                                />
                            </div>
                            <div className="space-y-1 md:col-span-2">
                                <label className="text-sm font-medium text-gray-500">Billing Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiMapPin className="text-gray-400" />
                                    </div>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        onChange={(e) => updateField("billingAddress", e.target.value)}
                                        placeholder="123 Main St, City, Country"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Payment Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        value={form.paymentDate}
                                        onChange={(e) => updateField("paymentDate", e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Next Payment Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiCalendar className="text-gray-400" />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 bg-gray-50 text-gray-700"
                                        value={form.nextPaymentDate}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Identifiers */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                            <FiTag className="mr-2 text-indigo-500" />
                            Identifiers
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Transaction ID</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-mono text-sm">
                                    {form.transactionId}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-gray-500">Invoice ID</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-700 font-mono text-sm">
                                    {form.customInvoiceId}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                            onClick={submit}
                        >
                            <FiCreditCard className="mr-2" />
                            Create Payment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
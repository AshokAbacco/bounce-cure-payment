// File: client/src/components/PaymentTable.jsx
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2, FiUser, FiMail, FiCreditCard, FiDollarSign, FiCalendar, FiTag, FiMessageSquare, FiMessageCircle, FiSend } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function PaymentTable({ payments, onEdit, onDelete, searchTerm }) {
  const [expanded, setExpanded] = useState(null);

  function toggleExpand(id) {
    setExpanded(expanded === id ? null : id);
  }

  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'success' || statusLower === 'succeeded') {
      return 'bg-green-100 text-green-800';
    } else if (statusLower === 'pending') {
      return 'bg-yellow-100 text-yellow-800';
    } else if (statusLower === 'failed') {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-gray-100 text-gray-800';
    }
  };

  // Convert INR to USD (assuming 1 USD = 75 INR for this example)
  const convertToUSD = (amount, currency) => {
    if (currency === 'INR') {
      return (amount / 75).toFixed(2);
    }
    return amount;
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(payment => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      (payment.name && payment.name.toLowerCase().includes(searchLower)) ||
      (payment.email && payment.email.toLowerCase().includes(searchLower)) ||
      (payment.planName && payment.planName.toLowerCase().includes(searchLower)) ||
      (payment.status && payment.status.toLowerCase().includes(searchLower)) ||
      (payment.id && payment.id.toString().includes(searchLower)) ||
      (payment.userId && payment.userId.toString().includes(searchLower))
    );
  });

  return (
    <div className="space-y-4">
      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <FiCreditCard className="text-gray-400 text-2xl" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            {searchTerm ? "No payments match your search" : "No payments found"}
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search criteria" : "There are no payment records available"}
          </p>
        </div>
      ) : (
        filteredPayments.map((p) => {
          const amountInUSD = convertToUSD(p.amount, p.currency);
          const planPriceInUSD = convertToUSD(p.planPrice, p.currency);

          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
            >
              <div className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-800 font-semibold">
                        {p.name ? p.name.charAt(0) : p.email.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{p.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(p.status)}`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <FiMail className="mr-1" size={14} />
                        {p.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiTag className="mr-1" size={14} />
                        {p.planName} • ID: {p.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-lg">
                      <FiSend className="text-blue-500 mr-1" size={14} />
                      <span className="text-sm font-medium text-blue-700">Email: {p.emailSendCredits}</span>
                    </div>
                    <div className="flex items-center bg-green-50 px-3 py-1.5 rounded-lg">
                      <FiMessageSquare className="text-green-500 mr-1" size={14} />
                      <span className="text-sm font-medium text-green-700">SMS: {p.smsCredits}</span>
                    </div>
                    <div className="flex items-center bg-purple-50 px-3 py-1.5 rounded-lg">
                      <FiMessageCircle className="text-purple-500 mr-1" size={14} />
                      <span className="text-sm font-medium text-purple-700">WA: {p.whatsappCredits}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="p-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      {expanded === p.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expanded === p.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50 border-t border-gray-200"
                  >
                    <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiDollarSign className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Amount</p>
                          <p className="font-medium">${amountInUSD} {p.currency !== 'USD' && `(${p.amount} ${p.currency})`}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiTag className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Plan Price</p>
                          <p className="font-medium">${planPriceInUSD} {p.currency !== 'USD' && `(${p.planPrice} ${p.currency})`}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiCalendar className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Plan Type</p>
                          <p className="font-medium">{p.planType}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiCreditCard className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Discount</p>
                          <p className="font-medium">{p.discount}%</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiUser className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Provider</p>
                          <p className="font-medium">{p.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiCreditCard className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Transaction ID</p>
                          <p className="font-medium text-sm">{p.transactionId}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiCreditCard className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Invoice ID</p>
                          <p className="font-medium text-sm">{p.customInvoiceId}</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-white rounded-lg border border-gray-200">
                        <FiCreditCard className="text-indigo-500 mr-2" />
                        <div>
                          <p className="text-xs text-gray-500">Email Verify</p>
                          <p className="font-medium">{p.emailVerificationCredits}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })
      )}
    </div>
  );
}
// ============================================
// PaymentTable.jsx
// ============================================
import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function PaymentTable({ payments, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  function toggleExpand(id) {
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#c2831f] to-[#a06d1a] text-white">
            <tr>
              <th className="p-4 text-left font-semibold">User ID</th>
              <th className="p-4 text-left font-semibold">Payment ID</th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Plan Name</th>
              <th className="p-4 text-left font-semibold">Email Credits</th>
              <th className="p-4 text-left font-semibold">Verify Credits</th>
              <th className="p-4 text-left font-semibold">SMS Credits</th>
              <th className="p-4 text-left font-semibold">WhatsApp Credits</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Details</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, idx) => (
              <React.Fragment key={p.id}>
                <tr className={`border-t border-gray-200 hover:bg-gray-50 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="p-4 text-sm text-gray-700">{p.userId}</td>
                  <td className="p-4 text-sm text-gray-700 font-medium">{p.id}</td>
                  <td className="p-4 text-sm text-gray-900 font-medium">{p.name}</td>
                  <td className="p-4 text-sm text-gray-600">{p.email}</td>
                  <td className="p-4 text-sm text-gray-900">{p.planName}</td>
                  <td className="p-4 text-sm text-gray-700">{p.emailSendCredits}</td>
                  <td className="p-4 text-sm text-gray-700">{p.emailVerificationCredits}</td>
                  <td className="p-4 text-sm text-gray-700">{p.smsCredits}</td>
                  <td className="p-4 text-sm text-gray-700">{p.whatsappCredits}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${
                        p.status === "paid"
                          ? "bg-green-600"
                          : p.status === "failed"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#c2831f] text-white rounded-lg text-sm font-medium hover:bg-[#a06d1a] transition"
                    >
                      {expanded === p.id ? <FiChevronUp /> : <FiChevronDown />}
                      {expanded === p.id ? "Hide" : "More"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="flex items-center gap-1 px-1 py-1.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition"
                      >
                        <FiEdit2 size={14} />
                       
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className="flex items-center gap-1 px-1 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                      >
                        <FiTrash2 size={14} />
                        
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded === p.id && (
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                    <td colSpan="12" className="p-6">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Plan Type</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.planType}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Plan Price</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.planPrice}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Discount</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.discount}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Invoice ID</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.customInvoiceId}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Provider</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.provider}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Amount</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.amount}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Currency</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.currency}</div>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-gray-200">
                          <span className="text-xs text-gray-500 font-medium">Transaction ID</span>
                          <div className="text-sm text-gray-900 font-semibold mt-1">{p.transactionId}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

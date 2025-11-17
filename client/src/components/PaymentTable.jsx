import React, { useState } from "react";
import { FiChevronDown, FiChevronUp, FiEdit2, FiTrash2 } from "react-icons/fi";

export default function PaymentTable({ payments, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(null);

  function toggleExpand(id) {
    setExpanded(expanded === id ? null : id);
  }

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-200">
      {/* min height + max height + vertical scrolling */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px] min-h-[350px]">

        <table className="w-full">
          <thead className="bg-gradient-to-r from-[#c2831f] to-[#a06d1a] text-white sticky top-0 z-20">
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
              <th className="p-4 text-left font-semibold">More Details</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>


          <tbody>
            {payments.map((p, idx) => (
              <React.Fragment key={p.id}>
                <tr className="border-t border-gray-200 hover:bg-gray-50 transition">
                  <td className="p-4">{p.userId}</td>
                  <td className="p-4">{p.id}</td>
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{p.email}</td>
                  <td className="p-4">{p.planName}</td>
                  <td className="p-4">{p.emailSendCredits}</td>
                  <td className="p-4">{p.emailVerificationCredits}</td>
                  <td className="p-4">{p.smsCredits}</td>
                  <td className="p-4">{p.whatsappCredits}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs">
                      {p.status}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => toggleExpand(p.id)}
                      className="px-3 py-1 bg-[#c2831f] text-white rounded-lg"
                    >
                      {expanded === p.id ? <FiChevronUp /> : <FiChevronDown />}
                    </button>
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(p)}
                        className="px-2 py-1 bg-black text-white rounded-lg"
                      >
                        <FiEdit2 size={14} />
                      </button>

                      <button
                        onClick={() => onDelete(p.id)}
                        className="px-2 py-1 bg-red-600 text-white rounded-lg"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>

                {expanded === p.id && (
                  <tr className="bg-gray-50">
                    <td colSpan="12" className="p-6">
                      <div className="grid grid-cols-4 gap-4">
                        <div>Plan Type: {p.planType}</div>
                        <div>Plan Price: {p.planPrice}</div>
                        <div>Discount: {p.discount}</div>
                        <div>Invoice ID: {p.customInvoiceId}</div>
                        <div>Provider: {p.provider}</div>
                        <div>Amount: {p.amount}</div>
                        <div>Currency: {p.currency}</div>
                        <div>Transaction: {p.transactionId}</div>
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

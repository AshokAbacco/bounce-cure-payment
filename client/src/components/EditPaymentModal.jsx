import React, { useState } from "react";
import API from "../utils/api";
import { FiX, FiSave, FiUser, FiMail, FiCreditCard, FiDollarSign, FiCalendar, FiTag, FiMapPin, FiSettings } from "react-icons/fi";

export default function EditPaymentModal({ data, close }) {
  const [form, setForm] = useState({ ...data });

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    try {
      const res = await API.put(`/api/payments/${data.id}`, form);

      if (res.data.success) {
        alert("Payment updated successfully!");
      } else {
        alert("Payment was updated but no confirmation was returned.");
      }

      close(true); // pass true so parent knows to refresh

    } catch (err) {
      console.error(err);
      alert("Error updating payment!");
    }
  }


  // Group form fields into logical sections
  const userFields = ['userId', 'email', 'name'];
  const planFields = ['planName', 'planType', 'planPrice', 'discount'];
  const creditFields = ['emailSendCredits', 'emailVerificationCredits', 'smsCredits', 'whatsappCredits'];
  const paymentFields = ['provider', 'currency', 'amount', 'paymentMethod', 'cardLast4', 'billingAddress', 'paymentDate', 'nextPaymentDate'];
  const statusFields = ['status', 'notified'];
  const idFields = ['transactionId', 'customInvoiceId'];

  const renderField = (key) => {
    // Skip rendering for certain fields that we'll handle specially
    if (key === 'id') return null;

    // Determine the appropriate icon for each field
    let icon = <FiSettings className="text-gray-400" />;
    if (userFields.includes(key)) icon = <FiUser className="text-gray-400" />;
    else if (planFields.includes(key)) icon = <FiTag className="text-gray-400" />;
    else if (creditFields.includes(key)) icon = <FiCreditCard className="text-gray-400" />;
    else if (paymentFields.includes(key)) {
      if (key === 'amount' || key === 'planPrice') icon = <FiDollarSign className="text-gray-400" />;
      else if (key === 'paymentDate' || key === 'nextPaymentDate') icon = <FiCalendar className="text-gray-400" />;
      else if (key === 'billingAddress') icon = <FiMapPin className="text-gray-400" />;
      else icon = <FiCreditCard className="text-gray-400" />;
    }
    else if (idFields.includes(key)) icon = <FiCreditCard className="text-gray-400" />;
    else if (key === 'email') icon = <FiMail className="text-gray-400" />;

    // Format the label
    const label = key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase());

    // Determine input type
    let inputType = "text";
    if (key.includes('Date')) inputType = "date";
    else if (key.includes('Price') || key.includes('amount') || key.includes('discount')) inputType = "number";
    else if (key === 'status') {
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            {icon}
            <span className="ml-2">{label}</span>
          </label>
          <select
            value={form[key] ?? ""}
            onChange={(e) => updateField(key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="success">Success</option>
            <option value="succeeded">Succeeded</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      );
    }
    else if (key === 'notified') {
      return (
        <div key={key} className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form[key] ?? false}
              onChange={(e) => updateField(key, e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Notified</span>
          </label>
        </div>
      );
    }

    return (
      <div key={key} className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
          {icon}
          <span className="ml-2">{label}</span>
        </label>
        <input
          type={inputType}
          value={form[key] ?? ""}
          onChange={(e) => updateField(key, e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-white/20 p-2 rounded-lg mr-4">
              <FiCreditCard className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-white">Edit Payment</h2>
          </div>
          <button
            onClick={close}
            className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-wrap -mx-3">
            {/* User Information */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiUser className="mr-2 text-indigo-500" />
                  User Information
                </h3>
                {userFields.map(renderField)}
              </div>
            </div>

            {/* Plan Details */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiTag className="mr-2 text-indigo-500" />
                  Plan Details
                </h3>
                {planFields.map(renderField)}
              </div>
            </div>

            {/* Credits */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiCreditCard className="mr-2 text-indigo-500" />
                  Credits
                </h3>
                {creditFields.map(renderField)}
              </div>
            </div>

            {/* Payment Information */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiCreditCard className="mr-2 text-indigo-500" />
                  Payment Information
                </h3>
                {paymentFields.map(renderField)}
              </div>
            </div>

            {/* Status */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiSettings className="mr-2 text-indigo-500" />
                  Status
                </h3>
                {statusFields.map(renderField)}
              </div>
            </div>

            {/* Identifiers */}
            <div className="w-full md:w-1/2 px-3 mb-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                  <FiCreditCard className="mr-2 text-indigo-500" />
                  Identifiers
                </h3>
                {idFields.map(renderField)}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={close}
            className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          >
            <FiSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
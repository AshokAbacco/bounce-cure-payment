// ============================================
// EditPaymentModal.jsx
// ============================================
import React, { useState } from "react";
import API from "../utils/api";
import { FiX, FiSave } from "react-icons/fi";

export default function EditPaymentModal({ data, close }) {
  const [form, setForm] = useState({ ...data });

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    await API.put(`/payments/${data.id}`, form);
    close();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[550px] max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-[#c2831f] to-[#a06d1a] p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Payment Details</h2>
          <button
            onClick={close}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(form).map((key) =>
              key === "id" ? null : (
                <div key={key} className="col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <input
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c2831f] focus:border-transparent transition"
                    value={form[key] ?? ""}
                    onChange={(e) => updateField(key, e.target.value)}
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c2831f] text-white rounded-lg font-semibold hover:bg-[#a06d1a] transition shadow-md"
            onClick={save}
          >
            <FiSave />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
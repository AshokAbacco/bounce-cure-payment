import React, { useState } from "react";
import API from "../utils/api";
import { FiX, FiSave } from "react-icons/fi";

export default function EditPaymentModal({ data, close }) {
  const [form, setForm] = useState({ ...data });

  function updateField(field, value) {
    setForm({ ...form, [field]: value });
  }

  async function save() {
    await API.put(`/api/payments/${data.id}`, form);
    close();
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[550px] max-h-[90vh] overflow-hidden border border-gray-200">
        <div className="bg-gradient-to-r from-[#c2831f] to-[#a06d1a] p-5 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Edit Payment</h2>

          <button onClick={close} className="text-white p-2">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {Object.keys(form).map((key) =>
            key === "id" ? null : (
              <div key={key} className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>

                <input
                  value={form[key] ?? ""}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )
          )}
        </div>

        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button onClick={close} className="px-5 py-2 bg-white border rounded-lg">
            Cancel
          </button>

          <button
            onClick={save}
            className="px-5 py-2 bg-[#c2831f] text-white rounded-lg flex items-center gap-2"
          >
            <FiSave />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

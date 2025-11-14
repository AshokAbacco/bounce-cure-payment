// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../utils/api";
import PaymentTable from "../components/PaymentTable";
import EditPaymentModal from "../components/EditPaymentModal";
import { FiLogOut, FiDollarSign, FiAlertTriangle, FiX } from "react-icons/fi";

export default function Dashboard() {
  const nav = useNavigate();
  const [payments, setPayments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");
    setAuthToken(token);
    loadPayments();
  }, []);

  async function loadPayments() {
    try {
      const { data } = await API.get("/payments");
      setPayments(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function confirmDelete() {
    await API.delete(`/payments/${deleteModal}`);
    setDeleteModal(null);
    loadPayments();
  }

  function confirmLogout() {
    localStorage.removeItem("token");
    nav("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#c2831f] to-[#a06d1a] rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-white text-xl" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                Bouncer Cure Payment Dashboard
              </h1>
            </div>

            <button
              className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition shadow-md w-full sm:w-auto justify-center"
              onClick={() => setLogoutModal(true)}
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>


        <PaymentTable
          payments={payments}
          onEdit={setEditData}
          onDelete={(id) => setDeleteModal(id)}
        />

        {editData && (
          <EditPaymentModal
            data={editData}
            close={() => {
              setEditData(null);
              loadPayments();
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[450px] border border-gray-200 overflow-hidden">
              <div className="bg-red-600 p-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <FiAlertTriangle className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-white">Delete Payment</h3>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-2">Are you sure you want to delete this payment?</p>
                <p className="text-gray-500 text-sm">Payment ID: <span className="font-semibold text-gray-700">{deleteModal}</span></p>
                <p className="text-red-600 text-sm mt-3 font-medium">This action cannot be undone.</p>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
                  onClick={() => setDeleteModal(null)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition shadow-md"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {logoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-[450px] border border-gray-200 overflow-hidden">
              <div className="bg-[#c2831f] p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FiLogOut className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Confirm Logout</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 text-lg mb-2">Are you sure you want to logout?</p>
                <p className="text-gray-500 text-sm">You will need to login again to access the dashboard.</p>
              </div>

              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                <button
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-100 transition"
                  onClick={() => setLogoutModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition shadow-md"
                  onClick={confirmLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// File: client/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API, { setAuthToken } from "../utils/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import PaymentTable from "../components/PaymentTable";
import EditPaymentModal from "../components/EditPaymentModal";
import { FiAlertTriangle, FiCreditCard, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Dashboard() {
  const nav = useNavigate();
  const [payments, setPayments] = useState([]);
  const [editData, setEditData] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [logoutModal, setLogoutModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return nav("/login");
    setAuthToken(token);
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    try {
      const { data } = await API.get("/api/payments");
      setPayments(data);
    } catch (error) {
      console.error("Error loading payments:", error);
    } finally {
      setLoading(false);
    }
  }

  // Convert INR to USD (assuming 1 USD = 75 INR for this example)
  const convertToUSD = (amount, currency) => {
    if (currency === 'INR') {
      return amount / 75;
    }
    return amount;
  };

  // Calculate statistics
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, payment) => {
    return sum + parseFloat(convertToUSD(payment.amount || 0, payment.currency));
  }, 0);

  // Consider both "success" and "succeeded" as successful payments
  const successPayments = payments.filter(p => {
    const statusLower = p.status.toLowerCase();
    return statusLower === 'success' || statusLower === 'succeeded';
  }).length;

  const successRate = totalPayments > 0 ? Math.round((successPayments / totalPayments) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar setLogoutModal={setLogoutModal} expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <Topbar
        sidebarExpanded={sidebarExpanded}
        setLogoutModal={setLogoutModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        placeholder="Search payments..."
      />

      <div className={`transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'} p-6`}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Dashboard</h1>
          <p className="text-gray-600">Manage and track all payment transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-indigo-100 mr-4">
                <FiCreditCard className="text-indigo-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900">{totalPayments}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 mr-4">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Amount (USD)</p>
                <p className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 mr-4">
                <FiTrendingUp className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{successRate}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 mr-4">
                <FiCreditCard className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Success Payments</p>
                <p className="text-2xl font-bold text-gray-900">{successPayments}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Payment Cards */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200">
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
              <p className="text-gray-600">Loading payments...</p>
            </div>
          </div>
        ) : (
          <PaymentTable
            payments={payments}
            onEdit={setEditData}
            onDelete={(id) => setDeleteModal(id)}
            searchTerm={searchTerm}
          />
        )}
      </div>

      {editData && (
        <EditPaymentModal
          data={editData}
          close={() => {
            setEditData(null);
            loadPayments();
          }}
        />
      )}

      {/* Delete Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <FiAlertTriangle className="text-red-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Confirm Delete</h2>
            </div>

            <p className="text-gray-700 mb-6">
              Are you sure you want to delete payment #{deleteModal}? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setDeleteModal(null)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                onClick={async () => {
                  await API.delete(`/api/payments/${deleteModal}`);
                  setDeleteModal(null);
                  loadPayments();
                }}
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Logout Modal */}
      {logoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
          >
            <h2 className="text-xl font-bold mb-4">Logout Confirmation</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to logout of your account?</p>

            <div className="flex justify-end gap-3">
              <button
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                onClick={() => setLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                onClick={() => {
                  localStorage.removeItem("token");
                  nav("/login");
                }}
              >
                Logout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
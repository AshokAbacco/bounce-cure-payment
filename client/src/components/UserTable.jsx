// File: client/src/components/UserTable.jsx
import React from "react";
import { FiPlus, FiUser, FiMail, FiCalendar, FiMessageSquare, FiMessageCircle, FiUsers, FiSearch } from "react-icons/fi";

export default function UserTable({ users, onAddPayment, searchTerm }) {
    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            user.firstName.toLowerCase().includes(searchLower) ||
            user.lastName.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.plan.toLowerCase().includes(searchLower)
        );
    });

    // Get plan color classes
    const getPlanColor = (plan) => {
        switch (plan) {
            case 'Premium': return 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white';
            case 'Basic': return 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white';
            case 'Essential': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
            default: return 'bg-gradient-to-r from-gray-500 to-gray-700 text-white';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white">User Management</h2>
                        <p className="text-indigo-200 text-sm mt-1">Manage your users and their subscriptions</p>
                    </div>
                    <div className="mt-3 md:mt-0 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                        <div className="text-white text-sm font-medium">
                            {filteredUsers.length} <span className="text-indigo-200">of</span> {users.length} <span className="text-indigo-200">users</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-4">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center mb-4">
                            <FiSearch className="text-indigo-400 text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">No users found</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto">
                            {searchTerm
                                ? "No users match your search criteria. Try adjusting your search terms."
                                : "There are no users registered yet. Invite users to get started."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredUsers.map((user) => (
                            <div
                                key={user.id}
                                className="group bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                            >
                                <div className="p-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        {/* User Info Section */}
                                        <div className="flex items-center mb-3 sm:mb-0 sm:w-2/5">
                                            <div className="relative flex-shrink-0">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm">
                                                    <span className="text-white font-bold text-sm">
                                                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                                            </div>
                                            <div className="ml-3 min-w-0">
                                                <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                                                    {user.firstName} {user.lastName}
                                                </h3>
                                                <div className="flex items-center mt-0.5 text-gray-500 text-xs">
                                                    <FiMail className="mr-1" size={12} />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                                <div className="mt-1">
                                                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                                                        {user.plan}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Credits Section */}
                                        <div className="sm:w-2/5 mb-3 sm:mb-0">
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                                                {/* Email Card */}
                                                <div className="bg-blue-50 rounded-lg p-2 text-center transition-transform group-hover:scale-105">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-1">
                                                        <FiMail className="text-blue-600 text-xs" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{user.emailLimit}</span>
                                                    <div className="text-xs text-gray-500">Email</div>
                                                </div>

                                                {/* SMS Card */}
                                                <div className="bg-green-50 rounded-lg p-2 text-center transition-transform group-hover:scale-105">
                                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-1">
                                                        <FiMessageSquare className="text-green-600 text-xs" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{user.smsCredits}</span>
                                                    <div className="text-xs text-gray-500">SMS</div>
                                                </div>

                                                {/* WhatsApp Card */}
                                                <div className="bg-purple-50 rounded-lg p-2 text-center transition-transform group-hover:scale-105">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-1">
                                                        <FiMessageCircle className="text-purple-600 text-xs" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{user.whatsappCredits}</span>
                                                    <div className="text-xs text-gray-500">WhatsApp</div>
                                                </div>

                                                {/* Contact Limit Card */}
                                                <div className="bg-amber-50 rounded-lg p-2 text-center transition-transform group-hover:scale-105">
                                                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-1">
                                                        <FiUsers className="text-amber-600 text-xs" />
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-800">{user.contactLimit}</span>
                                                    <div className="text-xs text-gray-500">Contacts</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions Section */}
                                        <div className="sm:w-1/5 flex flex-col sm:items-end justify-between">
                                            <div className="flex items-center text-xs text-gray-500 mb-2 sm:mb-0">
                                                <FiCalendar className="mr-1" size={12} />
                                                <span>{formatDate(user.createdAt)}</span>
                                            </div>
                                            <button
                                                className="flex items-center justify-center gap-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
                                                onClick={() => onAddPayment(user)}
                                            >
                                                <FiPlus size={12} />
                                                Add Payment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
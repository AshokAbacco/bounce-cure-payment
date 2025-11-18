// File: client/src/components/UserTable.jsx
import React from "react";
import { FiPlus, FiUser, FiMail, FiCalendar, FiCreditCard } from "react-icons/fi";

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

    return (
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Users</h2>
                <div className="mt-4 md:mt-0 text-sm text-gray-500">
                    {filteredUsers.length} of {users.length} users
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                    <div className="mx-auto w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FiSearch className="text-gray-400 text-3xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                    <p className="text-gray-500">
                        {searchTerm ? "No users match your search criteria" : "There are no users registered yet"}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-700">
                                <th className="p-3 font-semibold">User</th>
                                <th className="p-3 font-semibold">Plan</th>
                                <th className="p-3 font-semibold">Credits</th>
                                <th className="p-3 font-semibold">Joined</th>
                                <th className="p-3 font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="p-3">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                                                <span className="text-indigo-800 font-semibold">
                                                    {u.firstName.charAt(0)}{u.lastName.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{u.firstName} {u.lastName}</div>
                                                <div className="text-sm text-gray-500 flex items-center">
                                                    <FiMail className="mr-1" size={14} />
                                                    {u.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.plan === 'Premium' ? 'bg-purple-100 text-purple-800' :
                                                u.plan === 'Basic' ? 'bg-blue-100 text-blue-800' :
                                                    u.plan === 'Essential' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                            }`}>
                                            {u.plan}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-sm">
                                                <FiCreditCard className="mr-1 text-gray-400" size={14} />
                                                <span className="text-gray-600">Email: </span>
                                                <span className="font-medium ml-1">{u.emailLimit}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <FiCreditCard className="mr-1 text-gray-400" size={14} />
                                                <span className="text-gray-600">SMS: </span>
                                                <span className="font-medium ml-1">{u.smsCredits}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <FiCreditCard className="mr-1 text-gray-400" size={14} />
                                                <span className="text-gray-600">WhatsApp: </span>
                                                <span className="font-medium ml-1">{u.whatsappCredits}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <FiCalendar className="mr-1" size={14} />
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <button
                                            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                                            onClick={() => onAddPayment(u)}
                                        >
                                            <FiPlus />
                                            Add Payment
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
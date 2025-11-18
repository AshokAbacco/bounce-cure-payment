// File: client/src/pages/Users.jsx

import React, { useEffect, useState } from "react";
import API, { setAuthToken } from "../utils/api";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import UserTable from "../components/UserTable";
import AddPaymentModal from "../components/AddPaymentModal";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sidebarExpanded, setSidebarExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    async function loadUsers() {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            setAuthToken(token);

            const { data } = await API.get("/api/users");
            setUsers(data);
        } catch (error) {
            console.error("Error loading users:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar setLogoutModal={() => { }} expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
            <Topbar
                sidebarExpanded={sidebarExpanded}
                setLogoutModal={() => { }}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <div className={`transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'} p-6`}>
                {loading ? (
                    <div className="bg-white shadow-lg rounded-xl p-12 border border-gray-200">
                        <div className="flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                            <p className="text-gray-600">Loading users...</p>
                        </div>
                    </div>
                ) : (
                    <UserTable
                        users={users}
                        onAddPayment={(user) => setSelectedUser(user)}
                        searchTerm={searchTerm}
                    />
                )}
            </div>

            {selectedUser && (
                <AddPaymentModal
                    user={selectedUser}
                    close={() => setSelectedUser(null)}
                    onSuccess={loadUsers}
                />
            )}
        </div>
    );
}
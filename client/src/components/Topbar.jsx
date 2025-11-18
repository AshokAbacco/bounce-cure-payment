// File: client/src/components/Topbar.jsx
import { useState } from "react";
import { FiSearch, FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";

export default function Topbar({ sidebarExpanded, setLogoutModal, searchTerm, setSearchTerm, placeholder = "Search..." }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        setLogoutModal(true);
    };

    return (
        <div className={`bg-white border-b border-gray-200 shadow-sm transition-all duration-300 ${sidebarExpanded ? 'md:ml-64' : 'md:ml-16'
            }`}>
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Bouncer Cure Admin Dashboard
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">Welcome back, Admin</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search bar */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder={placeholder}
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>

                        {/* Settings dropdown */}
                        <div className="relative">
                            <button
                                className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={toggleDropdown}
                            >
                                <FiSettings className="text-xl" />
                                <FiChevronDown className={`text-sm transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            // Navigate to settings page or open settings modal
                                        }}
                                    >
                                        <FiSettings className="mr-3 text-gray-500" />
                                        Settings
                                    </button>
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut className="mr-3" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User profile */}
                        <div className="flex items-center space-x-3 cursor-pointer group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <span className="text-indigo-800 font-semibold">AD</span>
                                </div>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="hidden md:block">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors">Admin User</p>
                                <p className="text-xs text-gray-500">Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
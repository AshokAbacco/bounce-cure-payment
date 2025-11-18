import { useState } from "react";
import { FiDollarSign, FiUsers, FiLogOut, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function Sidebar({ setLogoutModal }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div
            className={`fixed top-0 left-0 h-screen bg-white shadow-xl border-r border-gray-200 z-10 transition-all duration-300 ease-in-out ${expanded ? 'w-64' : 'w-16'
                }`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                    {expanded ? (
                        <h2 className="text-xl font-bold text-gray-900 transition-opacity duration-300">
                            Bouncer Cure Admin
                        </h2>
                    ) : (
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">BC</span>
                        </div>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                        {expanded ? (
                            <FiChevronLeft className="text-gray-500 text-lg" />
                        ) : (
                            <FiChevronRight className="text-gray-500 text-lg" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    <NavLink
                        to="/users"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg font-medium transition-all duration-300 ${isActive
                                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                                : "text-gray-700 hover:bg-gray-100"
                            } ${expanded ? 'gap-3' : 'justify-center'}`
                        }
                    >
                        <FiUsers className="text-lg flex-shrink-0" />
                        {expanded && (
                            <span className="transition-opacity duration-300 opacity-100">
                                Users
                            </span>
                        )}
                    </NavLink>

                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center p-3 rounded-lg font-medium transition-all duration-300 ${isActive
                                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600"
                                : "text-gray-700 hover:bg-gray-100"
                            } ${expanded ? 'gap-3' : 'justify-center'}`
                        }
                    >
                        <FiDollarSign className="text-lg flex-shrink-0" />
                        {expanded && (
                            <span className="transition-opacity duration-300 opacity-100">
                                Payments
                            </span>
                        )}
                    </NavLink>
                </nav>

                {/* Logout Button */}
                <div className="p-2 border-t border-gray-100">
                    <button
                        className={`flex items-center w-full p-3 rounded-lg font-medium transition-all duration-300 ${expanded
                                ? "text-red-600 hover:bg-red-50 gap-3"
                                : "text-red-600 hover:bg-red-50 justify-center"
                            }`}
                        onClick={() => setLogoutModal(true)}
                    >
                        <FiLogOut className="text-lg flex-shrink-0" />
                        {expanded && (
                            <span className="transition-opacity duration-300 opacity-100">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
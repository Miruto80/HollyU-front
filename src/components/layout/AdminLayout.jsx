import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../admin/Sidebar";
import AdminNav from "../admin/AdminNav";

export default function AdminLayout () {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="admin-layout">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="admin-content">

                <AdminNav onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} />

                <main className="p-4">

                    <Outlet />

                </main>

            </div>

            <div
                className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
            />

        </div>
    );
};
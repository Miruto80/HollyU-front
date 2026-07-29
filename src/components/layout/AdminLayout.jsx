import { Outlet } from "react-router-dom";

import Sidebar from "../admin/Sidebar";
import AdminNav from "../admin/AdminNav";

export default function AdminLayout () {
    return (
        <div className="admin-layout">

            <Sidebar />

            <div className="admin-content">

                <AdminNav />

                <main className="p-4">

                    <Outlet />

                </main>

            </div>

        </div>
    );
};
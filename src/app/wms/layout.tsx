"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function WmsLayout({ children }: { children: React.ReactNode }) {
    const { user, logout } = useAuth();

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
            {/* Top Navbar */}
            <nav style={{ background: "var(--color-surface)", borderBottom: "1px solid var(--color-border)", padding: "0 2rem", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <Link href="/wms" style={{ fontWeight: "bold", fontSize: "1.25rem", color: "var(--color-primary)" }}>
                        Clockwise WMS
                    </Link>
                    <div style={{ display: "flex", gap: "1rem" }}>
                        <Link href="/wms/employees" style={{ color: "var(--color-text)" }}>Employees</Link>
                        <Link href="/wms/clients" style={{ color: "var(--color-text)" }}>Clients</Link>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span className="text-sm text-muted">{user?.name}</span>
                    <button onClick={logout} className="text-sm" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)" }}>Logout</button>
                </div>
            </nav>

            <main className="container" style={{ padding: "2rem" }}>
                {children}
            </main>
        </div>
    );
}

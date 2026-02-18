"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WmsDashboard() {
    const { user, loading, loginManager } = useAuth();
    const router = useRouter();

    // Simple auto-login for demo if already logged in or show login form
    useEffect(() => {
        if (!loading && !user) {
            // Show login form (implemented inline for speed)
        }
    }, [user, loading]);

    if (!user) {
        return (
            <div style={{ maxWidth: "400px", margin: "4rem auto" }}>
                <h1 className="text-center" style={{ marginBottom: "2rem" }}>Manager Login</h1>
                <div className="card">
                    <button
                        className="btn btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => loginManager('admin@clockwise.com')} // Mock Login
                    >
                        Login as Admin (Demo)
                    </button>
                    <p className="text-sm text-center text-muted" style={{ marginTop: "1rem" }}>
                        Simulation: Logs in as Admin User
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user.name}</p>
            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: "2rem" }}>
                <div className="card">
                    <h3>Active Employees</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>24</p>
                </div>
                <div className="card">
                    <h3>Clients</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>8</p>
                </div>
                <div className="card">
                    <h3>Shifts Today</h3>
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>12</p>
                </div>
            </div>
        </div>
    );
}

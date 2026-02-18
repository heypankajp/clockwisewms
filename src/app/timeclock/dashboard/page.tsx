"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { Client, AttendanceRecord } from "@/lib/types";

// Mock Distance Calc
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export default function TimeClockDashboard() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    // Location State
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [distance, setDistance] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [status, setStatus] = useState("Loading...");

    const [activeRecord, setActiveRecord] = useState<AttendanceRecord | null>(null);

    useEffect(() => {
        if (!user) router.push("/timeclock");
        db.getClients().then(setClients);
    }, [user]);

    // Geolocation Watcher
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setStatus("Location Acquired");
                },
                (err) => setStatus("Location Denied: " + err.message)
            );
        }
    }, []);

    // Check Geofence when client selected
    useEffect(() => {
        if (selectedClient && location) {
            const dist = getDistance(location.lat, location.lng, selectedClient.latitude, selectedClient.longitude);
            setDistance(dist);
        }
    }, [selectedClient, location]);

    const handleClockIn = async () => {
        if (!selectedClient || !location || !user) return;

        // Strict Geofence
        if (distance && distance > selectedClient.geoFenceRadius) {
            setError(`Too far from site! You are ${Math.round(distance)}m away (Max: ${selectedClient.geoFenceRadius}m).`);
            return;
        }

        const record: AttendanceRecord = {
            id: Math.random().toString(),
            employeeId: user.id,
            clientId: selectedClient.id,
            clockInTime: new Date().toISOString(),
            clockInLocation: location,
            method: "MOBILE_APP",
            isVerified: true
        };

        await db.recordAttendance(record);
        setActiveRecord(record);
    };

    const handleClockOut = async () => {
        // In real app, update record. Mock just resets for demo loop.
        setActiveRecord(null);
        setSelectedClient(null);
    };

    if (!user) return null;

    return (
        <div style={{ padding: "1rem", background: "#f1f5f9", minHeight: "100vh" }}>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Hi, {user.name}</h2>
                <button onClick={logout} style={{ background: "none", border: "none", color: "red" }}>Exit</button>
            </div>

            {!activeRecord ? (
                <div className="card">
                    <h3 style={{ marginBottom: "1rem" }}>Select Job Site</h3>
                    <select
                        className="input"
                        onChange={(e) => {
                            const c = clients.find(c => c.id === e.target.value);
                            setSelectedClient(c || null);
                            setError(""); // Clear previous errors
                        }}
                    >
                        <option value="">-- Choose Site --</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>

                    {selectedClient && (
                        <div style={{ marginTop: "1rem", textAlign: "center" }}>
                            <p style={{ margin: "1rem 0", color: "#64748b" }}>
                                Status: {status}
                            </p>

                            {location && (
                                <div style={{ padding: "1rem", background: "#e2e8f0", borderRadius: "10px", marginBottom: "1rem" }}>
                                    {distance !== null ? (
                                        <div style={{ color: distance <= selectedClient.geoFenceRadius ? "green" : "red", fontWeight: "bold" }}>
                                            {distance <= selectedClient.geoFenceRadius ? "✅ Inside Zone" : "❌ Outside Zone"} ({Math.round(distance)}m)
                                        </div>
                                    ) : "Calculating..."}
                                </div>
                            )}

                            {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

                            <button
                                className="btn btn-primary"
                                style={{ width: "100%", padding: "1.5rem", fontSize: "1.25rem" }}
                                onClick={handleClockIn}
                            >
                                CLOCK IN
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
                    <h1 style={{ fontSize: "3rem", color: "green", marginBottom: "1rem" }}>On Clock</h1>
                    <p className="text-muted">{selectedClient?.name}</p>
                    <p style={{ margin: "2rem 0", fontSize: "1.5rem" }}>
                        {new Date(activeRecord.clockInTime).toLocaleTimeString()}
                    </p>
                    <button
                        className="btn"
                        style={{ background: "#ef4444", color: "white", width: "100%", padding: "1.5rem" }}
                        onClick={handleClockOut}
                    >
                        CLOCK OUT
                    </button>
                </div>
            )}

            {/* Debug Helper for Demo */}
            <div style={{ marginTop: "3rem", opacity: 0.5, fontSize: "0.8rem", textAlign: "center" }}>
                <button onClick={() => setLocation({ lat: 40.7128, lng: -74.0060 })}>
                    [Teleport to Default Site]
                </button>
            </div>
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Client } from "@/lib/types";

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Client>>({ geoFenceRadius: 50, breakDurationMinutes: 30, autoClockOutMinutes: 600 });

    useEffect(() => {
        db.getClients().then(setClients);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        const newClient: Client = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            address: formData.address || "",
            latitude: Number(formData.latitude) || 0,
            longitude: Number(formData.longitude) || 0,
            geoFenceRadius: Number(formData.geoFenceRadius),
            breakDurationMinutes: Number(formData.breakDurationMinutes),
            autoClockOutMinutes: Number(formData.autoClockOutMinutes)
        };

        await db.createClient(newClient);
        setClients(await db.getClients());
        setIsModalOpen(false);
        setFormData({ geoFenceRadius: 50, breakDurationMinutes: 30, autoClockOutMinutes: 600 });
    };

    return (
        <div>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Clients</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Client</button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {clients.map(client => (
                    <div key={client.id} className="card">
                        <h3>{client.name}</h3>
                        <p className="text-muted" style={{ margin: "0.5rem 0" }}>{client.address}</p>
                        <div style={{ background: "var(--color-background)", padding: "1rem", borderRadius: "var(--radius-md)", fontSize: "0.9rem" }}>
                            <p><strong>Geo-Fence:</strong> {client.geoFenceRadius}m</p>
                            <p><strong>Auto Clock-out:</strong> {client.autoClockOutMinutes / 60} hrs</p>
                            <p><strong>Breaks:</strong> {client.breakDurationMinutes}m</p>
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="card" style={{ width: "500px", maxHeight: "90vh", overflowY: "auto" }}>
                        <h2 style={{ marginBottom: "1rem" }}>Configure Client</h2>
                        <form onSubmit={handleSave}>
                            <input
                                className="input" placeholder="Client Name" required
                                value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                className="input" placeholder="Address" required
                                value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })}
                            />
                            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <div>
                                    <label className="text-sm">Latitude</label>
                                    <input className="input" type="number" step="any" value={formData.latitude} onChange={e => setFormData({ ...formData, latitude: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm">Longitude</label>
                                    <input className="input" type="number" step="any" value={formData.longitude} onChange={e => setFormData({ ...formData, longitude: Number(e.target.value) })} />
                                </div>
                            </div>
                            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                                <div>
                                    <label className="text-sm">Radius (m)</label>
                                    <input className="input" type="number" value={formData.geoFenceRadius} onChange={e => setFormData({ ...formData, geoFenceRadius: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm">Auto-Out (m)</label>
                                    <input className="input" type="number" value={formData.autoClockOutMinutes} onChange={e => setFormData({ ...formData, autoClockOutMinutes: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-sm">Break (m)</label>
                                    <input className="input" type="number" value={formData.breakDurationMinutes} onChange={e => setFormData({ ...formData, breakDurationMinutes: Number(e.target.value) })} />
                                </div>
                            </div>

                            <div className="flex" style={{ justifyContent: "flex-end", marginTop: "1rem" }}>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Rules</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

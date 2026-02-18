"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { Employee } from "@/lib/types";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newEmployee, setNewEmployee] = useState<Partial<Employee>>({ role: 'EMPLOYEE', paymentMode: 'HOURLY', wage: 15 });

    useEffect(() => {
        db.getEmployees().then(setEmployees);
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEmployee.name || !newEmployee.pinCode) return;

        // Create new employee
        const emp: Employee = {
            id: Math.random().toString(36).substr(2, 9),
            name: newEmployee.name,
            email: newEmployee.email,
            role: newEmployee.role as any,
            pinCode: newEmployee.pinCode,
            wage: Number(newEmployee.wage),
            paymentMode: newEmployee.paymentMode as any,
        };

        await db.createEmployee(emp);
        setEmployees(await db.getEmployees());
        setIsModalOpen(false);
        setNewEmployee({ role: 'EMPLOYEE', paymentMode: 'HOURLY', wage: 15 });
    };

    return (
        <div>
            <div className="flex" style={{ justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h1>Employees</h1>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>+ Add Employee</button>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ background: "var(--color-background)", textAlign: "left" }}>
                        <tr>
                            <th style={{ padding: "1rem" }}>Name</th>
                            <th style={{ padding: "1rem" }}>Role</th>
                            <th style={{ padding: "1rem" }}>PIN</th>
                            <th style={{ padding: "1rem" }}>Wage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                                <td style={{ padding: "1rem" }}>
                                    <div style={{ fontWeight: 500 }}>{emp.name}</div>
                                    <div className="text-sm text-muted">{emp.email || "No Email"}</div>
                                </td>
                                <td style={{ padding: "1rem" }}>
                                    <span style={{
                                        padding: "0.25rem 0.5rem",
                                        borderRadius: "var(--radius-full)",
                                        background: "var(--color-primary-light)",
                                        color: "var(--color-primary-dark)",
                                        fontSize: "0.8rem", fontWeight: 600
                                    }}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td style={{ padding: "1rem", fontFamily: "monospace" }}>{emp.pinCode}</td>
                                <td style={{ padding: "1rem" }}>${emp.wage}/hr</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div className="card" style={{ width: "400px" }}>
                        <h2 style={{ marginBottom: "1rem" }}>New Employee</h2>
                        <form onSubmit={handleCreate}>
                            <input
                                className="input" placeholder="Full Name" required
                                value={newEmployee.name || ''} onChange={e => setNewEmployee({ ...newEmployee, name: e.target.value })}
                            />
                            <input
                                className="input" placeholder="Email (Optional)"
                                value={newEmployee.email || ''} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })}
                            />
                            <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                                <input
                                    className="input" placeholder="PIN (6-digits)" required minLength={4} maxLength={6}
                                    value={newEmployee.pinCode || ''} onChange={e => setNewEmployee({ ...newEmployee, pinCode: e.target.value })}
                                />
                                <input
                                    className="input" placeholder="Wage" type="number"
                                    value={newEmployee.wage} onChange={e => setNewEmployee({ ...newEmployee, wage: Number(e.target.value) })}
                                />
                            </div>
                            <div className="flex" style={{ justifyContent: "flex-end", marginTop: "1rem" }}>
                                <button type="button" className="btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

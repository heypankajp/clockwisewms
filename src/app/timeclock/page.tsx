"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function TimeClockLogin() {
    const [pin, setPin] = useState("");
    const { loginKiosk } = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");

    const handleDigit = (digit: string) => {
        if (pin.length < 6) setPin(prev => prev + digit);
    };

    const handleInput = async () => {
        if (pin.length !== 6) return;
        const success = await loginKiosk(pin);
        if (success) {
            router.push("/timeclock/dashboard");
        } else {
            setError("Invalid PIN");
            setPin("");
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--color-secondary)", color: "white" }}>
            <h1 style={{ marginBottom: "2rem" }}>Clockwise TimeClock</h1>

            <div style={{ width: "300px" }}>
                <div style={{
                    background: "white", color: "black",
                    padding: "1rem", borderRadius: "10px",
                    fontSize: "2rem", textAlign: "center", letterSpacing: "10px",
                    marginBottom: "2rem", height: "80px", display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                    {pin.split('').map(() => '•').join('')}
                </div>

                {error && <div style={{ color: "#ef4444", textAlign: "center", marginBottom: "1rem" }}>{error}</div>}

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                        <button
                            key={n}
                            onClick={() => handleDigit(n.toString())}
                            style={{
                                padding: "1.5rem", borderRadius: "50%", border: "none",
                                fontSize: "1.5rem", background: "rgba(255,255,255,0.1)", color: "white", cursor: "pointer"
                            }}
                        >
                            {n}
                        </button>
                    ))}
                    <button onClick={() => setPin("")} style={{ background: "none", color: "white", border: "none" }}>Clear</button>
                    <button
                        onClick={() => handleDigit("0")}
                        style={{
                            padding: "1.5rem", borderRadius: "50%", border: "none",
                            fontSize: "1.5rem", background: "rgba(255,255,255,0.1)", color: "white", cursor: "pointer"
                        }}
                    >
                        0
                    </button>
                    <button onClick={handleInput} style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "10px" }}>↵</button>
                </div>

                <p className="text-muted" style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.8rem", color: "#94a3b8" }}>
                    Demo PIN: 123456
                </p>
            </div>
        </div>
    );
}

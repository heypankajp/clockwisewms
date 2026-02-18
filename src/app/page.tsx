import Link from "next/link";

export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "2rem",
      background: "var(--color-surface)"
    }}>
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--color-primary)" }}>
        Clockwise
      </h1>

      <div style={{ display: "flex", gap: "2rem" }}>
        <Link
          href="/wms"
          className="card"
          style={{ width: "300px", textAlign: "center", textDecoration: "none", color: "inherit", cursor: "pointer", transition: "transform 0.2s" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Manager Portal (WMS)</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Access Employee Management, Scheduling, and Reports.
          </p>
          <div className="btn btn-primary" style={{ marginTop: "1rem", width: "100%" }}>Login as Manager</div>
        </Link>

        <Link
          href="/timeclock"
          className="card"
          style={{ width: "300px", textAlign: "center", textDecoration: "none", color: "inherit", cursor: "pointer", transition: "transform 0.2s" }}
        >
          <h2 style={{ marginBottom: "1rem" }}>TimeClock Kiosk</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Employee Clock-in/out, Schedule View, and Tasks.
          </p>
          <div className="btn" style={{ marginTop: "1rem", width: "100%", background: "var(--color-secondary)", color: "white" }}>Launch Kiosk</div>
        </Link>
      </div>
    </div>
  );
}

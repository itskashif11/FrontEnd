import React from "react";
import { Link, Routes, Route } from "react-router-dom";
import InvoiceGrid from "../components/InvoiceGrid";

export default function Dashboard() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* SIDEBAR */}
      <div style={{
        width: 220,
        background: "#111827",
        color: "white",
        padding: 20
      }}>
        <h3>ERP SYSTEM</h3>

        <Link to="invoice" style={{ color: "white" }}>
          Invoice
        </Link>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        <Routes>
          <Route path="invoice" element={<Invoice />} />
        </Routes>
      </div>

    </div>
  );
}
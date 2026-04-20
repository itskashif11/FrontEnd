export default function Header({ invoiceNo }) {
  return (
    <div style={{
      position: "sticky",
      top: 0,
      zIndex: 1000,
      background: "#0f172a",
      color: "white",
      padding: "12px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "3px solid #38bdf8"
    }}>
      <div style={{ fontSize: "18px", fontWeight: "bold" }}>
        📊 Sales Tax Invoice System
      </div>

      <div style={{
        background: "#1e293b",
        padding: "6px 12px",
        borderRadius: "6px"
      }}>
        Invoice #: {invoiceNo}
      </div>
    </div>
  );
}
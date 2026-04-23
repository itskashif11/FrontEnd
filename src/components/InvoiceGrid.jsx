
import React, { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import logo from "../assets/Logo1.png";

export default function InvoiceGrid() {

  // ================= STATE =================
  const [invoice, setInvoice] = useState({ invoiceNo: "", date: "" });

  const [seller, setSeller] = useState({
    name: "",
    address: "",
    ntn: "",
    strn: "",
    contact:""
  });

  const [buyer, setBuyer] = useState({
    name: "",
    address: "",
    ntn: "",
    strn: "",
    emp: "",
  });

  const emptyRow = {
    sr: 1,
    description: "",
    hsCode: "",
    qty: "",
    uom: "",
    unitPrice: "",
    salesTaxRate: "",
    furtherTaxRate: "",
    valueExcl: 0,
    salesTaxValue: 0,
    furtherTaxValue: 0,
    totalValue: 0
  };

  const [rows, setRows] = useState([emptyRow]);

  // ================= LOAD NEXT INVOICE =================
  useEffect(() => {
    // axios.get("http://localhost:5000/next-invoice")
    axios.get("https://backend-v8ij.vercel.app/next-invoice")
      
      .then(res => {
        setInvoice({
          invoiceNo: res.data.nextNo,
          date: new Date().toISOString().split("T")[0]
        });
      });
  }, []);

  // ================= UPDATE ROW =================
  // const update = (i, field, value) => {
  //   const data = [...rows];
  //   const r = data[i];

  //   r[field] = value;

  //   const base = (Number(r.qty) || 0) * (Number(r.unitPrice) || 0);
  //   const st = (base * (Number(r.salesTaxRate) || 0)) / 100;
  //   const ft = (base * (Number(r.furtherTaxRate) || 0)) / 100;

  //   r.valueExcl = base;
  //   r.salesTaxValue = st;
  //   r.furtherTaxValue = ft;
  //   r.totalValue = base + st + ft;

  //   setRows(data);
  // };

  const formatNumber = (num) => {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(num) || 0);
};

//  const update = (i, field, value) => {
//   const data = [...rows];
//   const r = data[i];

//   r[field] = value;

//   const qty = Number(r.qty) || 0;
//   const price = Number(r.unitPrice) || 0;

//   // ✅ BASE VALUE
//   const base = qty * price;

//   // ✅ FIXED TAXES
//   const salesTaxRate = 18;
//   const furtherTaxRate = 4;

//   const st = (base * salesTaxRate) / 100;
//   const ft = (base * furtherTaxRate) / 100;

//   // ✅ ASSIGN VALUES
//   r.valueExcl = base;
//   r.salesTaxValue = st;
//   r.furtherTaxValue = ft;
//   r.totalValue = base + st + ft;

//   setRows(data);
// };


const update = (i, field, value) => {
  const data = [...rows];
  const r = data[i];

  r[field] = value;

  const qty = Number(r.qty) || 0;
  const price = Number(r.unitPrice) || 0;

  // BASE VALUE
  const base = qty * price;

  // FIXED SALES TAX
  const salesTaxRate = 18;

  // ✅ TAKE FROM ROW (IMPORTANT FIX)
  const furtherTaxRate = Number(r.furtherTaxRate) || 0;

  const st = (base * salesTaxRate) / 100;
  const ft = (base * furtherTaxRate) / 100;

  r.valueExcl = base;
  r.salesTaxValue = st;
  r.furtherTaxValue = ft;
  r.totalValue = base + st + ft;

  setRows(data);
};
  // ================= ADD ROW =================
  const addRow = () => {
    setRows([
      ...rows,
      { ...emptyRow, sr: rows.length + 1 }
    ]);
  };

  // ================= SEARCH INVOICE =================
  const searchInvoice = async (no) => {
    // const res = await axios.get(`http://localhost:5000/invoice/${no}`);
    const res = await axios.get(`https://backend-v8ij.vercel.app/invoice/${no}`);

    if (!res.data) {
      alert("Invoice not found");
      return;
    }
   console.log("checking rows daata", res.data.rows)
    setInvoice({
      invoiceNo: res.data.invoiceNo,
      date: res.data.date
    });

    setSeller(res.data.seller || {});
    setBuyer(res.data.buyer || {});
    setRows(res.data.rows || [emptyRow]);
  };

  // ================= RESET =================
  const resetForm = async () => {

    // const res = await axios.get("http://localhost:5000/next-invoice");
const res = await axios.get("https://backend-v8ij.vercel.app/next-invoice");
    setInvoice({
      invoiceNo: res.data.nextNo,
      date: new Date().toISOString().split("T")[0]
    });

    setSeller({
      name: "",
      address: "",
      ntn: "",
      strn: "",
      contact: ""
    });

    setBuyer({
      name: "",
      address: "",
      ntn: "",
      strn: "",
      emp: ""
    });

    setRows([{ ...emptyRow }]);
  };

  // ================= SAVE =================
  // const saveInvoice = async () => {

  //   const invoiceNo = invoice.invoiceNo;

  //   if (!invoiceNo) {
  //     alert("Invoice number missing!");
  //     return;
  //   }

  //   const input = document.getElementById("invoiceBox");

  //   const canvas = await html2canvas(input, { scale: 2 });
  //   const img = canvas.toDataURL("image/png");

  //   const pdf = new jsPDF("p", "mm", "a4");

  //   const width = 210;
  //   const height = (canvas.height * width) / canvas.width;

  //   pdf.addImage(img, "PNG", 0, 0, width, height);

  //   const blob = pdf.output("blob");

  //   const formData = new FormData();

  //   formData.append("file", blob, `Invoice_${invoiceNo}.pdf`);

  //   formData.append("data", JSON.stringify({
  //     invoiceNo,
  //     date: invoice.date,
  //     seller,
  //     buyer,
  //     rows
  //   }));

  //   // await axios.post("http://localhost:5000/save-invoice", formData);
  //   await axios.post("https://backend-v8ij.vercel.app/save-invoice", formData);
  

  //   await resetForm();

  //   alert("Saved + Loaded New Invoice");
  // };


// const saveInvoice = async () => {
//   const invoiceNo = invoice.invoiceNo;

//   if (!invoiceNo) {
//     alert("Invoice number missing!");
//     return;
//   }

//   const input = document.getElementById("invoiceBox");

//   // const canvas = await html2canvas(input, { scale: 2 });
  
//   const canvas = await html2canvas(input, {
//   scale: 3, // Higher scale for better clarity
//   useCORS: true,
//   logging: false,
//   onclone: (clonedDoc) => {
//     // 1. Find the invoice box in the cloned hidden document
//     const clonedBox = clonedDoc.getElementById("invoiceBox");
    
//     // 2. Force the cloned box to be very wide so nothing squashes
//     clonedBox.style.width = "1400px"; 
    
//     // 3. Convert all inputs/selects to plain text
//     // This is the most effective way to stop the "cutting"
//     const inputs = clonedBox.querySelectorAll("input, select");
//     inputs.forEach((el) => {
//       const val = el.value;
//       const span = clonedDoc.createElement("span");
//       span.innerText = val;
      
//       // Copy some basic styles so it looks right
//       span.style.display = "inline-block";
//       span.style.padding = "4px";
//       span.style.fontSize = "12px";
      
//       // Replace the input with the text span
//       el.parentNode.replaceChild(span, el);
//     });
//   }
// });
//   const img = canvas.toDataURL("image/png");

//   // const pdf = new jsPDF("p", "mm", "a4");
//   const pdf = new jsPDF("l", "mm", "a4");

//   const width = 297;
//   const height = (canvas.height * width) / canvas.width;

//   pdf.addImage(img, "PNG", 0, 0, width, height);

//   // 💡 SAVE FILE LOCALLY (NO BACKEND FILE SENDING)
//   pdf.save(`Invoice_${invoiceNo}.pdf`);

//   const payload = {
//     invoiceNo,
//     date: invoice.date,
//     seller,
//     buyer,
//     rows
//   };

//   try {
//     await axios.post(
//       "https://backend-v8ij.vercel.app/save-invoice",
//       payload
//     );

//     await resetForm();
//     alert("Saved Successfully 🚀");

//   } catch (err) {
//     console.log(err);
//     alert("Save failed");
//   }
// };


const saveInvoice = async () => {
  const invoiceNo = invoice.invoiceNo;

  if (!invoiceNo) {
    alert("Invoice number missing!");
    return;
  }

  try {
    const input = document.getElementById("invoiceBox");

    const canvas = await html2canvas(input, {
      scale: 3,
      useCORS: true,
      logging: false,

      onclone: (clonedDoc) => {
        const clonedBox = clonedDoc.getElementById("invoiceBox");

        // Force stable width
        clonedBox.style.width = "1400px";

        // Convert inputs/selects → text
        const inputs = clonedBox.querySelectorAll("input, select");

        inputs.forEach((el) => {
          const span = clonedDoc.createElement("span");
          span.innerText = el.value;

          span.style.display = "inline-block";
          span.style.padding = "4px";
          span.style.fontSize = "12px";
          span.style.whiteSpace = "pre-wrap";
          span.style.wordBreak = "break-word";

          el.parentNode.replaceChild(span, el);
        });

        // Convert textarea → multiline safe text
        const textareas = clonedBox.querySelectorAll("textarea");

        textareas.forEach((ta) => {
          const span = clonedDoc.createElement("span");

          span.innerText = ta.value;
          span.style.whiteSpace = "pre-wrap";
          span.style.wordBreak = "break-word";
          span.style.display = "inline-block";
          span.style.maxWidth = "220px";
          span.style.fontSize = "12px";

          ta.parentNode.replaceChild(span, ta);
        });
      },
    });

    const img = canvas.toDataURL("image/png");

    // ================= PDF =================
    const pdf = new jsPDF("l", "mm", "a4");

    const pdfWidth = 297;
    const pdfHeight = 210;

    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(img, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(img, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`Invoice_${invoiceNo}.pdf`);

    // ================= BACKEND =================
    const payload = {
      invoiceNo,
      date: invoice.date,
      seller,
      buyer,
      rows,
    };

    await axios.post(
      "https://backend-v8ij.vercel.app/save-invoice",
      payload
    );

    await resetForm();
    alert("Saved Successfully 🚀");
  } catch (err) {
    console.log(err);
    alert("Save failed");
  }
};

  // ================= TOTALS =================
  const totalExcl = rows.reduce((s, r) => s + Number(r.valueExcl || 0), 0);
  const totalST = rows.reduce((s, r) => s + Number(r.salesTaxValue || 0), 0);
  const totalFT = rows.reduce((s, r) => s + Number(r.furtherTaxValue || 0), 0);
  const grandTotal = rows.reduce((s, r) => s + Number(r.totalValue || 0), 0);
const autoResize = (e) => {
  e.target.style.height = "40px"; // reset
  e.target.style.height = Math.min(e.target.scrollHeight, 90) + "px";
};
  // ================= UI =================
  return (
    <div style={styles.page}>

      {/* HEADER */}
  {/* <div style={styles.header}>

  <h2 style={styles.title}>SCRAP SALES INVOICE SYSTEM</h2>


  <input
    style={styles.search}
    placeholder="Search Invoice..."
    onKeyDown={(e) => {
      if (e.key === "Enter") searchInvoice(e.target.value);
    }}
  />

   

</div> */}

<div style={styles.header}>

  <div style={styles.left} />

  <h1 style={styles.title}>SCRAP SALES INVOICE SYSTEM</h1>

  <div style={styles.rightSection}>
    <input
      style={styles.search}
      placeholder="Search Invoice..."
      onKeyDown={(e) => {
        if (e.key === "Enter") searchInvoice(e.target.value);
      }}
    />

    <button style={styles.logout} onClick={handleLogout}>
      Logout
    </button>
  </div>

</div>




      {/* INVOICE */}
      <div id="invoiceBox" style={styles.box}>


        {/* <h4>Invoice #{invoice.invoiceNo}</h4>
        <p>Date: {invoice.date}</p> */}

        {/* HEADER INSIDE invoiceBox */}
<div style={styles.invoiceHeader}>

  {/* LEFT - LOGO */}
  <div style={styles.logoBox}>
 

<img src={logo} alt="logo" style={styles.logo} />
  </div>

  {/* CENTER - TITLE */}
  <div style={styles.titleBox}>
    <h2 style={styles.invoiceTitle}>SALES TAX INVOICE</h2>
  </div>

  {/* RIGHT - INFO */}
  <div style={styles.invoiceInfo}>
  <div>
    <b>Invoice No.</b> {invoice.invoiceNo}
  </div>

  <div>
    <b>Date:</b>{" "}
    <input
      type="date"
      value={invoice.date}
      max={new Date().toISOString().split("T")[0]} // 👈 restrict future dates
      onChange={(e) =>
        setInvoice({ ...invoice, date: e.target.value })
      }
      style={styles.dateInput}
    />
  </div>
</div>

</div>

       <div style={styles.grid}>
  
  {/* SELLER */}
  <div style={styles.card}>
    <h4 style={styles.heading}>Supplier Information</h4>

    <div style={styles.field}>
      <label style={styles.label}>Name:</label>
      <input
        value={seller.name}
        onChange={(e) => setSeller({ ...seller, name: e.target.value })}
        style={styles.input}
        placeholder="Enter name"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>Address:</label>
      <input
        value={seller.address}
        onChange={(e) => setSeller({ ...seller, address: e.target.value })}
        style={styles.input}
        placeholder="Enter address"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>NTN:</label>
      <input
        value={seller.ntn}
        onChange={(e) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // 🔥 only numbers
    setSeller({ ...seller, ntn: val });
  }}
        // onChange={(e) => setSeller({ ...seller, ntn: e.target.value })}
        style={styles.input}
        placeholder="Enter NTN"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>STRN:</label>
      <input
        value={seller.strn}
      
         onChange={(e) => {
    const val = e.target.value.replace(/[^0-9]/g, ""); // 🔥 only numbers
    setSeller({ ...seller, strn: val });
  }}
        style={styles.input}
        placeholder="Enter STRN"
      />
    </div>
    <div style={styles.field}>
      <label style={styles.label}>Contact:</label>
      <input
        value={seller.contact}
        // onChange={(e) => setSeller({ ...seller, contact: e.target.value })}
        onChange={(e) => {
    let val = e.target.value;

    // allow only numbers and +
    val = val.replace(/[^0-9+]/g, "");

    // enforce Pakistan format logic
    if (val.startsWith("00")) {
      val = val.slice(0, 14);
    } else if (val.startsWith("+92")) {
      val = val.slice(0, 13);
    } else if (val.startsWith("03")) {
      val = val.slice(0, 11);
    } else {
      val = val.slice(0, 11);
    }

    setSeller({ ...seller, contact: val });
  }}
        style={styles.input}
        placeholder="Enter Contact"
      />
    </div>
  </div>

  {/* BUYER */}
  <div style={styles.card}>
    <h4 style={styles.heading}>Buyer Information</h4>

    <div style={styles.field}>
      <label style={styles.label}>Name:</label>
      <input
        value={buyer.name}
        onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
        style={styles.input}
        placeholder="Enter name"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>Address:</label>
      <input
        value={buyer.address}
        onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
        style={styles.input}
        placeholder="Enter address"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>NTN:</label>
      <input
        value={buyer.ntn}
        // onChange={(e) => setBuyer({ ...buyer, ntn: e.target.value })}
         onChange={(e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setBuyer({ ...buyer, ntn: val });
  }}
        style={styles.input}
        placeholder="Enter NTN"
      />
    </div>

    <div style={styles.field}>
      <label style={styles.label}>STRN:</label>
      <input
        value={buyer.strn}
        
         onChange={(e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setBuyer({ ...buyer, strn: val });
  }}
        style={styles.input}
        placeholder="Enter STRN"
      />
    </div>
      <div style={styles.field}>
      <label style={styles.label}>Emp:</label>
      <input
        value={buyer.emp}
        onChange={(e) => setBuyer({ ...buyer, emp: e.target.value })}
        style={styles.input}
        placeholder="Enter Emp"
      />
    </div>
  </div>

</div>

        {/* TABLE */}
        <table style={styles.table}>
          <thead>
  <tr>
    <th style={styles.th}>Sr</th>
    <th style={styles.th}>Description</th>
    <th style={styles.th}>HS Code</th>
    <th style={styles.th}>Qty</th>
    <th style={styles.th}>UoM</th>
    <th style={styles.th}>Unit Price</th>
    <th style={styles.th}>Sales Tax%</th>
    <th style={styles.th}>Further Tax%</th>
    <th style={styles.th}>Value.Excl Sales Tax</th>
    <th style={styles.th}>Sales Tax Value</th>
    <th style={styles.th}>Value of Further Tax</th>
   <th style={styles.th}>Total Value Incl. Sales Tax</th>
  </tr>
</thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
              <td style={styles.td}>{r.sr}</td>

                {/* <td><input value={r.description || ""} onChange={e => update(i, "description", e.target.value)} /></td> */}
               <td style={styles.td}>
  <textarea
  value={r.description || ""}
  onChange={(e) => {
    update(i, "description", e.target.value);
    autoResize(e);
  }}
  style={styles.descInput}
  rows={2}
/>
</td>
                {/* <td><input value={r.hsCode || ""} onChange={e => update(i, "hsCode", e.target.value)} /></td> */}
               <td style={styles.td}>
  <td style={styles.td}>
  <select
    value={r.hsCode || ""}
    onChange={(e) => update(i, "hsCode", e.target.value)}
    style={styles.smallInput}
  >
    <option value="">Select</option>
    <option value="2022.1872">4707.9090</option>
    <option value="7204.41">3915.1000</option>
    <option value="7204.49">7204.2900</option>
    <option value="7404.00">2401.3000</option>
  
  </select>
</td>
</td>
                {/* <td><input value={r.qty || ""} onChange={e => update(i, "qty", e.target.value)} /></td> */}
 <td style={styles.td}>
  <input
  type="text"
  value={
    r.qty !== "" && r.qty !== undefined
      ? new Intl.NumberFormat("en-PK").format(r.qty)
      : ""
  }
  onChange={(e) => {
    // remove commas before saving
    const raw = e.target.value.replace(/,/g, "");

    // allow only numbers
    if (!/^\d*$/.test(raw)) return;

    update(i, "qty", raw);
  }}
  style={styles.smallInput}
/>
</td>

                {/* <td><input value={r.uom || ""} onChange={e => update(i, "uom", e.target.value)} /></td> */}
               <td style={styles.td}>
  <select
    value={r.uom || ""}
    onChange={(e) => update(i, "uom", e.target.value)}
    style={styles.smallInput1}
  >
    <option value="">Select</option>
    <option value="KG">KG</option>
    <option value="Piece">Number / Piece</option>
    <option value="Thousand">Thousand Unit</option>
  </select>
</td>
                {/* <td><input value={r.unitPrice || ""} onChange={e => update(i, "unitPrice", e.target.value)} /></td> */}
               <td style={styles.td}>
  <input
  type="text"
  value={
    r.unitPrice !== "" && r.unitPrice !== undefined
      ? new Intl.NumberFormat("en-PK").format(r.unitPrice)
      : ""
  }
  onChange={(e) => {
    // remove commas
    const raw = e.target.value.replace(/,/g, "");

    // allow only numbers (and decimal if needed)
    if (!/^\d*\.?\d*$/.test(raw)) return;

    update(i, "unitPrice", raw);
  }}
  style={styles.smallInput}
/>
</td>
                {/* <td><input value={r.salesTaxRate || ""} onChange={e => update(i, "salesTaxRate", e.target.value)} /></td> */}

 <td style={styles.td}>
  <input
    value="18"
    disabled
    style={{ ...styles.smallInput, background: "#f0f0f0" }}
  />
</td>
                {/* <td><input value={r.furtherTaxRate || ""} onChange={e => update(i, "furtherTaxRate", e.target.value)} /></td> */}
 <td style={styles.td}>
  <select
    value={r.furtherTaxRate || "4"}
    onChange={(e) => update(i, "furtherTaxRate", e.target.value)}
    style={styles.smallInput1}
  >
    <option value="4">4</option>
     <option value="0">0</option>
  </select>
</td>
                <td>{formatNumber(r.valueExcl)}</td>
<td>{formatNumber(r.salesTaxValue)}</td>
<td>{formatNumber(r.furtherTaxValue)}</td>
<td><b>{formatNumber(r.totalValue)}</b></td>
              </tr>
            ))}
          </tbody>
        </table>

       

        <div style={styles.actionsBottom}>
 
</div>

<div style={styles.signatureSection}>
  <div>
    _______________________<br />
    Authorized Signatory:<br />
    Name:<br />
    Date:
  </div>

  <div>
    _______________________<br />
    Authorized Signatory:<br />
    Name:<br />
    Date:
  </div>

  <div>
    _______________________<br />
    Authorized Signatory:<br />
    Name:<br />
    Date:
  </div>
</div>

      </div>
      
      <div style={styles.buttonContainer}>
  <button style={styles.addBtn} onClick={addRow}>
    + Add Row
  </button>

  <button style={styles.saveBtn} onClick={saveInvoice}>
    💾 Save Invoice
  </button>
</div>
      <div style={styles.footer}>
  <p>© 2026 SCRAP SALES Invoice System | Developed by Kashif</p>
</div>
    </div>
    
  );
}

/* ================= STYLES ================= */
const styles = {
  page: { padding: 20, fontFamily: "Segoe UI", background: "#f4f6f9" },
header: {
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "15px",
},

left: {
  // empty space to balance layout
},

title: {
  textAlign: "center",
  margin: 0,
  whiteSpace: "nowrap",
  fontSize: 24
},

rightSection: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  justifySelf: "end",
},

search: {
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  color: "black"
},




  actions: { display: "flex", gap: 10 },
  box: { background: "white", padding: 20, marginTop: 10, borderRadius: 10 },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  card: { border: "1px solid #ddd", padding: 10, display: "flex", flexDirection: "column", gap: 5 },
  table: { width: "100%", marginTop: 10, borderCollapse: "collapse" },
  summary: { marginTop: 20, display: "flex", justifyContent: "space-between" },
  actionsBottom: {
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-end",
  gap: "10px"
},

addBtn: {
  padding: "10px 15px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
},

logout: {
  padding: "5px 10px",
  background: "#3b82f6",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
},
saveBtn: {
  padding: "10px 20px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold"
},
footer: {
  marginTop: "30px",
  padding: "15px",
  textAlign: "center",
  background: "#0f172a",
  color: "#cbd5f5",
  borderRadius: "8px",
  fontSize: "13px"
},
grid: {
  display: "flex",
  gap: "20px",
  marginBottom: "20px",
  flexWrap: "wrap"
},

card: {
  flex: 1,
  minWidth: "300px",
  background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  border: "1px solid #e2e8f0",
  transition: "0.3s"
},

heading: {
  marginBottom: "15px",
  color: "#0f172a",
  borderBottom: "2px solid #3b82f6",
  paddingBottom: "6px"
},

field: {
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px"
},

fieldRow: {
  display: "flex",
  gap: "10px"
},

input: {
  padding: "8px 10px",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "13px",
  transition: "0.2s",
},

// OPTIONAL HOVER EFFECT (VERY PREMIUM)
cardHover: {
  transform: "translateY(-3px)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.12)"
},
 grid: {
    display: "flex",
    gap: "20px",
  },

  card: {
    flex: 1,
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
  },

  heading: {
    textAlign: "center",
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "600",
  },

  field: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  },

  label: {
    width: "90px",
    fontWeight: "500",
  },

  input: {
    flex: 1,
    padding: "6px 10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  invoiceHeader: {
  display: "flex",
  justifyContent: "space-between",
   gridTemplateColumns: "1fr 2fr 1fr", // LEFT | CENTER | RIGHT
  alignItems: "center",
  borderBottom: "2px solid #3b82f6",
  paddingBottom: "10px",
  marginBottom: "20px"
},

logoBox: {
  flex: "1",
},

logo: {
   width: "120px",   // 👈 control width
  height: "80px",   // 👈 control height
  objectFit: "contain"
},

titleBox: {
  flex: "6",
  textAlign: "center"
},

invoiceTitle: {
  margin: 0,
  fontSize: "22px",
  fontWeight: "700",
  color: "#0f172a",
  letterSpacing: "1px",
  
},

invoiceInfo: {
  flex: "1",
  textAlign: "right",
  fontSize: "14px",
  color: "#0f172a"
},
 buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "25px",
    marginTop: "25px",
  },

  // 🌈 Add Row Button (Blue Gradient)
  addBtn: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    background: "linear-gradient(135deg, #36D1DC, #5B86E5)",
    boxShadow: "0 8px 20px rgba(91, 134, 229, 0.3)",
    transition: "all 0.3s ease",
  },

  // 💾 Save Button (Green Gradient)
  saveBtn: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "30px",
    cursor: "pointer",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    background: "linear-gradient(135deg, #11998e, #38ef7d)",
    boxShadow: "0 8px 20px rgba(56, 239, 125, 0.3)",
    transition: "all 0.3s ease",
  },
   signatureSection: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "210px",
    padding: "0 40px",
    pageBreakInside: "avoid", // IMPORTANT for PDF/print
    fontSize: "14px",
  },
   invoiceInfo: {
   
    marginBottom: "20px",
    fontSize: "16px",
  },

  dateInput: {
    padding: "5px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    outline: "none",
    cursor: "pointer",
    marginTop: "10px"
  },
  descInput: {
  width: "220px",

  minHeight: "40px",
  maxHeight: "90px",   // 👈 limits expansion (about 3–4 rows)

  padding: "6px",
  borderRadius: "6px",
  border: "1px solid #ccc",

  resize: "none",      // 👈 no manual resize
  overflow: "hidden",  // 👈 prevents ugly scroll
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
},
   smallInput: {
    width: "105px",
    padding: "4px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
    smallInput1: {
    width: "115px",
    padding: "4px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
    marginTop: "10px"
  },

  th: {
    textAlign: "center",
    padding: "6px 4px",   // 🔥 reduced spacing
    border: "1px solid #ddd",
    background: "#f5f5f5",
    fontWeight: "600",
  },

  td: {
    textAlign: "center",
    padding: "4px",       // 🔥 compact rows
    border: "1px solid #ddd",
  },
};
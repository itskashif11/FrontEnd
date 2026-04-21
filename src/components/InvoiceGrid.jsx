// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

// export default function InvoiceGrid() {

//   // ================= STATE =================
//   const [invoice, setInvoice] = useState({ invoiceNo: "", date: "" });

//   const [seller, setSeller] = useState({
//     name: "",
//     address: "",
//     ntn: "",
//     strn: ""
//   });

//   const [buyer, setBuyer] = useState({
//     name: "",
//     address: "",
//     ntn: "",
//     strn: ""
//   });

//   const emptyRow = {
//     sr: 1,
//     description: "",
//     hsCode: "",
//     qty: 0,
//     uom: "",
//     unitPrice: 0,
//     salesTaxRate: 0,
//     furtherTaxRate: 0,
//     valueExcl: 0,
//     salesTaxValue: 0,
//     furtherTaxValue: 0,
//     totalValue: 0
//   };

//   const [rows, setRows] = useState([emptyRow]);

//   // ================= LOAD INVOICE NO =================
//   useEffect(() => {
//     axios.get("http://localhost:5000/next-invoice")
//       .then(res => {
//         setInvoice({
//           invoiceNo: res.data.nextNo,
//           date: new Date().toISOString().split("T")[0]
//         });
//       });
//   }, []);

//   // ================= CALCULATION =================
//   const update = (i, field, value) => {
//     const data = [...rows];
//     const r = data[i];

//     r[field] = value;

//     const base = (Number(r.qty) || 0) * (Number(r.unitPrice) || 0);
//     const st = (base * (Number(r.salesTaxRate) || 0)) / 100;
//     const ft = (base * (Number(r.furtherTaxRate) || 0)) / 100;

//     r.valueExcl = base;
//     r.salesTaxValue = st;
//     r.furtherTaxValue = ft;
//     r.totalValue = base + st + ft;

//     setRows(data);
//   };

//   // ================= ADD ROW =================
//   const addRow = () => {
//     setRows([
//       ...rows,
//       {
//         ...emptyRow,
//         sr: rows.length + 1
//       }
//     ]);
//   };

//   // ================= SEARCH =================
//   const searchInvoice = async (no) => {
//     const res = await axios.get(`http://localhost:5000/invoice/${no}`);
//     if (!res.data) return alert("Invoice not found");

//     setInvoice({
//       invoiceNo: res.data.invoiceNo,
//       date: res.data.date
//     });

//     setSeller(res.data.seller || {});
//     setBuyer(res.data.buyer || {});
//     setRows(res.data.rows || [emptyRow]);
//   };

//   // ================= RESET FORM =================
//   const resetForm = async () => {

//   const res = await axios.get("http://localhost:5000/next-invoice");

//   // ✅ reset invoice
//   setInvoice({
//     invoiceNo: res.data.nextNo,
//     date: new Date().toISOString().split("T")[0]
//   });

//   // ✅ reset seller
//   setSeller({
//     name: "",
//     address: "",
//     ntn: "",
//     strn: ""
//   });

//   // ✅ reset buyer
//   setBuyer({
//     name: "",
//     address: "",
//     ntn: "",
//     strn: ""
//   });

//   // 🔥 HARD RESET TABLE ROWS (IMPORTANT FIX)
//   setRows([
//     {
//       sr: 1,
//       description: "",
//       hsCode: "",
//       qty: "",
//       uom: "",
//       unitPrice: "",
//       salesTaxRate: "",
//       furtherTaxRate: "",
//       valueExcl: 0,
//       salesTaxValue: 0,
//       furtherTaxValue: 0,
//       totalValue: 0
//     }
//   ]);
// };

//   // ================= SAVE INVOICE =================
//   const saveInvoice = async () => {

//     const invoiceNo = invoice.invoiceNo;

//     if (!invoiceNo) {
//       alert("Invoice number missing!");
//       return;
//     }

//     const input = document.getElementById("invoiceBox");

//     const canvas = await html2canvas(input, { scale: 2 });
//     const img = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("p", "mm", "a4");

//     const width = 210;
//     const height = (canvas.height * width) / canvas.width;

//     pdf.addImage(img, "PNG", 0, 0, width, height);

//     const blob = pdf.output("blob");

//     const formData = new FormData();

//     formData.append("file", blob, `Invoice_${invoiceNo}.pdf`);

//     formData.append("data", JSON.stringify({
//       invoiceNo,
//       date: invoice.date,
//       seller,
//       buyer,
//       rows
//     }));

//     await axios.post("http://localhost:5000/save-invoice", formData);

//     // 🔥 RESET AFTER SAVE (IMPORTANT)
//     await resetForm();

    

//     alert("Saved Successfully + New Invoice Ready");
//   };

//   // ================= TOTALS =================
//   const totalExcl = rows.reduce((s, r) => s + Number(r.valueExcl || 0), 0);
//   const totalST = rows.reduce((s, r) => s + Number(r.salesTaxValue || 0), 0);
//   const totalFT = rows.reduce((s, r) => s + Number(r.furtherTaxValue || 0), 0);
//   const grandTotal = rows.reduce((s, r) => s + Number(r.totalValue || 0), 0);

//   // ================= UI =================
//   return (
//     <div style={styles.page}>

//       {/* HEADER */}
//       <div style={styles.header}>
//         <h3>ERP INVOICE SYSTEM</h3>

//         <div style={styles.actions}>
//           <input
//             placeholder="Search Invoice"
//             onKeyDown={(e) => {
//               if (e.key === "Enter") searchInvoice(e.target.value);
//             }}
//           />

//           <button onClick={addRow}>+ Row</button>
//           <button onClick={saveInvoice} style={{ background: "green", color: "white" }}>
//             SAVE
//           </button>
//         </div>
//       </div>

//       {/* INVOICE */}
//       <div id="invoiceBox" style={styles.box}>

//         <h4>Invoice #{invoice.invoiceNo}</h4>
//         <p>Date: {invoice.date}</p>

//         {/* SELLER + BUYER */}
//         <div style={styles.grid}>

//           <div style={styles.card}>
//             <h4>Seller</h4>
//             <input placeholder="Name" value={seller.name} onChange={e => setSeller({ ...seller, name: e.target.value })} />
//             <input placeholder="Address" value={seller.address} onChange={e => setSeller({ ...seller, address: e.target.value })} />
//             <input placeholder="NTN" value={seller.ntn} onChange={e => setSeller({ ...seller, ntn: e.target.value })} />
//             <input placeholder="STRN" value={seller.strn} onChange={e => setSeller({ ...seller, strn: e.target.value })} />
//           </div>

//           <div style={styles.card}>
//             <h4>Buyer</h4>
//             <input placeholder="Name" value={buyer.name} onChange={e => setBuyer({ ...buyer, name: e.target.value })} />
//             <input placeholder="Address" value={buyer.address} onChange={e => setBuyer({ ...buyer, address: e.target.value })} />
//             <input placeholder="NTN" value={buyer.ntn} onChange={e => setBuyer({ ...buyer, ntn: e.target.value })} />
//             <input placeholder="STRN" value={buyer.strn} onChange={e => setBuyer({ ...buyer, strn: e.target.value })} />
//           </div>

//         </div>

//         {/* TABLE */}
//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th>Sr</th>
//               <th>Description</th>
//               <th>HS</th>
//               <th>Qty</th>
//               <th>UoM</th>
//               <th>Price</th>
//               <th>ST%</th>
//               <th>FT%</th>
//               <th>Excl</th>
//               <th>ST</th>
//               <th>FT</th>
//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {rows.map((r, i) => (
//               <tr key={i}>
//                 <td>{r.sr}</td>

//                 <td><input onChange={e => update(i, "description", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "hsCode", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "qty", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "uom", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "unitPrice", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "salesTaxRate", e.target.value)} /></td>
//                 <td><input onChange={e => update(i, "furtherTaxRate", e.target.value)} /></td>

//                 <td>{r.valueExcl}</td>
//                 <td>{r.salesTaxValue}</td>
//                 <td>{r.furtherTaxValue}</td>
//                 <td><b>{r.totalValue}</b></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* TOTALS */}
//         <div style={styles.summary}>
//           <div><b>Value Excl:</b> {totalExcl.toFixed(2)}</div>
//           <div><b>Sales Tax:</b> {totalST.toFixed(2)}</div>
//           <div><b>Further Tax:</b> {totalFT.toFixed(2)}</div>
//           <div><b>Total:</b> {grandTotal.toFixed(2)}</div>
//         </div>

//       </div>
//     </div>
//   );
// }

// /* ================= STYLES ================= */
// const styles = {

//   page: { padding: 20, fontFamily: "Segoe UI", background: "#f4f6f9" },

//   header: {
//     display: "flex",
//     justifyContent: "space-between",
//     background: "#111",
//     color: "white",
//     padding: 10,
//     alignItems: "center"
//   },

//   actions: {
//     display: "flex",
//     gap: 10,
//     alignItems: "center"
//   },

//   box: {
//     background: "white",
//     padding: 20,
//     marginTop: 10,
//     borderRadius: 10
//   },

//   grid: {
//     display: "grid",
//     gridTemplateColumns: "1fr 1fr",
//     gap: 10
//   },

//   card: {
//     border: "1px solid #ddd",
//     padding: 10,
//     display: "flex",
//     flexDirection: "column",
//     gap: 5
//   },

//   table: {
//     width: "100%",
//     marginTop: 10,
//     borderCollapse: "collapse",
//     fontSize: 12
//   },

//   summary: {
//     marginTop: 20,
//     paddingTop: 10,
//     borderTop: "2px solid #ddd",
//     display: "flex",
//     justifyContent: "space-between"
//   }
// };









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
  const update = (i, field, value) => {
    const data = [...rows];
    const r = data[i];

    r[field] = value;

    const base = (Number(r.qty) || 0) * (Number(r.unitPrice) || 0);
    const st = (base * (Number(r.salesTaxRate) || 0)) / 100;
    const ft = (base * (Number(r.furtherTaxRate) || 0)) / 100;

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


const saveInvoice = async () => {
  const invoiceNo = invoice.invoiceNo;

  if (!invoiceNo) {
    alert("Invoice number missing!");
    return;
  }

  const input = document.getElementById("invoiceBox");

  const canvas = await html2canvas(input, { scale: 2 });
  const img = canvas.toDataURL("image/png");

  const pdf = new jsPDF("p", "mm", "a4");

  const width = 210;
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(img, "PNG", 0, 0, width, height);

  // 💡 SAVE FILE LOCALLY (NO BACKEND FILE SENDING)
  pdf.save(`Invoice_${invoiceNo}.pdf`);

  const payload = {
    invoiceNo,
    date: invoice.date,
    seller,
    buyer,
    rows
  };

  try {
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

  // ================= UI =================
  return (
    <div style={styles.page}>

      {/* HEADER */}
  <div style={styles.header}>

  <h2 style={styles.title}>SCRAP SALES INVOICE SYSTEM</h2>

  <input
    style={styles.search}
    placeholder="Search Invoice..."
    onKeyDown={(e) => {
      if (e.key === "Enter") searchInvoice(e.target.value);
    }}
  />

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
  <input
    value={r.description || ""}
    onChange={(e) => update(i, "description", e.target.value)}
    style={styles.descInput}
  />
</td>
                {/* <td><input value={r.hsCode || ""} onChange={e => update(i, "hsCode", e.target.value)} /></td> */}
               <td style={styles.td}>
  <input
    value={r.hsCode || ""}
    onChange={(e) => update(i, "hsCode", e.target.value)}
    placeholder="2022.1872"
    style={styles.smallInput}
  />
</td>
                {/* <td><input value={r.qty || ""} onChange={e => update(i, "qty", e.target.value)} /></td> */}
 <td style={styles.td}>
  <input
    type="number"
    value={r.qty || ""}
    onChange={(e) => update(i, "qty", e.target.value)}
    maxLength={7}
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
    type="number"
    value={r.unitPrice || ""}
    onChange={(e) => update(i, "unitPrice", e.target.value)}
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
  </select>
</td>
                <td>{r.valueExcl}</td>
                <td>{r.salesTaxValue}</td>
                <td>{r.furtherTaxValue}</td>
                <td><b>{r.totalValue}</b></td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* TOTALS */}
        {/* <div style={styles.summary}>
          <div><b>Value of Sales Excluding Sales Tax:</b> {totalExcl.toFixed(2)}</div>
          <div><b>Sales Tax Value:</b> {totalST.toFixed(2)}</div>
          <div><b>Value of Further Sales Tax:</b> {totalFT.toFixed(2)}</div>
          <div><b>Total Value of Sales including sales tax:</b> {grandTotal.toFixed(2)}</div>
        </div> */}

        <div style={styles.actionsBottom}>
  {/* <button style={styles.addBtn} onClick={addRow}>+ Add Row</button>
  <button style={styles.saveBtn} onClick={saveInvoice}>💾 Save Invoice</button> */}
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
  position: "relative",
  background: "linear-gradient(135deg, #1e293b, #0f172a)",
  color: "white",
  padding: "20px",
  borderRadius: "10px",
  textAlign: "center",
  marginBottom: "15px"
},

title: {
  margin: 0,
  fontSize: "24px"
},

search: {
  position: "absolute",
  right: "20px",
  top: "20px",
  width: "180px",
  padding: "6px 10px",
  borderRadius: "6px",
  border: "none",
  outline: "none",
  fontSize: "13px"
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
    height: "40px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc",
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
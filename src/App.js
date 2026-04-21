// import React from "react";
// import InvoiceGrid from "./components/InvoiceGrid";
// export default function App() {
//   return <InvoiceGrid />;
// }

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import InvoiceGrid from "./components/InvoiceGrid";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<InvoiceGrid />} />
      </Routes>
    </Router>
  );
}
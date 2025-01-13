import React from "react";
import axios from "axios";

const ExportPDF = () => {
  const handleExport = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        "http://localhost:5000/expenses/export",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expenses.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      alert("Failed to export PDF");
    }
  };

  return <button onClick={handleExport}>Export to PDF</button>;
};

export default ExportPDF;

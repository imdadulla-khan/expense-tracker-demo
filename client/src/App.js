import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login.js";
import Register from "./components/Auth/Register.js";
import ExpenseTable from "./components/Expenses/ExpenseTable.js";
import "./styles/global.css";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/expenses" element={<ExpenseTable />} />
      </Routes>
    </Router>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ExportPDF from "./ExportPDF.js";

const ExpenseTable = () => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0 });
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Expense");
  const [description, setDescription] = useState("");
  const [triggerFetch, setTriggerFetch] = useState(true);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get("http://localhost:5000/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(response.data.expenses);
      setSummary(response.data.summary);
      setTriggerFetch(false);
    } catch (error) {
      console.error("Failed to fetch expenses", error);
      setTriggerFetch(false);
    }
  };

  const handleAddExpense = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/expenses",
        { amount, category, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Expense added successfully!");
      setAmount("");
      setCategory("Expense");
      setDescription("");
      setTriggerFetch(true);
    } catch (error) {
      alert("Failed to add expense.");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Expense deleted successfully!");
      setTriggerFetch(true);
    } catch (error) {
      alert("Failed to delete expense.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    if (triggerFetch) {
      fetchExpenses();
    }
  }, [triggerFetch]);

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Expenses</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Logout
        </button>
      </div>

      {/* Add Expense Section */}
      <div>
        <h2>Add Expense</h2>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAddExpense}>Add</button>
      </div>

      {/* Expense List Section */}
      <div>
        <h3>Total Income: {summary.income}</h3>
        <h3>Total Expenses: {summary.expense}</h3>
        <ExportPDF /> {/* Export PDF Button */}
        <table>
          <thead>
            <tr>
              <th>Amount</th>
              <th>Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.amount}</td>
                <td>{expense.category}</td>
                <td>{expense.description || "N/A"}</td>
                <td>
                  <button onClick={() => handleDelete(expense.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;

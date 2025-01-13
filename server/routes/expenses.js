import express from "express";
import { Expense } from "../models/index.js";
import authMiddleWare from "../middleware/authMiddleWare.js";
import { Worker } from "worker_threads"; // Import Worker from worker_threads
import path from "path";

const router = express.Router();

// Add Expense
router.post("/", authMiddleWare, async (req, res) => {
  const { amount, category, description } = req.body;

  try {
    const expense = await Expense.create({
      amount,
      category,
      description,
      userId: req.user.userId,
    });
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Failed to add expense", error });
  }
});

// Get All Expenses (with pagination)
router.get("/", authMiddleWare, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default pagination values
  const offset = (page - 1) * limit;

  try {
    const { rows: expenses, count: totalExpenses } =
      await Expense.findAndCountAll({
        where: { userId: req.user.userId },
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
      });

    const summary = expenses.reduce(
      (acc, expense) => {
        if (expense.category === "Income") acc.income += expense.amount;
        else acc.expense += expense.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    res.json({
      expenses,
      summary,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch expenses", error });
  }
});

// Delete Expense
router.delete("/:id", authMiddleWare, async (req, res) => {
  const { id } = req.params;

  try {
    await Expense.destroy({ where: { id, userId: req.user.userId } });
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete expense", error });
  }
});

// Export Expenses to PDF (Worker Thread)
router.get("/export", authMiddleWare, async (req, res) => {
  try {
    const worker = new Worker(path.resolve("workers/exportWorker.js"), {
      workerData: { userId: req.user.userId },
    });

    worker.on("message", (message) => {
      if (message.error) {
        console.error("Worker error:", message.error);
        return res.status(500).json({ message: "Failed to generate PDF" });
      }

      // Send the file to the client
      res.download(message, "expenses.pdf", (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Failed to download file");
        }
      });
    });

    worker.on("error", (error) => {
      console.error("Worker error:", error);
      res.status(500).json({ message: "Failed to export PDF" });
    });

    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
        // Ensure response is sent only once
        if (!res.headersSent) {
          res.status(500).json({ message: "Worker process failed" });
        }
      }
    });
  } catch (error) {
    console.error("Error initializing worker thread:", error);
    res.status(500).json({ message: "Failed to export PDF", error });
  }
});

export default router;

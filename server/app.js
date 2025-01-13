import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/auth.js";
import expenseRoutes from "./routes/expenses.js";
import exportRoutes from "./routes/export.js";
const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/expenses", expenseRoutes);
app.use("/expenses", exportRoutes); // Add export route under /expenses

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

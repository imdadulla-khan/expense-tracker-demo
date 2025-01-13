import express from "express";
import { Expense } from "../models/index.js";
import PDFDocument from "pdfkit";
import authMiddleWare from "../middleware/authMiddleWare.js";

const router = express.Router();

router.get("/export", authMiddleWare, async (req, res) => {
  try {
    const expenses = await Expense.findAll({
      where: { userId: req.user.userId },
    });

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const filename = "expenses.pdf";

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Pipe the PDF into the response
    doc.pipe(res);

    // Add a title
    doc.fontSize(18).text("Expense Report", { align: "center" });
    doc.moveDown(1.5);

    // Table configurations
    const tableTop = doc.y;
    const cellPadding = 10;
    const columnWidths = { category: 150, amount: 100, description: 200 };
    const tableWidth =
      columnWidths.category + columnWidths.amount + columnWidths.description;

    // Draw table headers
    doc.fontSize(12).font("Helvetica-Bold");
    drawTableRow(
      doc,
      tableTop,
      columnWidths,
      ["Category", "Amount", "Description"],
      true
    );

    doc
      .moveTo(50, tableTop + 20)
      .lineTo(50 + tableWidth, tableTop + 20)
      .stroke();

    // Draw table rows
    let y = tableTop + 25;
    let totalIncome = 0;
    let totalExpenses = 0;

    doc.font("Helvetica").fontSize(12);

    expenses.forEach((expense) => {
      const { category, amount, description } = expense;

      // Update totals
      if (category.toLowerCase() === "income") {
        totalIncome += parseFloat(amount);
      } else {
        totalExpenses += parseFloat(amount);
      }

      drawTableRow(doc, y, columnWidths, [
        category,
        amount,
        description || "N/A",
      ]);

      y += 25; // Adjust for next row height
    });

    // Draw totals row
    doc.font("Helvetica-Bold");
    doc
      .moveTo(50, y)
      .lineTo(50 + tableWidth, y)
      .stroke(); // Line above totals
    y += 5;

    drawTableRow(doc, y, columnWidths, ["Total Income:", `${totalIncome}`, ""]);
    y += 25;

    drawTableRow(doc, y, columnWidths, [
      "Total Expenses:",
      `${totalExpenses}`,
      "",
    ]);
    y += 25;

    drawTableRow(doc, y, columnWidths, [
      "Savings:",
      `${totalIncome - totalExpenses}`,
      "",
    ]);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
});

// Function to draw a single row in the table
function drawTableRow(doc, y, columnWidths, rowValues, isHeader = false) {
  const cellPadding = 10;
  const tableLeft = 50;

  // Draw background for headers
  if (isHeader) {
    doc
      .rect(
        tableLeft,
        y,
        columnWidths.category + columnWidths.amount + columnWidths.description,
        20
      )
      .fillColor("#f4f4f4")
      .fill();
    doc.fillColor("#000"); // Reset color
  }

  // Draw each cell
  doc.text(rowValues[0], tableLeft + cellPadding, y + 5, {
    width: columnWidths.category - cellPadding * 2,
    align: "center",
  });
  doc.text(
    rowValues[1],
    tableLeft + columnWidths.category + cellPadding,
    y + 5,
    {
      width: columnWidths.amount - cellPadding * 2,
      align: "center",
    }
  );
  doc.text(
    rowValues[2],
    tableLeft + columnWidths.category + columnWidths.amount + cellPadding,
    y + 5,
    {
      width: columnWidths.description - cellPadding * 2,
      align: "center",
    }
  );

  // Draw borders for the row
  doc.rect(tableLeft, y, columnWidths.category, 25).stroke();
  doc
    .rect(tableLeft + columnWidths.category, y, columnWidths.amount, 25)
    .stroke();
  doc
    .rect(
      tableLeft + columnWidths.category + columnWidths.amount,
      y,
      columnWidths.description,
      25
    )
    .stroke();
}

export default router;

import { parentPort, workerData } from "worker_threads";
import { Expense } from "../models/index.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

(async () => {
  try {
    const { userId } = workerData;

    // Ensure the exports directory exists
    const exportsDir = path.resolve("./exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir); // Create the directory if it doesn't exist
    }

    // Fetch all expenses for the user
    const expenses = await Expense.findAll({ where: { userId } });

    // Create a PDF document
    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(exportsDir, `expenses_${userId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    // Add title
    doc.fontSize(18).text("Expense Report", { align: "center" });
    doc.moveDown(2);

    // Table configuration
    const tableTop = doc.y;
    const columnWidths = { category: 150, amount: 100, description: 250 };
    const tableLeft = 50;

    // Draw table headers
    doc.fontSize(12).font("Helvetica-Bold");
    drawRow(doc, tableTop, tableLeft, columnWidths, [
      "Category",
      "Amount",
      "Description",
    ]);
    drawLine(doc, tableTop + 20, tableLeft, tableLeft + 500);

    // Populate rows
    let y = tableTop + 30;
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

      drawRow(doc, y, tableLeft, columnWidths, [
        category,
        amount.toFixed(2),
        description || "N/A",
      ]);

      y += 25;

      // Add a new page if the content exceeds the page height
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50; // Reset y for new page
      }
    });

    // Draw totals
    y += 10;
    y += 10;

    doc.font("Helvetica-Bold");
    drawRow(doc, y, tableLeft, columnWidths, [
      "Total Income:",
      totalIncome.toFixed(2),
      "",
    ]);
    y += 25;

    drawRow(doc, y, tableLeft, columnWidths, [
      "Total Expenses:",
      totalExpenses.toFixed(2),
      "",
    ]);
    y += 25;

    drawRow(doc, y, tableLeft, columnWidths, [
      "Savings:",
      (totalIncome - totalExpenses).toFixed(2),
      "",
    ]);

    // Finalize PDF
    doc.end();

    writeStream.on("finish", () => {
      parentPort.postMessage(filePath);
    });
  } catch (error) {
    console.error(error);
    parentPort.postMessage({ error: "Failed to generate PDF" });
  }
})();

// Helper function to draw a table row
function drawRow(doc, y, tableLeft, columnWidths, values) {
  const cellPadding = 10;

  doc.text(values[0], tableLeft + cellPadding, y, {
    width: columnWidths.category - cellPadding * 2,
    align: "center",
  });
  doc.text(values[1], tableLeft + columnWidths.category + cellPadding, y, {
    width: columnWidths.amount - cellPadding * 2,
    align: "center",
  });
  doc.text(
    values[2],
    tableLeft + columnWidths.category + columnWidths.amount + cellPadding,
    y,
    {
      width: columnWidths.description - cellPadding * 2,
      align: "center",
    }
  );

  // Draw borders for the row
  doc.rect(tableLeft, y - 5, columnWidths.category, 25).stroke();
  doc
    .rect(tableLeft + columnWidths.category, y - 5, columnWidths.amount, 25)
    .stroke();
  doc
    .rect(
      tableLeft + columnWidths.category + columnWidths.amount,
      y - 5,
      columnWidths.description,
      25
    )
    .stroke();
}

// Helper function to draw a horizontal line
function drawLine(doc, y, x1, x2) {
  doc.moveTo(x1, y).lineTo(x2, y).stroke();
}

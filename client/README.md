Assignment: Expense Tracker

Project Requirements

Create an expense manager application with the following functionalities:

User Authentication:
Implement user registration and login using email and password.

Expense Management:

Add
Expenses: Include fields for Amount (required), Category (required; options:
"Income" or "Expense"), and Description (optional).

Delete
Expenses: Allow users to remove existing expenses.

List
Expenses: Display a table showing all expenses with total income and
expenses summarized at the top.

Export to PDF: Implement a
feature to export the expense report to a PDF, ensuring scalability for
large datasets (e.g., 50k transactions per month).

Tech Stack Requirements

Frontend (Client):

Use
React.js.

You may
use any design or layout; a simple and functional UI is sufficient.

Component
libraries (e.g., Material UI, Shadcn UI) are allowed.

Backend (Server):

Use
Express.js (Node.js) and MySQL 8.

Ensure
the application is deployable.

Use an
ORM and database migrations if preferred.

Submission Guidelines

expense-tracker-demo/  
├── client/ // Frontend code  
├── server/ // Backend code  
├── README.md // Setup instructions

Include
a README file with clear instructions for setting up and running both the
frontend and backend.

Core Features:
Implementation of required functionalities.

Scalability: Especially
for the PDF export feature with large datasets.

Code Quality:
Maintainable, well-structured, and clean code with proper comments.

Error Handling: Robust
handling of edge cases in both the frontend and backend.

Security: Use of best
practices, including password hashing.

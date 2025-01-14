# Expense Tracker
A full-stack expense management application to track income and expenses, export data to PDF, and more.

## Features
User authentication (register/login)
Add, delete, and view expenses
Categorized expenses (Income/Expense)
Export expenses as a PDF
Responsive design

## Prerequisites
Ensure you have the following installed:

Node.js (v16+)
MySQL (v8+)
Git

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/expense-tracker-demo.git
cd expense-tracker-demo 
```

### 2. Backend Setup
Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

### 3. Configure the environment:
Create a .env file in the server directory.
Add the following variables:
```bash
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_DIALECT=mysql
JWT_SECRET=your_jwt_secret
```

### 4. Sync the database:
```bash
node syncDb.js
```

### 5. Start the backend server:
```bash
node app.js
```
Backend server will run at http://localhost:5000.

### 6. Frontend Setup
Navigate to the client directory:
cd ../client

### 7. Install dependencies:
``` bash
npm install
```

### 8. Start the frontend server:
```bash
npm start
```
Frontend will run at http://localhost:3000.

## Usage
Open the app in your browser at http://localhost:3000.
Register a new account or log in.
Add income/expenses, view a summary, and export data as a PDF.

## Project Structure
```bash
expense-tracker-demo/
├── client/         # Frontend React application
├── server/         # Backend Express.js application
├── README.md       # Project documentation
```

## Troubleshooting
Database connection errors: Check the .env file for correct database credentials.
PDF generation issues: Ensure the exports directory exists in the server folder.

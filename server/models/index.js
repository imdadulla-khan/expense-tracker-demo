import sequelize from "../config/database.js";
import User from "./User.js";
import Expense from "./Expense.js";

// Define relationships
User.hasMany(Expense, { foreignKey: "userId" });
Expense.belongsTo(User, { foreignKey: "userId" });

export { sequelize, User, Expense };

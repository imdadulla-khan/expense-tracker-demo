import { sequelize } from "./models/index.js";

(async () => {
  try {
    await sequelize.sync({ force: true }); // This will drop and recreate tables
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing the database:", error);
  } finally {
    await sequelize.close();
  }
})();

import db from "./app/database/models";
import "@testing-library/jest-dom";

afterAll(async () => {
  try {
    await db.sequelize.close();
  } catch (error) {
    console.error("Error during teardown:", error);
  } finally {
    console.log("Teardown completed.");
  }
});

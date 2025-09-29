import db from "./app/database/models";

afterAll(async () => {
  try {
    await db.sequelize.close();
  } catch (error) {
    console.error("Error during teardown:", error);
  } finally {
    console.log("Teardown completed.");
  }
});

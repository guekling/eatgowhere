import { execSync } from "child_process";

module.exports = async () => {
  try {
    execSync("npx sequelize-cli db:migrate:undo:all --env test");
  } catch (error) {
    console.error("Error during global teardown:", error);
  } finally {
    console.log("Global teardown completed.");
  }
};

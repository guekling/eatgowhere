import { loadEnvConfig } from "@next/env";
import { execSync } from "child_process";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

execSync("npx sequelize-cli db:migrate --env test");

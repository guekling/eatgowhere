import pg from "pg";
import { Sequelize, Dialect, Options } from "sequelize";

import SessionFactory from "./session";
import UserFactory from "./user";
import RestaurantFactory from "./restaurant";

const database = process.env.DB_NAME || "eatgowhere";
const username = process.env.DB_USER || "admin";
const password = process.env.DB_PASSWORD || "admin";
const host = process.env.DB_HOST || "db";
const dialect = (process.env.DB_DIALECT as Dialect) || "postgres";
const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

const sequelizeOptions: Options = {
  host,
  dialect,
  dialectModule: dialect === "postgres" ? pg : undefined,
  port,
};

const sequelize = new Sequelize(database, username, password, sequelizeOptions);

// Explicitly initialize models
const Session = SessionFactory(sequelize);
const User = UserFactory(sequelize);
const Restaurant = RestaurantFactory(sequelize);

const db = {
  sequelize,
  Sequelize,
  Session,
  User,
  Restaurant,
  // Add other models here
};

// Call associate methods to set up associations
Object.keys(db).forEach((modelName) => {
  if (modelName !== "sequelize" && modelName !== "Sequelize") {
    const model = (db as any)[modelName];
    if (model.associate) {
      model.associate(db);
    }
  }
});

export default db;
db.Sequelize = Sequelize;

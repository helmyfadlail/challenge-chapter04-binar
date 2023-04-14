import { Sequelize } from "sequelize";

const db = new Sequelize("car_management", "postgres", "rahasia", {
  host: "localhost",
  dialect: "postgres",
});

export default db;

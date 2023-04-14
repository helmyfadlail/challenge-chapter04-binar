import { Sequelize } from "sequelize";
import db from "../config/db.js";

const { DataTypes } = Sequelize;

const Car = db.define(
  "cars",
  {
    name: DataTypes.STRING,
    rentPrice: DataTypes.INTEGER,
    size: DataTypes.STRING,
    type: DataTypes.STRING,
    image: DataTypes.TEXT,
  },
  {
    freezeTableName: true,
  }
);

export default Car;

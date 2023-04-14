import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import router from "./routes/routes.js";
import ejs from "ejs";
import expressLayouts from "express-ejs-layouts";

const PORT = process.env.PORT || 3030;
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "rahasia",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

// set static folder
app.use(express.static("public"));
app.use(express.static("public/uploads"));

// set template engine
app.use(expressLayouts);
app.set("layout", "layout");
app.set("view engine", "ejs");

app.use(router);

app.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});

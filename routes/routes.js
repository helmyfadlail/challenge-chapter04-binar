import express from "express";
import { getAllCars, createNewCar, updateCar, deleteCar, editCar } from "../controllers/carsController.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/cars", getAllCars);
router.get("/cars/add", (req, res) => {
  const search = req.query.search;
  const id = req.params.id;
  res.render("pages/add", { title: "Add Car", titleLink: "Add New Car", URL: req.url, search: search, editID: id });
});
router.get("/cars/edit/:id", editCar);
router.post("/cars/create", upload, createNewCar);
router.post("/cars/update/:id", upload, updateCar);
router.post("/cars/delete/:id", deleteCar);

export default router;

import Car from "../models/cars.js";
import fs from "fs";

const getAllCars = async (req, res) => {
  console.log(req.url);
  try {
    const result = await Car.findAll();
    res.render("pages/index", { title: "Home page", cars: result, URL: req.url });
  } catch (error) {
    console.error(error);
  }
};

const createNewCar = async (req, res) => {
  console.log(req.url);
  // check if image doesn't exist
  if (req.file === undefined) {
    req.session.message = { type: "danger", message: "Please input a valid image" };
    return res.redirect("/cars/add");
  }

  // define the req body and image
  const { name, rentPrice, size, type } = req.body;
  const image = req.file.filename;

  // check image can't over than 3mb
  if (req.file.size > 3000000) {
    req.session.message = { type: "danger", message: "Image should be no more than 3MB" };
    return res.redirect("/cars");
  }

  // proses created
  try {
    await Car.create({ name, rentPrice, size, type, image }).then(() => {
      req.session.message = { type: "success", message: "Car has been created successfully" };
      res.redirect("/cars");
    });
  } catch (error) {
    console.log(error);
    req.session.message = { type: "danger", message: "Input a valid type field" };
    res.redirect("/cars");
  }
};

const editCar = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Car.findByPk(id);
    res.render("pages/edit", { title: "Edit Car", titleLink: "Update Car Information", car: result, URL: req.url });
  } catch (error) {
    res.redirect("/cars");
  }
};

const updateCar = async (req, res) => {
  // update image
  let newImage = "";
  if (req.file === undefined) {
    // if image not update
    newImage = req.body.old_image;
  } else if (req.file) {
    // if image update and delete old image
    newImage = req.file.filename;
    fs.unlink(`public/uploads/${req.body.old_image}`, function (err) {
      if (err) console.log(err);
      console.log("File deleted!");
    });
  }

  // define the req body and image
  const id = req.params.id;
  const { name, rentPrice, size, type } = req.body;

  // check image can't over than 3mb
  if (req.file.size > 3000000) {
    req.session.message = { type: "danger", message: "Image should be no more than 3MB" };
    return res.redirect("/cars");
  }

  // find id for update single car
  const findId = await Car.findByPk(id);
  if (!findId) {
    res.status(404).json({ message: `car with id ${id} not found` });
  } else {
    // proses updated
    try {
      await Car.update({ name, rentPrice, size, type, image: newImage }, { where: { id } }).then(() => {
        req.session.message = { type: "success", message: "Car has been updated successfully" };
        res.redirect("/cars");
      });
    } catch (error) {
      req.session.message = { type: "danger", message: `Cannot update car with id ${id}, please try again` };
      res.redirect("/cars");
    }
  }
};

const deleteCar = async (req, res) => {
  const id = req.params.id;

  // search id for delete local image
  const searchId = await Car.findByPk(id);

  // process deleted
  try {
    await Car.destroy({ where: { id } }).then(() => {
      req.session.message = { type: "success", message: `Car with id ${id} has been deleted successfully` };
      // delete local image
      fs.unlink(`public/uploads/${searchId.image}`, function (err) {
        if (err) console.log(err);
        console.log("File deleted!");
      });
      res.redirect("/cars");
    });
  } catch (error) {
    req.session.message = { type: "danger", message: `Cannot delete car with id ${id}, please try again` };
    res.redirect("/cars");
  }
};

export { getAllCars, createNewCar, editCar, updateCar, deleteCar };

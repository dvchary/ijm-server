const express = require("express");

const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../common-middleware");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const {
  addProject,
  getProjects,
  updateProjects,
  deleteProjects,
} = require("../controller/project");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/project/create",
  requireSignin,
  // superAdminMiddleware,
  adminMiddleware,
  upload.single("image"),
  addProject
);

router.get("/project/getprojet", getProjects);

router.post(
  "/project/update",
  requireSignin,
  superAdminMiddleware,
  upload.array("image"),
  updateProjects
);

router.post(
  "/project/delete",
  requireSignin,
  superAdminMiddleware,
  deleteProjects
);

module.exports = router;

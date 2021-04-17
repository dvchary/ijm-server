const express = require("express");
//const {  } = require('../controller/category');
const {
  requireSignin,
  adminMiddleware,
  uploadS3,
} = require("../common-middleware");

const {
  createUnit,
  getUnitsBySlug,
  getUnitDetailsById,
  deleteUnitById,
  getUnits,
} = require("../controller/unit");

const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");

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
  "/unit/create",
  requireSignin,
  adminMiddleware,
  uploadS3.array("unitPictures"),
  createUnit
);

router.get("/unit/:slug", getUnitsBySlug);
//router.get('/category/getcategory', getCategories);

router.get("/unit/:unitId", getUnitDetailsById);

router.delete(
  "/unit/deleteUniitById",
  requireSignin,
  adminMiddleware,
  deleteUnitById
);
router.post("/unit/getUnits", requireSignin, adminMiddleware, getUnits);

module.exports = router;

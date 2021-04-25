const express = require("express");

const router = express.Router();

const { requireSignin, adminMiddleware } = require("../common-middleware");

const { getAllMasters } = require("../controller/getallmasters");

router.get("/masters/getallmasters", getAllMasters);

module.exports = router;

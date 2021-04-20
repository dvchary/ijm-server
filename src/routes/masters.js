const express = require("express");

const router = express.Router();

const { requireSignin, adminMiddleware } = require("../common-middleware");

const { getMasters, addMaster } = require("../controller/masters");

router.get("/masters/getmasters", getMasters);
router.post("/masters/create", requireSignin, adminMiddleware, addMaster);

module.exports = router;

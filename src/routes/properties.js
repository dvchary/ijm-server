const express = require("express");

// const { requireSignin } = require("../common-middleware");
const router = express.Router();

const { getProperties } = require("../controller/properties");

router.get("/properties", getProperties);

module.exports = router;

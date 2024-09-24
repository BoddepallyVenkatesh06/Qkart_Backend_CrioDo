const express = require("express");
const userRoute = require("./user.route");
const authRoute = require("./auth.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");

const router = express.Router();

router.use("/products", productRoute);
router.use("/auth", authRoute);
router.use("/users",userRoute);
router.use("/cart", cartRoute);

module.exports = router;

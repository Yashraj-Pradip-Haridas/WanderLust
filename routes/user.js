const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User =  require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");



router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);


//Route middleware to authenticate requests - passport.authenticate()
router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect : '/login', failureFlash : true}), wrapAsync(userController.login));

router.get("/logout", userController.logout);

module.exports = router;
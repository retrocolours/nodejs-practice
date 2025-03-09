const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

router.get("/", pageController.getHomePage);
router.get("/about", pageController.getAboutPage);
router.get("/contact", pageController.getContactPage);
router.post("/contact", pageController.submitContactForm);

module.exports = router;

const Contact = require("../models/Contact");
const mongoose = require("mongoose");

// GET Home Page
exports.getHomePage = (req, res) => {
  res.render("pages/home", { title: "My Portfolio" });
};

// GET About Page
exports.getAboutPage = (req, res) => {
  res.render("pages/about", { title: "About Me" });
};

// GET Contact Page
exports.getContactPage = (req, res) => {
  res.render("pages/contact", { title: "Contact Me" });
};

// POST Contact Form Submission
exports.submitContactForm = async (req, res) => {
  try {
    console.log("Contact form submitted:", req.body);

    const contactCollection = mongoose.connection.db.collection("Contacts");
    await contactCollection.insertOne(req.body);

    console.log("Contact saved successfully!");

    res.render("pages/confirmation", {
      title: "Thank You",
      message: "Message Sent Successfully!",
    });
  } catch (err) {
    console.error("Error sending form", err);
    res.status(500).send("Server Error");
  }
};

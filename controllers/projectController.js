const mongoose = require("mongoose");
const Project = require("../models/Project");

// GET all projects
exports.getProjects = async (req, res) => {
  console.log("GET /projects route hit!"); // to see if the route is accessed

  try {
    const projects = await mongoose.connection.db
      .collection("Projects")
      .find()
      .toArray();

    console.log("Projects from DB:", projects); // to see if projects are fetched
    res.render("pages/projects", { title: "Projects", projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
};

// GET project details
exports.getProjectDetails = async (req, res) => {
  try {
    const project = await mongoose.connection.db
      .collection("Projects")
      .findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

    if (!project) {
      return res.status(404).render("pages/error");
    }

    res.render("pages/projectDetails", { title: project.title, project });
  } catch (err) {
    console.error("Error fetching project details:", err);
    res.status(500).send("Server Error");
  }
};

// Search projects
exports.searchProjects = async (req, res) => {
  try {
    const query = req.query.query;

    const projects = await mongoose.connection.db
      .collection("Projects")
      .find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { summary: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      })
      .toArray();

    res.render("pages/projects", { title: "Search Results", projects });
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).send("Server Error");
  }
};

const mongoose = require("mongoose");
const Project = require("../models/Project");

// GET all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    console.log("Retrieved Projects:", projects);

    res.render("pages/projects", { title: "Projects", projects });
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).send("Server Error");
  }
};

// GET project details
exports.getProjectDetails = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .render("pages/error", { title: "Project Not Found" });
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

    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { summary: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { tech: { $in: [query] } }, // Ensure `tech` is stored as an array
      ],
    });

    res.render("pages/projects", { title: "Search Results", projects });
  } catch (err) {
    console.error("Error fetching search results:", err);
    res.status(500).send("Server Error");
  }
};

// GET new project form
exports.getNewProjectForm = (req, res) => {
  res.render("pages/newProject", { title: "New Project" });
};

exports.createProject = async (req, res) => {
  try {
    const { title, summary, description, tech } = req.body;
    const screenshot = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/default.png"; // Save file path

    const newProject = new Project({
      title,
      summary,
      description,
      tech: tech.split(",").map((item) => item.trim()),
      screenshot,
    });

    await newProject.save();
    res.redirect("/projects");
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).send("Server Error");
  }
};

// GET edit project form
exports.getEditProjectForm = async (req, res) => {
  try {
    console.log("Fetching project for editing:", req.params.id);

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).send("Project not found");
    }

    console.log("Project found:", project);

    res.render("pages/editProject", { title: "Edit Project", project });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).send("Server Error");
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { title, summary, description, tech } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res
        .status(404)
        .render("pages/error", { title: "Project Not Found" });
    }

    if (req.file) {
      project.screenshot = `/uploads/${req.file.filename}`; // Update image if a new one is uploaded
    }

    project.title = title;
    project.summary = summary;
    project.description = description;
    project.tech = tech.split(",").map((item) => item.trim());

    await project.save();
    res.redirect("/projects");
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).send("Server Error");
  }
};

// POST delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .render("pages/error", { title: "Project Not Found" });
    }

    await project.deleteOne();
    res.redirect("/projects");
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).send("Server Error");
  }
};

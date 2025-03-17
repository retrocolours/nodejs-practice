const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectDetails,
  searchProjects,
  getNewProjectForm,
  createProject,
  getEditProjectForm,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

router.get("/", getProjects);
router.get("/search", searchProjects);
router.get("/new", getNewProjectForm);
router.post("/", createProject);
router.get("/:id/edit", getEditProjectForm);
router.post("/:id/update", updateProject);
router.post("/:id/delete", deleteProject);
router.get("/:id", getProjectDetails);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectDetails,
  searchProjects,
} = require("../controllers/projectController");

router.get("/", getProjects);
router.get("/search", searchProjects);
router.get("/:id", getProjectDetails);

module.exports = router;

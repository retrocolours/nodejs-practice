const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set storage for uploaded images (the way on your slides for some reason wasn't working, so I had to ask AI for help to write this part)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // to make file names unique
  },
});

const upload = multer({ storage: storage });

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
router.post("/", upload.single("screenshot"), createProject);
router.get("/:id/edit", getEditProjectForm);
router.post("/:id/update", upload.single("screenshot"), updateProject);
router.post("/:id/delete", deleteProject);
router.get("/:id", getProjectDetails);

module.exports = router;

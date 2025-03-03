const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// project data
const projectsFilePath = path.join(__dirname, "projects.json");
const projects = JSON.parse(fs.readFileSync(projectsFilePath, "utf-8"));

// Homepage
app.get("/", (req, res) => {
  if (req.query.format === "json") {
    return res.json({ message: "Welcome to My Node.js Portfolio!" });
  }
  res.render("pages/index", { title: "Home" });
});

// About
app.get("/about", (req, res) => {
  if (req.query.format === "json") {
    return res.json({
      name: "Tatiana Privezentseva",
      bio: "Web developer specializing in backend engineering.",
    });
  }
  res.render("pages/about", { title: "About Me" });
});

// Projects
app.get("/projects", (req, res) => {
  if (req.query.format === "json") {
    return res.json(projects);
  }
  res.render("pages/projects", { title: "Projects", projects });
});

// Search Projects
app.get("/projects/search", (req, res) => {
  const query = req.query.query ? req.query.query.toLowerCase() : "";
  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(query) ||
      project.summary.toLowerCase().includes(query)
  );

  if (req.query.format === "json") {
    return res.json({ searchTerm: query, results: filteredProjects });
  }

  res.render("pages/projects", {
    title: "Projects",
    projects: filteredProjects,
  });
});

// Project Details
app.get("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id));

  if (!project) {
    return res.status(404).render("pages/error", { title: "404 Not Found" });
  }

  if (req.query.format === "json") {
    return res.json(project);
  }

  res.render("pages/projectDetails", { title: project.title, project });
});

// Contact (GET)
app.get("/contact", (req, res) => {
  res.render("pages/contact", { title: "Contact" });
});

// Contact (POST)
app.post("/contact", (req, res) => {
  console.log(req.body);
  if (req.query.format === "json") {
    return res.json({ success: true, message: "Thank you for reaching out!" });
  }
  res.render("pages/confirmation", { title: "Thank You" });
});

// 404
app.use((req, res) => {
  res.status(404).render("pages/error", { title: "404 Not Found" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

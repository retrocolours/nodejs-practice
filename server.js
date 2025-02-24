const express = require("express");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const projectsFilePath = path.join(__dirname, "projects.json");
const projects = JSON.parse(fs.readFileSync(projectsFilePath, "utf-8"));

// Homepage
app.get("/", (req, res) => {
  if (req.query.format === "json") {
    res.json({ message: "Welcome to My Node.js Portfolio!" });
  } else {
    res.sendFile(path.join(__dirname, "pages", "index.html"));
  }
});

// About
app.get("/about", (req, res) => {
  if (req.query.format === "json") {
    res.json({
      name: "Tatiana Privezentseva",
      bio: "Web developer specializing in backend engineering.",
    });
  } else {
    res.sendFile(path.join(__dirname, "pages", "about.html"));
  }
});

// Projects
app.get("/projects", (req, res) => {
  if (req.query.format === "json") {
    return res.json(projects);
  }

  let html = fs.readFileSync(
    path.join(__dirname, "pages", "projects.html"),
    "utf-8"
  );

  const projectCards = projects
    .map((project) => {
      return `
        <div class="project-card">
          <h2>${project.title}</h2>
          <p>${project.summary}</p>
          <ul>
            ${project.tech.map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          <img src="${project.screenshot}" alt="${project.title} screenshot">
          <a href="/projects/${project.id}">View Details</a>
        </div>
      `;
    })
    .join("");

  html = html.replace("{{projects}}", projectCards);
  res.send(html);
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

  let html = fs.readFileSync(
    path.join(__dirname, "pages", "projects.html"),
    "utf-8"
  );

  const projectCards = filteredProjects
    .map((project) => {
      return `
        <div class="project-card">
          <h2>${project.title}</h2>
          <p>${project.summary}</p>
          <img src="${project.screenshot}" alt="${project.title} screenshot"/>
          <ul>
            ${project.tech.map((tech) => `<li>${tech}</li>`).join("")}
          </ul>
          <a href="/projects/${project.id}">View Details</a>
        </div>
      `;
    })
    .join("");

  html = html.replace("{{projects}}", projectCards);
  res.send(html);
});

// Project Details
app.get("/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === parseInt(req.params.id));

  if (!project) {
    return res.status(404).send("<h1>Project Not Found</h1>");
  }

  if (req.query.format === "json") {
    return res.json(project);
  }

  let html = fs.readFileSync(
    path.join(__dirname, "pages", "projectDetails.html"),
    "utf-8"
  );

  html = html
    .replace(/{{title}}/g, project.title)
    .replace(/{{summary}}/g, project.summary)
    .replace(/{{tech}}/g, project.tech.join(", "))
    .replace(/{{screenshot}}/g, project.screenshot);

  res.send(html);
});

// Contact (GET)
app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "contact.html"));
});

// Contact (POST)
app.post("/contact", (req, res) => {
  if (req.query.format === "json") {
    res.json({ success: true, message: "Thank you for reaching out!" });
  } else {
    res.sendFile(path.join(__dirname, "pages", "confirmation.html"));
  }
});

// 404 Handler
app.use((req, res) => {
  if (req.query.format === "json") {
    res.json({
      success: true,
      message: "Sorry, something went wrong or the page is not found!",
    });
  } else {
    res.status(404).sendFile(path.join(__dirname, "pages", "error.html"));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
